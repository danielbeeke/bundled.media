import { AbstractQuery, SourceInterface } from '../types.ts'
import { JsonStringifyStream } from 'https://deno.land/std@0.163.0/encoding/json/stream.ts'
import { readableStreamFromIterable, mergeReadableStreams } from 'https://deno.land/std@0.163.0/streams/mod.ts'
import { fetcherGenerator } from '../Fetchers/fetcherGenerator.ts'

export class Stream {

  #sources: Array<SourceInterface<any>>

  constructor (sources: Array<SourceInterface<any>>) {
    this.#sources = sources
  }

  execute (query: AbstractQuery, initialPagination: Array<any> = []) {
    const sources: Array<SourceInterface<any>> = this.#sources

    const streams = sources.map((source, index) => readableStreamFromIterable(
      fetcherGenerator(source, query, initialPagination[index]))
    )

    return mergeReadableStreams(...streams)
    .pipeThrough(new JsonStringifyStream())
    .pipeThrough(new TextEncoderStream())
  }

}