import routes from './Routes/routes.ts'
import layout from './Templates/layout.ts'
import { serveFileWithTs } from 'https://deno.land/x/ts_serve@v1.4.1/mod.ts'
import { toPathRegex } from './Helpers/toPathRegex.ts'
import { sources } from '../.env.ts'
import { AugmentedData } from './Core/AugmentedData.ts'
import { serve } from 'https://deno.land/std@0.163.0/http/server.ts'

const port = Deno.env.get('PORT') ? parseInt(Deno.env.get('PORT')!) : 8080
serve(serveHttp, { port })

async function serveHttp(request: Request) {
  const requestURL = new URL(request.url)
  const urlParams = new URLSearchParams(requestURL.search)
  const params = {}

  const allowsInteractive = !urlParams.has('force-json') && 
    request.headers.get('accept')?.includes('text/html')

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
        const variables = await initiatedRoute.htmlVariables()
        const templateResult = await initiatedRoute.template(variables)
        body = layout(Object.assign(variables, {
          body: templateResult,
        }))  
      }
      const response = new Response(new TextEncoder().encode(body), { status: 200 })
      return response
    }

    // This is the JSON output of endpoints.
    try {
      const output = await initiatedRoute.handle()

      if (output instanceof Response) return output

      const response = new Response(matchedRoute.mime === 'application/json' ? JSON.stringify(output, null, 2) : output, {
        headers: { 'Content-Type': matchedRoute.mime }
      })
      return response
    }

    // Fallback to error page.
    catch (exception) {
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
    console.log('exception', exception)
    // We continue with a 404.
  }

  // Fallback to not found page.
  return new Response(`Page not found`, { status: 404 })
}

AugmentedData.index(sources)