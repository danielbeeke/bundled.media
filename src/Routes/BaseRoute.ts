export abstract class BaseRoute {

  public url: URL

  constructor (request: Request) {
    this.url = new URL(request.url)
  }

  static path: string

  public abstract handle (): Promise<Response>
}