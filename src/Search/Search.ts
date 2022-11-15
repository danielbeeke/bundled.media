import { AbstractQuery, SourceInterface, Paginations } from '../types.ts'
import { sources } from '../../.env.ts';
import { filterSourcesStatically } from '../Helpers/filterSourcesStatically.ts'

/**
 * A route with a sync response. 
 * It searches through multiple APIs at once.
 * We try to spread out items from all the different APIs.
 */
export class Search {

  #query: AbstractQuery
  #chunkSize: number
  #paginations: Paginations
  #lastIndex: number

  constructor (query: AbstractQuery, chunkSize: number, paginations?: Paginations | undefined, lastIndex = 0) {
    this.#query = query
    this.#chunkSize = chunkSize
    this.#paginations = paginations ?? {}
    this.#lastIndex = lastIndex
  }

  /**
   * The route handler. 
   * We create a fresh set of dataSources and then fetch results.
   */
  async handle () {
    const items: Array<any> = []
    let lastIndex = this.#lastIndex

    const filteredSources = filterSourcesStatically(sources, this.#query)
    
    let counter = 0

    while (items.length < this.#query.limit && !this.allSourcesAreDone(filteredSources, this.#paginations)) {
      // Token based sources can only be used once per range.
      const correctedChunkSize = Math.min(filteredSources.length, this.#chunkSize) 
      const slicedSources = this.sliceSources(filteredSources, correctedChunkSize, lastIndex, this.#paginations)

      const promises = slicedSources.map(source => source.fetcher.execute(this.#query, this.#paginations?.[source.identifier]))
      const resultSets = await Promise.all(promises)

      for (const [index, resultSet] of resultSets.entries()) {
        const source = slicedSources[index]
        if (items.length < this.#query.limit && !this.allSourcesAreDone(filteredSources, this.#paginations)) {
          const numberOfItems = Math.min(resultSet.items.length, this.#query.limit - items.length)

          items.push(...resultSet.items.slice(0, numberOfItems))

          if (resultSet.items.length > numberOfItems) {
            resultSet.pagination.sliceOffset = resultSet.pagination.sliceOffset - numberOfItems
          }

          this.#paginations[source.identifier] = resultSet.done ? { done: true } : resultSet.pagination
          const sourceIndex = filteredSources.indexOf(source)
          lastIndex = sourceIndex
        }
      }

      counter++

      if (counter === 5) break
    }

    lastIndex++

    return {
      items,
      paginations: this.#paginations,
      filteredSources,
      lastIndex,
      done: this.allSourcesAreDone(filteredSources, this.#paginations)
    }
  }

  allSourcesAreDone (sources: Array<SourceInterface<any>>, paginations: Paginations) {
    return sources.every(source => paginations[source.identifier]?.done === true)
  }

  /**
   * Slice sources for our request, these are the ones that we will use.
   */
  sliceSources (sources: Array<SourceInterface<any>>, chunkSize: number, lastIndex: number, paginations: Paginations) {
    const filteredSources = sources.filter(source => paginations[source.identifier]?.done !== true)

    const slicedSources = filteredSources.slice(lastIndex, lastIndex + chunkSize)

    // If we take from the end of the sources array, we need to fill from the start.
    let additionIndex = 0
    while (slicedSources.length < chunkSize) {
      slicedSources.push(filteredSources[additionIndex])
      additionIndex++
    }

    return slicedSources.filter(Boolean)
  }
}