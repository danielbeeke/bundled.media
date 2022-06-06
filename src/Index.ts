import { SearchRoute } from './Routes/Search.ts'

const port = Deno.env.get('PORT') ? parseInt(Deno.env.get('PORT')!) : 8080
const server = Deno.listen({ port })
console.info(`bundled.media is running locally at: http://localhost:${port}/`)

const routes = [
  SearchRoute
]

for await (const conn of server) serveHttp(conn)

async function serveHttp(connection: Deno.Conn) {
  const httpConnection = Deno.serveHttp(connection)
  for await (const requestEvent of httpConnection) {
    const requestURL = new URL(requestEvent.request.url)
    const urlParams = new URLSearchParams(requestURL.search)

    const allowsInteractive = !urlParams.has('force-json') && 
      requestEvent.request.headers.get('accept')?.includes('text/html')

    const matchedRoute = routes.find(route => route.path === requestURL.pathname)

    if (matchedRoute) {

      // We allow HTML output when the route exists as an endpoint.
      // This allows for easy learning of the API similar to HyperMedia.
      if (allowsInteractive) {
        const body = Deno.readTextFileSync('./src/Public/index.html')
        return requestEvent.respondWith(
          new Response(new TextEncoder().encode(body), { status: 200 }),
        )
      }

      // This is the JSON output of endpoints.
      const initiatedRoute = new matchedRoute(requestEvent)
      try {
        const response = initiatedRoute.handle()
        return requestEvent.respondWith(response) 
      }
      catch (exception) {
        requestEvent.respondWith(
          new Response(`Something went wrong: ${exception}`, { status: 500 })
        )
      }
    }

    requestEvent.respondWith(
      new Response(`Page not found`, { status: 404 })
    )  
  }
}