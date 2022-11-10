import { AbstractQuery, SourceInterface } from '../types.ts'
import { JsonStringifyStream } from 'https://deno.land/std@0.163.0/encoding/json/stream.ts'
import { readableStreamFromIterable, mergeReadableStreams } from 'https://deno.land/std@0.163.0/streams/mod.ts'
import { fetcherGenerator } from '../Fetchers/fetcherGenerator.ts'

export class Search {

  #sources: Array<SourceInterface<any>>

  constructor (sources: Array<SourceInterface<any>>) {
    this.#sources = sources
  }

  execute (query: AbstractQuery, initialPagination: Array<any> = []) {
    const sources: Array<SourceInterface<any>> = this.#sources

    const streams = sources.map((source, index) => readableStreamFromIterable(
      fetcherGenerator(source, query, initialPagination[index]))
    )

      const strategy = new CountQueuingStrategy({
        highWaterMark: 1024 * 1024
      })

    return mergeReadableStreams(...streams)
    .pipeThrough(new JsonStringifyStream({
      readableStrategy: strategy
    }))
    .pipeThrough(new TextEncoderStream())
  }

}