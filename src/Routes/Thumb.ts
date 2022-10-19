import { BaseRoute } from './BaseRoute.ts'
import thumbnailer from 'npm:simple-thumbnail'
import nodeToWebStream from 'npm:readable-stream-node-to-web'

/**
 * A route with a sync response. 
 * It searches through multiple APIs at once.
 * We try to spread out items from all the different APIs.
 */
export class ThumbRoute extends BaseRoute {

  static path = '/thumb/:*url'
  static description = `Generate a thumbnail from an mp4.`
  static mime = 'image/png'

  /**
   * The route handler. 
   * We create a fresh set of dataSources and then fetch results.
   */
  async handle () {
    const thumb = await thumbnailer(this.params.url, null, '600x?', { seek: '00:00:00' })
    return nodeToWebStream(thumb)
  }

  async template () {
    return `<img src=${`/thumb/${this.params.url}`} />`
  }
}