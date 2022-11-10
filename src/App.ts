import routes from './Routes/routes.ts'
import layout from './Templates/layout.ts'
import { dataSources as createDataSources } from '../.env.ts'
import { serveFileWithTs } from 'https://deno.land/x/ts_serve@v1.4.1/mod.ts';
import { toPathRegex } from './Helpers/toPathRegex.ts'
import { existsSync } from 'https://deno.land/std@0.157.0/fs/mod.ts';

import { serve } from 'https://deno.land/std@0.163.0/http/server.ts'

await caches.delete('responses-interactive')
await caches.delete('responses')

const cacheInteractive = await caches.open('responses-interactive')
const cache = await caches.open('responses')

const deliverResponse = async (request: Request, response: Response, cache: Cache) => {
  // if (request.method === 'GET') await cache.put(request, response.clone())
  return response
}

const port = Deno.env.get('PORT') ? parseInt(Deno.env.get('PORT')!) : 8080
serve(serveHttp, { port });
console.info(`bundled.media is running locally at: http://localhost:${port}/`)

async function serveHttp(request: Request) {
  const requestURL = new URL(request.url)
  const urlParams = new URLSearchParams(requestURL.search)
  const params = {}

  const allowsInteractive = !urlParams.has('force-json') && 
    request.headers.get('accept')?.includes('text/html')

  // if (request.method === 'GET') {
  //   const cacheMatch = await (allowsInteractive ? cacheInteractive : cache).match(request)

  //   if (cacheMatch) {
  //     cacheMatch.headers.set('x-cache-hit', 'true')
  //     return cacheMatch
  //   }    
  // }

  const matchedRoute = routes.find(route => {
    const regex = new RegExp(toPathRegex(route.path), 'imsu')
    const matched = regex.test(requestURL.pathname)
    if (matched) Object.assign(params, requestURL.pathname.match(regex)?.groups)
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
        const preloadModules = existsSync('./public/preloadmodules.json') ? JSON.parse(Deno.readTextFileSync('./public/preloadmodules.json') ?? '[]') : []
        const variables = await initiatedRoute.htmlVariables()
        const templateResult = await initiatedRoute.template(variables)
        body = layout(Object.assign(variables, {
          body: templateResult,
          preloadModules
        }))  
      }
      const response = new Response(new TextEncoder().encode(body), { status: 200 })
      return await deliverResponse(request, response, cacheInteractive)
    }

    // This is the JSON output of endpoints.
    try {
      const output = await initiatedRoute.handle()
      const response = new Response(matchedRoute.mime === 'application/json' ? JSON.stringify(output, null, 2) : output, {
        headers: { 'Content-Type': matchedRoute.mime }
      })
      return await deliverResponse(request, response, cache)
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
  catch (exception) {
    console.log(exception)
    // We continue with a 404.
  }

  // Fallback to not found page.
  return new Response(`Page not found`, { status: 404 })
}

/**
 * Trigger the constructors so sources can cache stuff on startup.
 */
for (const source of createDataSources()) source.boot()