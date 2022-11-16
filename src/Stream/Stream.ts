import { AbstractQuery, SourceInterface } from '../types.ts'
import { JsonStringifyStream } from 'https://deno.land/std@0.163.0/encoding/json/stream.ts'
import { readableStreamFromIterable } from 'https://deno.land/std@0.163.0/streams/mod.ts'
import { deferred } from 'https://deno.land/std@0.163.0/async/mod.ts'

import { fetcherGenerator } from '../Fetchers/fetcherGenerator.ts'
import { filterSourcesStatically } from '../Helpers/filterSourcesStatically.ts'
import { abortableFetched } from '../Helpers/abortableFetch.ts'

/**
 * Merge multiple streams into a single one, not taking order into account.
 * If a stream ends before other ones, the other will continue adding data,
 * and the finished one will not add any more data.
 */
 export function mergeReadableStreams<T>(
  abort: Function,
  ...streams: ReadableStream<T>[]
): ReadableStream<T> {
  const resolvePromises = streams.map(() => deferred<void>());

  let canceled = false

  return new ReadableStream<T>({
    start(controller) {
      Promise.all(resolvePromises).then(() => {
        try {
          controller.close();
        }
        catch {}
      });
      try {
        for (const [key, stream] of Object.entries(streams)) {
          (async () => {
            for await (const data of stream) {
              if (canceled) break;
              controller.enqueue(data);
            }
            resolvePromises[+key].resolve();
          })();
        }
      } catch {}
    },

    async cancel () {
      canceled = true
      await abort()
    }
  });
}

export class Stream {

  #sources: Array<SourceInterface<any>>

  constructor (sources: Array<SourceInterface<any>>) {
    this.#sources = sources
  }

  execute (query: AbstractQuery, initialPagination: Array<any> = []) {
    const sources: Array<SourceInterface<any>> = this.#sources

    const { fetched, abort } = abortableFetched()

    const streams = sources.map((source, index) => readableStreamFromIterable(
      fetcherGenerator(source, query, initialPagination[index], fetched))
    )

    const status = async function * () {
      yield { 
        '@type': 'http://bundled.media/StreamStatus',
        'sources': filterSourcesStatically(sources, query).map(source => source.identifier)
      }
    }

    return mergeReadableStreams(abort, readableStreamFromIterable(status()), ...streams)
    .pipeThrough(new JsonStringifyStream())
    .pipeThrough(new TextEncoderStream())
  }

}