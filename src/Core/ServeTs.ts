import { serveFile } from "https://deno.land/std@0.144.0/http/file_server.ts";
import type { ServeFileOptions, ServeDirOptions } from "https://deno.land/std@0.144.0/http/file_server.ts";
import { contentType } from "https://deno.land/std@0.144.0/media_types/mod.ts";
import { transpile } from "https://deno.land/x/ts_serve@v1.1.0/utils/transpile.ts";
import { cachedir } from 'https://deno.land/x/cache@0.2.13/directories.ts'
import { rollup } from "npm:rollup";
import urlResolve from "npm:rollup-plugin-url-resolve";

const tsUrl = new URL("file:///src.ts");
const jsContentType = contentType(".js")!;

export async function serveFileWithTs(
  request: Request,
  filePath: string,
  options?: ServeFileOptions,
): Promise<Response> {
  const response = await serveFile(request, filePath, options);
  if (filePath.endsWith('.ts')) {
    return rewriteTsResponse(response, tsUrl, filePath) as unknown as Response
  }
  else {
    return response
  }
}

function transpiler () {
  return {
    name: 'deno-transpiler',
    resolveId ( source: string ) {
      if (source === 'https://unpkg.com/@lit/css-tag.js?module') return 'https://unpkg.com/@lit/reactive-element@1.4.1/css-tag.js?module'
      if (source.startsWith('./') && source.endsWith('.ts')) {
        return source
      }
    },
    load ( id: string ) {
      if (id.startsWith('./') && id.endsWith('.ts')) {
        const filePath = Deno.cwd() + '/public/' + id.replace('./', '')
        const tsCode = Deno.readTextFileSync(filePath)
        return transpile(tsCode, new URL(`src://${id}`));
      }
    }
  };
}

const jsCache = new Map()

export async function rewriteTsResponse(response: Response, url: URL, filePath: string) {
  if (!jsCache.has(filePath)) {
    const tsCode = await response.text();
    const jsCode = await transpile(tsCode, url);
  
    const jsPath = cachedir() + '/' + filePath.replace('.ts', '.js').replace('./public/', '')
    Deno.writeTextFileSync(jsPath, jsCode)
  
    try {
      const bundle = await rollup({
        input: jsPath,
        plugins: [
          transpiler(),
          urlResolve()
        ]
      })
    
      const out = await bundle.generate({})

      jsCache.set(filePath, out.output[0].code)    
    }
    catch (exception) {
      console.error(exception)
    }
  }
  const { headers } = response;
  headers.set("content-type", jsContentType);

  return new Response(jsCache.get(filePath), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export { type ServeDirOptions, type ServeFileOptions, transpile };
