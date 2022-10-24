import { CacheEntry } from 'https://deno.land/x/fromdeno_cache@v0.1.10/src/entry.ts'

/**
 * If `Response` isn't cached, performs the request and caches `Response`.
 * @permissions `--allow-net --allow-write --allow-read --allow-env`
 */
export async function fetched(
  url: string | URL,
  options: RequestInit = {},
): Promise<Response> {

  if (options.method === 'POST') return fetch(url, options)

  const signal = options?.signal ?? undefined
  const entry = new CacheEntry(url);
  try {
    return await entry.read({ signal });
  } catch (error: unknown) {
    if (!(error instanceof Deno.errors.NotFound)) throw error;
  }

  const res = await fetch(url, options);
  if (res.status === 200) await entry.write(res.clone());
  return res;
}
