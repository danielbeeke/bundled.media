import { BaseRoute } from './BaseRoute.ts'
import { dataSources as createDataSources } from '../../.env.ts'
import { AbstractQuery } from '../Core/AbstractQuery.ts'
import { BaseDataSource } from '../DataSources/BaseDataSource.ts'
import { Thing } from '../schema.org.ts';

type DataFetchObject = {
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
  public max = 50

  #fetches: Map<string, Array<DataFetchObject>> = new Map()

  /**
   * The route handler. 
   * We create a fresh set of dataSources and then fetch results.
   */
  async handle () {
    const query = new AbstractQuery(this.url)
    const dataSources = createDataSources()

    let page = 0
    
    while (dataSources.some(dataSource => !dataSource.done) && this.results.length < this.max) {
      await Promise.all(this.fetch(dataSources, query, page))
      page++
    }

    return new Response(JSON.stringify({
      items: this.results
    }, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // TODO Move to be one fetch for one dataSource?
  // It might give better flow for making sure sources have equals changes to fill the result set.

  // Goes through all the sources and fetches for  the current given page. (See above.. if page sizes do not match this it no a good plan)
  fetch (dataSources: Array<BaseDataSource<any, any>>, query: AbstractQuery, page = 0) {
    const promises: Array<Promise<any>> = []

    for (const dataSource of dataSources) {
      const dataSourcefetches: Array<DataFetchObject> = this.#fetches.get(dataSource.constructor.name) ?? []
      const dataSourceFetch: DataFetchObject = {
        rawItems: [],
        normalizedItems: [],
        filteredItems: [],
        promise: dataSource.fetch(query, page).then((items: any) => {
          dataSourceFetch.normalizedItems = items.map((item: any) => dataSource.normalize(item))
          dataSourceFetch.filteredItems = this.filter(dataSourceFetch.normalizedItems)
        })
      }

      promises.push(dataSourceFetch.promise)

      dataSourcefetches.push(dataSourceFetch)
      this.#fetches.set(dataSource.constructor.name, dataSourcefetches)
    }

    return promises
  }

  // No real filtering yet. TODO Here we will add filtering on the normalized data.
  filter (normalizedItems: Array<Thing>) {
    return normalizedItems
  }

  /**
   * This extracts all the filtered items from the seperate fetches and sources into one array.
   */
  get results () {
    return [...this.#fetches.values()]
    .flatMap(dataSourcefetches => dataSourcefetches.flatMap(dataSourceFetch => dataSourceFetch.filteredItems))
  }

}