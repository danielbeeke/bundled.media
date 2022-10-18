export abstract class BaseRoute {

  public url: URL
  public params: { [key: string]: any} = {}
  public request: Request

  constructor (request: Request, params: { [key: string]: any}) {
    this.url = new URL(request.url)
    this.request = request
    this.params = params
  }

  static path: string
  static description = ''

  static mime = 'application/json'

  public abstract handle (): Promise<any> | any

  async htmlVariables () {
    return await {
      title: 'bundled.media'
    }
  }

  // async htmlVariables () {
  //   return Object.assign(await super.htmlVariables(), {
      
  //   })
  // }

  async template (_variables: { [key: string]: any }) {
    return await ``
  }
  
}