import Navbar from '../components/Navbar.tsx'
export abstract class BaseRoute {

  public url: URL
  public params: { [key: string]: any} = {}
  public request: Request
  public allowsInteractive = true

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
      title: 'bundled.media',
      links: ['about', 'stream', 'search']
    }
  }

  async template (_variables: { [key: string]: any }) {
    return await ``
  }
  
}