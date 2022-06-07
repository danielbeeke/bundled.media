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

export class SearchRoute extends BaseRoute {

  static path = '/search'
  public max = 50

  #fetches: Map<string, Array<DataFetchObject>> = new Map()

  async handle () {
    const query = new AbstractQuery(this.url)
    const dataSources = createDataSources()
    
    while (dataSources.some(dataSource => !dataSource.done) && this.results.length !== this.max) {
      await Promise.all(this.fetch(dataSources, query))
    }

    return new Response(JSON.stringify(this.results, null, 2), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

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

  filter (normalizedItems: Array<Thing>) {
    return normalizedItems
  }

  get results () {
    return [...this.#fetches.values()].flatMap(dataSourcefetches => dataSourcefetches.flatMap(dataSourceFetch => dataSourceFetch.filteredItems))
  }

}