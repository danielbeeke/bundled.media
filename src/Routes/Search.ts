import { BaseRoute } from './BaseRoute.ts'
import { dataSources as createDataSources } from '../../.env.ts'
import { AbstractQuery } from '../Core/AbstractQuery.ts'
import { BaseDataSource } from '../DataSources/BaseDataSource.ts'
import { Thing } from '../schema.org.ts';

type DataFetchObject = {
  page: number,
  promise: Promise<void>,
  rawItems: Array<Thing>,
  normalizedItems: Array<Thing>,
  filteredItems: Array<Thing>,
}

/**
 * A sync route. 
 * It searches through multiple APIs at once.
 * We try to spread out items from all the different APIs.
 */
export class SearchRoute extends BaseRoute {

  static path = '/search'
  public max = 20

  #fetches: Map<BaseDataSource, Array<DataFetchObject>> = new Map()

  /**
   * The route handler. 
   * We create a fresh set of dataSources and then fetch results.
   */
  async handle () {
    const query = new AbstractQuery(this.url)
    const dataSources = createDataSources()

    let page = 0

    /**
     * Fetch all needed data
     */
    while (dataSources.some(dataSource => !dataSource.done) && this.getResultCount('all') < this.max) {
      const ItemCountFinishedSources = this.getResultCount('done')
      const average = (this.max - ItemCountFinishedSources) / dataSources.filter(dataSource => !dataSource.done).length
      let dataSourceIndex = 0
      const promises = []

      for (const dataSource of dataSources) {
        if (!dataSource.done && this.getResultCount('all', dataSource) < average)
          promises.push(this.fetch(dataSource, query, page, query.pagenation[dataSourceIndex]))
        dataSourceIndex++
      }

      await Promise.all(promises)
      page++
    }

    /**
     * Determine the pagination state per source.
     * TODO this will get more complicated when there is a specific filter that the source does not support and we support a second level of filtering.
     */
    let items = []

    const correctMax = Math.min(this.max, this.getResultCount())
    const counters = new Map()
    const mergedFilteredItems = new Map()

    for (const [dataSource, dataSourcefetches] of this.#fetches.entries())
      mergedFilteredItems.set(dataSource, dataSourcefetches.flatMap(dataSourcefetch => dataSourcefetch.filteredItems))

    while (items.length < correctMax) {
      for (const dataSource of this.#fetches.keys()) {
        let counter = counters.get(dataSource) ?? 0
        items.push(mergedFilteredItems.get(dataSource)[counter])
        counter++
        counters.set(dataSource, counter)
      }
    }

    /**
     * Create the next URL.
     */
    const nextUrl = new URL(this.url.toString())
    const paginationString = [...this.#fetches.keys()].map((dataSource, index) => {
      return (counters.get(dataSource) ?? 0) + (query.pagenation[index] ?? 0)
    }).join(',')
    nextUrl.searchParams.set('pagination', paginationString)

    return new Response(JSON.stringify({
      items: items,
      nextUrl
    }, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  /**
   * Fetches data for one source.
   * Page sizes may differ.
   */
  fetch (dataSource: BaseDataSource, query: AbstractQuery, page = 0, offset = 0) {
    const dataSourcefetches: Array<DataFetchObject> = this.#fetches.get(dataSource) ?? []

    const dataSourceFetch: DataFetchObject = {
      page,
      rawItems: [],
      normalizedItems: [],
      filteredItems: [],
      promise: dataSource.fetch(query, page, offset).then((items: Array<any>) => {
        dataSourceFetch.normalizedItems = items.map((item: any) => dataSource.normalize(item))
        dataSourceFetch.filteredItems = this.filter(dataSourceFetch.normalizedItems)
      })
    }

    dataSourcefetches.push(dataSourceFetch)
    this.#fetches.set(dataSource, dataSourcefetches)

    return dataSourceFetch.promise
  }

  // No real filtering yet. TODO Here we will add filtering on the normalized data.
  filter (normalizedItems: Array<Thing>) {
    return normalizedItems
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

}