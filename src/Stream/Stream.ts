import { AbstractQuery, SourceInterface } from '../types.ts'
import { JsonStringifyStream } from 'https://deno.land/std@0.163.0/encoding/json/stream.ts'
import { readableStreamFromIterable, mergeReadableStreams } from 'https://deno.land/std@0.163.0/streams/mod.ts'
import { fetcherGenerator } from '../Fetchers/fetcherGenerator.ts'
import { fetched } from '../Helpers/fetched.ts'
import { filterSourcesStatically } from '../Helpers/filterSourcesStatically.ts'

export class Stream {

  #sources: Array<SourceInterface<any>>

  constructor (sources: Array<SourceInterface<any>>) {
    this.#sources = sources
  }

  execute (query: AbstractQuery, initialPagination: Array<any> = []) {
    const sources: Array<SourceInterface<any>> = this.#sources
    const controller = new AbortController()
    const signal = controller.signal

    const abortableFetched = (url: string | URL, options?: RequestInit) => {
      if (!options) options = {}
      options.signal = signal
      return fetched(url, options)
    }

    const streams = sources.map((source, index) => readableStreamFromIterable(
      fetcherGenerator(source, query, initialPagination[index], abortableFetched))
    )

    const status = async function * () {
      yield { 
        '@type': 'http://bundled.media/StreamStatus',
        'sources': filterSourcesStatically(sources, query).map(source => source.identifier)
      }
    }

    return mergeReadableStreams(readableStreamFromIterable(status()), ...streams)
    .pipeThrough(new JsonStringifyStream())
    .pipeThrough(new TextEncoderStream())
  }

}