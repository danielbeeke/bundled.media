import { deferred } from 'https://deno.land/std@0.163.0/async/mod.ts'

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
  