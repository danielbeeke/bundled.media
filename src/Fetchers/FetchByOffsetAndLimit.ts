import { AbstractQuery, FetcherInterface, FetcherResult, Thing, LocalMechanismsInterface } from '../types.ts'
import { filterNormalizedItems } from './filterNormalizedItems.ts'
import { FetcherBase } from './FetcherBase.ts'

export type FetchByOffsetAndLimitCallback = (fetched: typeof globalThis.fetch, query: AbstractQuery, offset: number, limit: number) => Promise<{ items: Array<Thing> }>
export type NormalizeCallback = (item: any) => Thing
export type FetchByOffsetAndLimitPagination = { offset: number, sliceOffset: number }

export class FetchByOffsetAndLimit extends FetcherBase<FetchByOffsetAndLimitCallback> implements FetcherInterface {

  public limit: number

  constructor (
    fetchCallback: FetchByOffsetAndLimitCallback, 
    normalizeCallback: NormalizeCallback, 
    localMechanisms: LocalMechanismsInterface, 
    limit: number) 
  {
    super(fetchCallback, normalizeCallback, localMechanisms)
    this.limit = limit
  }

  async execute(
    fetched: typeof globalThis.fetch, 
    query: AbstractQuery, 
    pagination: FetchByOffsetAndLimitPagination = { offset: 0, sliceOffset: 0 }): 
    FetcherResult<FetchByOffsetAndLimitPagination> 
  {
    try {
      const { items: fetchedItems } = await this.fetchCallback(fetched, query, pagination.offset, this.limit)
      const normalizedItems = fetchedItems ? await this.normalizeItems(fetchedItems) : []
      const filteredItems = filterNormalizedItems(query, normalizedItems, this.localMechanisms)
      const slicedItems = filteredItems.slice(pagination.sliceOffset, pagination.sliceOffset + query.limit)
      const filteredItemsStillContainsResults = filteredItems.length > pagination.sliceOffset + query.limit

      const done = fetchedItems.length < this.limit && !filteredItemsStillContainsResults

      return {
        items: slicedItems,
        done,
        pagination: { 
          offset: filteredItemsStillContainsResults ? pagination.offset : pagination.offset + this.limit,
          sliceOffset: filteredItemsStillContainsResults ? pagination.sliceOffset + query.limit : 0
        }
      }
    }
    catch (exception) {
      console.error(`Could not fetch for`, query, exception)
      return { items: [], done: true, pagination: { offset: 0, sliceOffset: 0 } }
    }
  }

}