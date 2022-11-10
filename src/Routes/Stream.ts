import { BaseRoute } from './BaseRoute.ts'
import { Search } from '../../src2/Search/Search.ts'

import { excelSource } from '../../src2/Sources/Excel/ExcelTestSource.ts'
import { apiBibleSource } from '../../src2/Sources/ApiBible/ApiBibleTestSource.ts'
import { gsunGrabSource } from '../../src2/Sources/GsunGrab/GsunGrabTestSource.ts'
import { jesusFilmSource } from '../../src2/Sources/JesusFilm/JesusFilmTestSource.ts'
import { lightNetSource } from '../../src2/Sources/LightNet/LightNetTestSource.ts'
import { youTubeSource } from '../../src2/Sources/YouTube/YouTubeTestSource.ts'


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
    const sources = [
      excelSource,
      apiBibleSource,
      gsunGrabSource,
      jesusFilmSource,
      lightNetSource,
      youTubeSource
    ]
    
    const searcher = new Search(sources)

    const stream = searcher.execute({
      limit: 20
    })
    return stream
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