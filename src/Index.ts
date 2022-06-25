import { serve } from 'https://deno.land/std@0.125.0/http/server.ts'
import routes from './Routes/routes.ts'
import layout from './Templates/layout.ts'
import { dataSources as createDataSources } from '../.env.ts'
import { serveFileWithTs } from './Core/ServeTs.ts'

const port = Deno.env.get('PORT') ? parseInt(Deno.env.get('PORT')!) : 8080
serve(serveHttp, { port });
console.info(`bundled.media is running locally at: http://localhost:${port}/`)

const toPathRegex = (path: string) => {
  return path.split('/').map((part: string) => {
    if (part.substring(0, 2) === ':*') return `(?<${part.substring(2)}>[a-z0-9\/:.\_-]+)`
    else if (part[0] === ':') return `(?<${part.substring(1)}>[a-z0-9]+)`
    return part
  }).join('/') + '$'
}

async function serveHttp(request: Request) {
  const requestURL = new URL(request.url)
  const urlParams = new URLSearchParams(requestURL.search)
  const params = {}

  const allowsInteractive = !urlParams.has('force-json') && 
    request.headers.get('accept')?.includes('text/html')

  const matchedRoute = routes.find(route => {
    const regex = new RegExp(toPathRegex(route.path), 'imsu')
    const matched = regex.test(requestURL.pathname)

    if (matched) {
      Object.assign(params, requestURL.pathname.match(regex)?.groups)
    }

    return matched
  })

  if (matchedRoute) {
    const initiatedRoute = new matchedRoute(request, params)

    // We allow HTML output when the route exists as an endpoint.
    // This allows for easy learning of the API similar to HyperMedia.
    if (allowsInteractive) {
      let body = ''
      if (request.url.toString().includes('.css')) {
        body = await initiatedRoute.template({})
      }
      else {
        const variables = await initiatedRoute.htmlVariables()
        const templateResult = await initiatedRoute.template(variables)
        body = layout(Object.assign(variables, {
          body: templateResult
        }))  
      }
      return new Response(new TextEncoder().encode(body), { status: 200 })
    }

    // This is the JSON output of endpoints.
    try {
      const output = await initiatedRoute.handle()
      return new Response(matchedRoute.mime === 'application/json' ? JSON.stringify(output, null, 2) : output, {
        headers: { 'Content-Type': matchedRoute.mime }
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
    const file = await Deno.readTextFile('./public' + requestURL.pathname)
    if (file) {
      return await serveFileWithTs(request, './public' + requestURL.pathname)
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