export abstract class BaseRoute {

  public url: URL

  constructor (request: Request) {
    this.url = new URL(request.url)
  }

  static path: string

  public abstract handle (): Promise<any>

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