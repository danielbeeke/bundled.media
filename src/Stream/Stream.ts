import { AbstractQuery, SourceInterface } from '../types.ts'
import { JsonStringifyStream } from 'https://deno.land/std@0.163.0/encoding/json/stream.ts'
import { readableStreamFromIterable } from 'https://deno.land/std@0.163.0/streams/mod.ts'

import { fetcherGenerator } from '../Fetchers/fetcherGenerator.ts'
import { filterSourcesStatically } from '../Helpers/filterSourcesStatically.ts'
import { abortableFetched } from '../Helpers/abortableFetch.ts'
import { mergeReadableStreams } from "../Helpers/mergeReadableStreams.ts"

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