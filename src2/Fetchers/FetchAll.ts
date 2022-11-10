import { AbstractQuery, FetcherInterface, FetcherResult, Thing } from '../types.ts'
import { filterNormalizedItems } from './filterNormalizedItems.ts'
import { FetcherBase } from './FetcherBase.ts'

export type FetchAllCallback = (query: AbstractQuery) => Promise<{ items: Array<Thing> }>
export type NormalizeCallback = (item: any) => Thing
export type FetchAllPagination = { sliceOffset: number }

export class FetchAll extends FetcherBase<FetchAllCallback> implements FetcherInterface {

  async execute(query: AbstractQuery, pagination: FetchAllPagination = { sliceOffset: 0 }): FetcherResult<FetchAllPagination> {
    try {
      const { items: allItems } = await this.fetchCallback(query)
      const normalizedItems = allItems ? await this.normalizeItems(allItems) : []
      const filteredItems = filterNormalizedItems(query, normalizedItems, this.localMechanisms)
      const slicedItems = filteredItems.slice(pagination.sliceOffset, pagination.sliceOffset + query.limit)
      const filteredItemsStillContainsResults = filteredItems.length > pagination.sliceOffset + query.limit
      const done = slicedItems.length < query.limit && !filteredItemsStillContainsResults

      return {
        items: slicedItems,
        done,
        pagination: { 
          sliceOffset: filteredItemsStillContainsResults ? pagination.sliceOffset + query.limit : 0
        }
      }
    }
    catch (exception) {
      console.error(`Could not fetch for`, query, exception)
      return { items: [], done: true, pagination: { sliceOffset: 0 } }
    }
  }

}