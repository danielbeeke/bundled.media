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
    const filteredSources = filterSourcesStatically(sources, this.#query)
    
    // Token based sources can only be used once per range.
    const correctedChunkSize = Math.min(filteredSources.length, this.#chunkSize) 
    const slicedSources = this.sliceSources(filteredSources, correctedChunkSize)

    const promises = slicedSources.map(source => source.fetcher.execute(this.#query, this.#paginations?.[source.identifier]))

    const resultSets = await Promise.all(promises)

    const items: Array<any> = []

    let lastIndex = this.#lastIndex

    for (const [index, resultSet] of resultSets.entries()) {
      const source = slicedSources[index]
      if (items.length < this.#query.limit) {
        const numberOfItems = Math.min(resultSet.items.length, this.#query.limit - items.length)
        
        // console.log(
        //   numberOfItems, 
        //   resultSet.items.length, 
        //   this.#query.limit, 
        //   items.length
        // )

        items.push(...resultSet.items.slice(0, numberOfItems))

        if (resultSet.pagination.sliceOffset > numberOfItems) {
          resultSet.pagination.sliceOffset = resultSet.pagination.sliceOffset - numberOfItems
        }

        // console.log(resultSet.pagination)

        this.#paginations[source.identifier] = resultSet.pagination
        const sourceIndex = filteredSources.indexOf(source)
        console.log(sourceIndex, source.identifier)
        lastIndex = sourceIndex
      }
    }

    lastIndex++

    return {
      items,
      paginations: this.#paginations,
      filteredSources,
      lastIndex
    }
  }

  /**
   * Slice sources for our request, these are the ones that we will use.
   */
  sliceSources (filteredSources: Array<SourceInterface<any>>, chunkSize: number) {
    const slicedSources = filteredSources.slice(this.#lastIndex, this.#lastIndex + chunkSize)

    // If we take from the end of the sources array, we need to fill from the start.
    let additionIndex = 0
    while (slicedSources.length < chunkSize) {
      slicedSources.push(filteredSources[additionIndex])
      additionIndex++
    }

    return slicedSources
  }
}