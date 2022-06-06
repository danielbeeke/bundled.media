export abstract class BaseRoute {

  public event: Deno.RequestEvent

  constructor (requestEvent: Deno.RequestEvent) {
    this.event = requestEvent
  }

  static path: string

  public abstract handle (): Promise<Response>
}