import { BaseRoute } from './BaseRoute.ts'
import { Search } from '../Search/Search.ts'

/**
 * A route with a sync response. 
 * It searches through multiple APIs at once.
 * We try to spread out items from all the different APIs.
 */
export class SearchRoute extends BaseRoute {

  static path = '/search'
  static description = `Search and filter through all the enabled sources in a synchronous way.`


  /**
   * The route handler. 
   * We create a fresh set of dataSources and then fetch results.
   */
  async handle () {
    console.log(this.url)
    const searcher = new Search({ limit: 20 })
    return await searcher.handle()
  }

  /**
   * The template for the HyperMedia response
   * We handle the HTML clientside.
   */
  async template (_variables: { [key: string]: string }){ 
    return await `
      <script src="/search.ts" type="module"></script>
    `
  }

}