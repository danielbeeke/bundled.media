import { AbstractQuery, FetcherInterface, FetcherResult, Thing, LocalMechanismsInterface } from '../types.ts'
import { filterNormalizedItems } from './filterNormalizedItems.ts'
import { FetcherBase } from './FetcherBase.ts'

export type FetchByOffsetAndLimitCallback = (query: AbstractQuery, offset: number, limit: number) => Promise<{ items: Array<Thing> }>
export type NormalizeCallback = (item: any) => Thing
export type FetchByOffsetAndLimitPagination = { offset: number, sliceOffset: number }

export class FetchByOffsetAndLimit extends FetcherBase<FetchByOffsetAndLimitCallback> implements FetcherInterface {

  public limit: number

  constructor (fetchCallback: FetchByOffsetAndLimitCallback, normalizeCallback: NormalizeCallback, localMechanisms: LocalMechanismsInterface, limit: number) {
    super(fetchCallback, normalizeCallback, localMechanisms)
    this.limit = limit
  }

  async execute(query: AbstractQuery, pagination: FetchByOffsetAndLimitPagination = { offset: 0, sliceOffset: 0 }): FetcherResult<FetchByOffsetAndLimitPagination> {
    try {
      const { items: allItems } = await this.fetchCallback(query, pagination.offset, this.limit)
      const normalizedItems = allItems ? await this.normalizeItems(allItems) : []
      const filteredItems = filterNormalizedItems(query, normalizedItems, this.localMechanisms)
      const slicedItems = filteredItems.slice(pagination.sliceOffset, pagination.sliceOffset + query.limit)
      const filteredItemsStillContainsResults = filteredItems.length > pagination.sliceOffset + query.limit

      const done = allItems.length < this.limit && !filteredItemsStillContainsResults

      if (slicedItems.length === query.limit || done) {
        return {
          items: slicedItems,
          done,
          pagination: { 
            offset: filteredItemsStillContainsResults ? pagination.offset : pagination.offset + this.limit,
            sliceOffset: filteredItemsStillContainsResults ? pagination.sliceOffset + query.limit : 0
          }
        }
      }

      // Recursion, we want to give the expected amount, when we had an sliceOffset, 
      // we call ourselves again to fill it to the amount expected. 
      const { done: restDone, items: restItems, pagination: restPagination } = await this.execute(query, { offset: pagination.offset + this.limit, sliceOffset: 0 })
      const slicedRestItems = restItems.slice(0, query.limit - slicedItems.length)

      return {
        items: [...slicedItems, ...slicedRestItems],
        done: done,
        pagination: { 
          offset: pagination.offset + this.limit,
          sliceOffset: restDone ? 0 : restPagination.sliceOffset - slicedItems.length
        }
      }
    }
    catch (exception) {
      console.error(`Could not fetch for`, query, exception)
      return { items: [], done: true, pagination: { offset: 0, sliceOffset: 0 } }
    }
  }

}