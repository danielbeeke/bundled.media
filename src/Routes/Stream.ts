import { BaseRoute } from './BaseRoute.ts'
// import { Search } from '../../src2/Search/Search.ts'
import { Stream } from '../Stream/Stream.ts'
import { sources } from '../../.env.ts'

/**
 * A route with a sync response. 
 * It searches through multiple APIs at once.
 * We try to spread out items from all the different APIs.
 */
export class StreamRoute extends BaseRoute {

  static mime = 'application/json-stream; charset=utf-8'

  static path = '/stream'
  static description = `Search and filter through all the enabled sources in a streaming way.`


  /**
   * The route handler. 
   * We create a fresh set of dataSources and then fetch results.
   */
  handle () {
    const searcher = new Stream(sources)
    return searcher.execute({ limit: 20 })
  }

  /**
   * The template for the HyperMedia response
   * We handle the HTML clientside.
   */
  async template (_variables: { [key: string]: string }){ 
    return await `
      <script src="/stream.ts" type="module"></script>
    `
  }

}