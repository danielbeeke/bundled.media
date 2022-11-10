import { BaseRoute } from './BaseRoute.ts'

import { Stream } from '../Stream/Stream.ts'
import { excelSource } from '../Sources/Excel/ExcelTestSource.ts'
import { apiBibleSource } from '../Sources/ApiBible/ApiBibleTestSource.ts'
import { gsunGrabSource } from '../Sources/GsunGrab/GsunGrabTestSource.ts'
import { jesusFilmSource } from '../Sources/JesusFilm/JesusFilmTestSource.ts'
import { lightNetSource } from '../Sources/LightNet/LightNetTestSource.ts'
import { youTubeSource } from '../Sources/YouTube/YouTubeTestSource.ts'


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
    
    const streamer = new Stream(sources)
    return streamer.execute({ limit: 20 })
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