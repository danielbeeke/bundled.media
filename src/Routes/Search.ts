import { BaseRoute } from './BaseRoute.ts'
import { dataSources as createDataSources } from '../../.env.ts'
import { AbstractQuery } from '../Core/AbstractQuery.ts'
import { BaseDataSource } from '../DataSources/BaseDataSource.ts'
import { Thing } from '../schema.org.ts';
import { natsort } from '../Helpers/natsort.js'
import { tryToExtractLanguage } from '../Helpers/tryToExtractLanguage.ts'

type DataFetchObject = {
  page: number,
  promise: Promise<void>,
  normalizedItems: Array<Thing>,
  filteredItems: Array<Thing>,
}

/**
 * A route with a sync response. 
 * It searches through multiple APIs at once.
 * We try to spread out items from all the different APIs.
 */
export class SearchRoute extends BaseRoute {

  static path = '/search'
  static description = `Search and filter through all the enabled sources in a synchronous way.`

  public max = 20

  #fetches: Map<BaseDataSource, Array<DataFetchObject>> = new Map()

  /**
   * The route handler. 
   * We create a fresh set of dataSources and then fetch results.
   */
  async handle () {
    const query = new AbstractQuery(this.url)
    const dataSources = createDataSources()
    .filter(source => !query.types.length || query.types.some(type => source.types().includes(type)))

    /**
     * Fetch all needed data
     */
    while (dataSources.some(dataSource => !dataSource.done) && this.getResultCount('all') < this.max) {
      const ItemCountFinishedSources = this.getResultCount('done')
      const average = (this.max - ItemCountFinishedSources) / dataSources.filter(dataSource => !dataSource.done).length
      let dataSourceIndex = 0
      const promises = []

      for (const dataSource of dataSources) {
        if (!dataSource.done && this.getResultCount('all', dataSource) < average && query.pagenation[dataSourceIndex] !== 'done') {
          promises.push(this.fetch(dataSource, query, query.pagenation[dataSourceIndex]))
        }
        dataSourceIndex++
      }

      await Promise.all(promises)
    }

    /**
     * Determine the pagination state per source.
     */
    const items: Array<Thing> = []

    const correctMax = Math.min(this.max, this.getResultCount())
    const counters = new Map()
    const mergedFilteredItems = new Map()

    for (const [dataSource, dataSourcefetches] of this.#fetches.entries())
      mergedFilteredItems.set(dataSource, dataSourcefetches.flatMap(dataSourcefetch => dataSourcefetch.filteredItems))

    while (items.length < correctMax) {
      for (const dataSource of this.#fetches.keys()) {
        let counter = counters.get(dataSource) ?? 0
        const sourceMergedFilteredItems = mergedFilteredItems.get(dataSource)
        if (sourceMergedFilteredItems.length && sourceMergedFilteredItems[counter]) {
          items.push(sourceMergedFilteredItems[counter])
          counter++
          counters.set(dataSource, counter)  
        }
      }
    }

    // Sorting
    const sorter = natsort({ insensitive: true })
    items.sort((a: any, b: any) => sorter(a.name, b.name))

    /**
     * Create the next URL.
     */
    let nextUrl: false | URL = false
    if (dataSources.some(dataSource => !dataSource.done)) {
      nextUrl = new URL(this.url.toString())
      const paginationString = [...this.#fetches.keys()].map((dataSource, index) => {
        if (dataSource.done) return 'done'

        if (dataSource.paginationType === 'offset') {
          return (counters.get(dataSource) ?? 0) + (query.pagenation[index] ? parseInt(query.pagenation[index] + '') : 0 ?? 0)
        }

        if (dataSource.paginationType === 'page') {
          return (Math.max(this.#fetches.get(dataSource)!.length, 0) ?? 0) + (query.pagenation[index] ? parseInt(query.pagenation[index] + '') : 0 ?? 0)
        }

        if (dataSource.paginationType === 'token')
          return dataSource.getLastToken()

        throw new Error(`Pagination type: ${dataSource.paginationType} is not yet implemented`)
      }).join(',')
      nextUrl.searchParams.set('pagination', paginationString)  
    }

    return {
      items: items,
      nextUrl
    }
  }

  /**
   * Fetches data for one source.
   * Page sizes may differ.
   */
  fetch (dataSource: BaseDataSource, query: AbstractQuery, offset: undefined | string | number = undefined) {
    const dataSourcefetches: Array<DataFetchObject> = this.#fetches.get(dataSource) ?? []

    const page = dataSourcefetches.length

    const dataSourceFetch: DataFetchObject = {
      page,
      normalizedItems: [],
      filteredItems: [],
      promise: dataSource.fetch(query, page, offset).then((items: Array<any>) => {
        dataSourceFetch.normalizedItems = items.map((item: any) => {
          const normalizedItem = dataSource.normalize(item) as any

          if (!normalizedItem.inLanguage) {
            if (typeof dataSource.options.langCode === 'string')
              normalizedItem.inLanguage = dataSource.options.langCode

            if (typeof dataSource.options.langCode === 'function')
              normalizedItem.inLanguage = dataSource.options.langCode(normalizedItem)

            if (!normalizedItem.inLanguage) {
              normalizedItem.inLanguage = tryToExtractLanguage(normalizedItem.name)
            }
          }

          normalizedItem.publisher = dataSource.publisher

          return normalizedItem
        })

        dataSourceFetch.filteredItems = this.filter(dataSource, dataSourceFetch.normalizedItems, query)
      })
    }

    dataSourcefetches.push(dataSourceFetch)
    this.#fetches.set(dataSource, dataSourcefetches)

    return dataSourceFetch.promise
  }

  /**
   * This is the second filtering.
   * If the source support full text search / langCode filtering / or type selection we do not repeat that process.
   */
  filter (dataSource: BaseDataSource, normalizedItems: Array<Thing>, query: AbstractQuery) {
    const filteredItems = normalizedItems
    .filter((item: any) => query.langCode && !dataSource.nativelySupports.langCode ? query.langCode.includes(item.inLanguage) : true)
    .filter((item: any) => query.sources.length ? query.sources.includes(dataSource.identifier()) : true)
    .filter((item: any) => query.text && !dataSource.nativelySupports.text ? item.name.toLocaleLowerCase().includes(query.text) : true)
    .filter((item: any) => query.types.length && !dataSource.nativelySupports.types ? query.types.map(type => type.split('/').pop()).includes(item['@type']) : true)

    return filteredItems
  }

  /**
   * This extracts all the filtered items from the seperate fetches and sources into one array.
   */
  getResultCount (type: 'all' | 'done' = 'all', filterSource: BaseDataSource | undefined = undefined) {
    return [...this.#fetches.entries()]
    .flatMap(([source, dataSourcefetches]) => 
      (filterSource && source === filterSource || !filterSource) &&
        (type === 'done' && source.done || type === 'all') ? 
          dataSourcefetches.flatMap(dataSourceFetch => dataSourceFetch.filteredItems) : []).length
  }

  /**
   * The template for the HyperMedia response
   * We handle the HTML clientside.
   */
  async template (_variables: { [key: string]: any }){ 
    return await `
      <script src="/search.js" type="module"></script>
    `
  }

}