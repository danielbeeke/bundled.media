import { serveFile } from "https://deno.land/std@0.144.0/http/file_server.ts";
import type { ServeFileOptions, ServeDirOptions } from "https://deno.land/std@0.144.0/http/file_server.ts";
import { contentType } from "https://deno.land/std@0.144.0/media_types/mod.ts";
import { transpile } from "https://deno.land/x/ts_serve@v1.1.0/utils/transpile.ts";

const tsUrl = new URL("file:///src.ts");
const jsContentType = contentType(".js")!;

export async function serveFileWithTs(
  request: Request,
  filePath: string,
  options?: ServeFileOptions,
): Promise<Response> {
  const response = await serveFile(request, filePath, options);
  if (filePath.endsWith('.ts')) {
    return rewriteTsResponse(response, tsUrl) as unknown as Response
  }
  else {
    return response
  }
}

export async function rewriteTsResponse(response: Response, url: URL) {
  const tsCode = await response.text();
  const jsCode = await transpile(tsCode, url);
  const { headers } = response;
  headers.set("content-type", jsContentType);
  return new Response(jsCode, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export { type ServeDirOptions, type ServeFileOptions, transpile };
