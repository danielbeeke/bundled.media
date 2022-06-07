import { serve } from 'https://deno.land/std@0.125.0/http/server.ts'
import { SearchRoute } from './Routes/Search.ts'
import staticFiles from 'https://deno.land/x/static_files@1.1.6/mod.ts'

const port = Deno.env.get('PORT') ? parseInt(Deno.env.get('PORT')!) : 8080
serve(serveHttp, { port });
console.info(`bundled.media is running locally at: http://localhost:${port}/`)

function setHeaders(headers: Headers, path: string, stats?: Deno.FileInfo) {
  headers.set("Content-disposition", "attachment; filename=" + path);
}

const serveFiles = (req: Request) => staticFiles('./src/Public', { setHeaders })({ 
  request: req, 
  respondWith: (r: Response) => r 
})

const routes = [
  SearchRoute
]

function serveHttp(request: Request) {
  const requestURL = new URL(request.url)
  const urlParams = new URLSearchParams(requestURL.search)

  const allowsInteractive = !urlParams.has('force-json') && 
    request.headers.get('accept')?.includes('text/html')

  const matchedRoute = routes.find(route => route.path === requestURL.pathname)

  if (matchedRoute) {
    // We allow HTML output when the route exists as an endpoint.
    // This allows for easy learning of the API similar to HyperMedia.
    if (allowsInteractive) {
      const body = Deno.readTextFileSync('./src/Public/index.html')
      return new Response(new TextEncoder().encode(body), { status: 200 })
    }

    // This is the JSON output of endpoints.
    const initiatedRoute = new matchedRoute(request)
    try {
      return initiatedRoute.handle()
    }

    // Fallback to error page.
    catch (exception) {
      return new Response(`Something went wrong: ${exception}`, { status: 500 })
    }
  }

  // Try static resources.
  try {
    const file = Deno.readTextFileSync('./src/Public' + requestURL.pathname)
    if (file) {
      return serveFiles(request)
    }  
  }
  catch {
    // We continue with a 404.
  }

  // Fallback to not found page.
  return new Response(`Page not found`, { status: 404 })
}