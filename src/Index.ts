import { serve } from 'https://deno.land/std@0.125.0/http/server.ts'
import routes from './Routes/routes.ts'
import layout from './Templates/layout.ts'
import { dataSources as createDataSources } from '../.env.ts'
import { serveFile } from 'https://deno.land/std@0.140.0/http/file_server.ts'

const port = Deno.env.get('PORT') ? parseInt(Deno.env.get('PORT')!) : 8080
serve(serveHttp, { port });
console.info(`bundled.media is running locally at: http://localhost:${port}/`)

async function serveHttp(request: Request) {
  const requestURL = new URL(request.url)
  const urlParams = new URLSearchParams(requestURL.search)

  const allowsInteractive = !urlParams.has('force-json') && 
    request.headers.get('accept')?.includes('text/html')

  const matchedRoute = routes.find(route => route.path === requestURL.pathname)

  if (matchedRoute) {
    const initiatedRoute = new matchedRoute(request)

    // We allow HTML output when the route exists as an endpoint.
    // This allows for easy learning of the API similar to HyperMedia.
    if (allowsInteractive) {
      const variables = await initiatedRoute.htmlVariables()
      const templateResult = await initiatedRoute.template(variables)
      const body = layout(Object.assign(variables, {
        body: templateResult
      }))
      return new Response(new TextEncoder().encode(body), { status: 200 })
    }

    // This is the JSON output of endpoints.
    try {
      const json = await initiatedRoute.handle()
      return new Response(JSON.stringify(json, null, 2), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Fallback to error page.
    catch (exception) {
      console.log(exception)
      return new Response(`Something went wrong: ${exception}`, { status: 500 })
    }
  }

  // Try static resources.
  try {
    const file = await Deno.readTextFile('./src/Public' + requestURL.pathname)
    if (file) {
      return await serveFile(request, './src/Public' + requestURL.pathname)
    }  
  }
  catch {
    // We continue with a 404.
  }

  // Fallback to not found page.
  return new Response(`Page not found`, { status: 404 })
}

/**
 * Trigger the constructors so sources can cache stuff on startup.
 */
for (const source of createDataSources()) {
  source.boot()
}