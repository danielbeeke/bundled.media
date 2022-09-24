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
  // if range request, skip
  if (response.status === 200) {
    if (filePath.endsWith(".ts")) {
      return rewriteTsResponse(response!, tsUrl, filePath);
    }
  }
  return response;
}

async function rewriteTsResponse(response: Response, url: URL, filePath: string) {
  const tsCode = await response.text();
  const jsCode = await transpile(tsCode, url);

  const { headers } = response;
  headers.set("content-type", jsContentType);
  headers.delete("content-length");
  const jsPath = cachedir() + '/' + filePath.replace('.ts', '.js').replace('./public/', '')
  Deno.writeTextFileSync(jsPath, jsCode)

  try {
    const bundle = await rollup({
      input: jsPath,
      plugins: [
        urlResolve()
      ]
    })

    const out = await bundle.generate({})

    return new Response(out.output[0].code, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
  catch (exception) {
    console.error(exception)
  }
}

export { type ServeDirOptions, type ServeFileOptions, transpile };
