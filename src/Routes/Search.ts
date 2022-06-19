import { BaseRoute } from './BaseRoute.ts'
import { dataSources as createDataSources } from '../../.env.ts'
import { AbstractQuery } from '../Core/AbstractQuery.ts'
import { BaseDataSource } from '../DataSources/BaseDataSource.ts'
import { Thing } from '../schema.org.ts';
import { natsort } from '../Helpers/natsort.js'
import { tryToExtractLanguage } from '../Helpers/tryToExtractLanguage.ts'
import { baseUrl } from '../../.env.ts'

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
  public rangeSize = 3

  #fetches: Map<BaseDataSource, Array<DataFetchObject>> = new Map()
  #sources: Array<BaseDataSource> = []
  #query: AbstractQuery = new AbstractQuery(this.url)
  #counters: Map<BaseDataSource, number> = new Map()
  #lastIndex = 0

  /**
   * The route handler. 
   * We create a fresh set of dataSources and then fetch results.
   */
  async handle () {
    this.#query = new AbstractQuery(this.url)
    this.#sources = createDataSources()
    .filter(source => !this.#query.types.length || this.#query.types.some(type => source.types().includes(type)))
    this.applyPreviousState(this.#query)

    await this.fetchDataForResponse()
    const items = this.aggregateFetchedResults()

    // Sorting
    const sorter = natsort({ insensitive: true })
    items.sort((a: any, b: any) => sorter(a.name, b.name))

    return {
      items: items,
      nextUrl: this.createNextUrl()
    }
  }

  /**
   * If we are in a second page or further,
   * it might be that some sources are already done, save that into the current state.
   */
  applyPreviousState (query: AbstractQuery) {
    this.#lastIndex = this.#query.lastIndex;

    for (const [index, dataSource] of this.#sources.entries()) {
      if (query.pagenation[index] === 'd') dataSource.done = true
    }
  }

  /**
   * Fetch all needed data
   */
  async fetchDataForResponse () {
    while (this.#sources.some(dataSource => !dataSource.done) && this.getResultCount('all') < this.max) {
      const finishedSourcesItemCount = this.getResultCount('done')
      // TODO average is probably to low. Investigate how to get a better number.
      const average = (this.max - finishedSourcesItemCount) / this.#sources.filter(dataSource => !dataSource.done).length
      const promises = []

      // Add a total counter, otherwise the loop would never end if there are less sources left then the rangeSize
      let totalCounter = 0
      let dataSourceCount = 0
      while (dataSourceCount < this.rangeSize && totalCounter < this.#sources.length) {
        const dataSource = this.#sources[this.#lastIndex]
        if(!dataSource.done && this.getResultCount('all', dataSource) < average) {
          let sourcePagination = this.#query.pagenation[this.#lastIndex]

          if (['page', 'offset'].includes(dataSource.paginationType) && sourcePagination && typeof sourcePagination === 'string')  {
            sourcePagination = parseInt(sourcePagination)
          }

          promises.push(this.fetch(dataSource, this.#query, sourcePagination))
          dataSourceCount++
        }

        this.#lastIndex = this.#lastIndex === this.#sources.length - 1 ? 0 : this.#lastIndex + 1;
        totalCounter++
      }

      await Promise.all(promises)
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
      normalizedItems: [], // TODO free from memory.
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
    return normalizedItems
    .filter((item: any) => query.langCode && !dataSource.nativelySupports.langCode ? 
      query.langCode.includes(item.inLanguage) : true)
    .filter((item: any) => query.sources.length ? 
      query.sources.includes(dataSource.identifier()) : true)
    .filter((item: any) => query.text && !dataSource.nativelySupports.text ? 
      item.name.toLocaleLowerCase().includes(query.text) : true)
    .filter((item: any) => query.types.length && !dataSource.nativelySupports.types ? 
      query.types.map(type => type.split('/').pop()).includes(item['@type']) : true)
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
   * Grabs from each sources an item until we have enough.
   */
  aggregateFetchedResults () {
    const items: Array<Thing> = []

    const correctMax = Math.min(this.max, this.getResultCount())
    const mergedFilteredItems = new Map()

    for (const [dataSource, dataSourcefetches] of this.#fetches.entries())
      mergedFilteredItems.set(dataSource, dataSourcefetches.flatMap(dataSourcefetch => dataSourcefetch.filteredItems))

    while (items.length < correctMax) {
      for (const dataSource of this.#fetches.keys()) {
        let counter = this.#counters.get(dataSource) ?? 0
        const sourceMergedFilteredItems = mergedFilteredItems.get(dataSource)
        if (sourceMergedFilteredItems.length && sourceMergedFilteredItems[counter] && items.length < correctMax) {
          items.push(sourceMergedFilteredItems[counter])
          counter++
          this.#counters.set(dataSource, counter)  
        }
      }
    }

    return items
  }

  /**
   * Create the next URL.
   */
   createNextUrl () {
    let nextUrl: false | URL = false
    
    if (this.#sources.some(dataSource => !dataSource.done)) {
      nextUrl = new URL(this.url.toString())
      nextUrl.hostname = baseUrl.hostname
      nextUrl.protocol = baseUrl.protocol
      nextUrl.host = baseUrl.host
      nextUrl.port = baseUrl.port

      const paginationString = this.#sources.map((dataSource, index) => {
        if (dataSource.done) return 'd'

        if (dataSource.paginationType === 'offset') {
          return (this.#counters.get(dataSource) ?? 0) + (this.#query.pagenation[index] ? parseInt(this.#query.pagenation[index] + '') : 0 ?? 0)
        }

        if (dataSource.paginationType === 'page') {
          return (Math.max(this.#fetches.get(dataSource)?.length ?? 0, 0) ?? 0) + (this.#query.pagenation[index] ? parseInt(this.#query.pagenation[index] + '') : 0 ?? 0)
        }

        if (dataSource.paginationType === 'token')
          return dataSource.getLastToken()

        throw new Error(`Pagination type: ${dataSource.paginationType} is not yet implemented`)
      }).join('|')
      nextUrl.searchParams.set('pagination', paginationString)  
      nextUrl.searchParams.set('lastIndex', this.#lastIndex.toString())
    }

    return nextUrl
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