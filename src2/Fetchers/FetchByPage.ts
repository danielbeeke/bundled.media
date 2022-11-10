import { AbstractQuery, FetcherInterface, FetcherResult, Thing, LocalMechanismsInterface } from '../types.ts'
import { filterNormalizedItems } from './filterNormalizedItems.ts'
import { FetcherBase } from './FetcherBase.ts'

export type FetchByPageCallback = (query: AbstractQuery, page: number) => Promise<{ items: Array<Thing> }>
export type NormalizeCallback = (item: any) => Thing
export type FetchByPagePagination = { page: number, sliceOffset: number }

export class FetchByPage extends FetcherBase<FetchByPageCallback> implements FetcherInterface {

  public itemCountToExpect: number

  constructor (fetchCallback: FetchByPageCallback, normalizeCallback: NormalizeCallback, localMechanisms: LocalMechanismsInterface, itemCountToExpect: number) {
    super(fetchCallback, normalizeCallback, localMechanisms)
    this.itemCountToExpect = itemCountToExpect
  }

  async execute(query: AbstractQuery, pagination: FetchByPagePagination = { page: 0, sliceOffset: 0 }): FetcherResult<FetchByPagePagination> {
    try {
      const { items: allItems } = await this.fetchCallback(query, pagination.page)
      const normalizedItems = allItems ? await this.normalizeItems(allItems) : []
      const filteredItems = filterNormalizedItems(query, normalizedItems, this.localMechanisms)
      const slicedItems = filteredItems.slice(pagination.sliceOffset, pagination.sliceOffset + query.limit)
      const filteredItemsStillContainsResults = filteredItems.length > pagination.sliceOffset + query.limit

      const done = allItems.length < this.itemCountToExpect && !filteredItemsStillContainsResults

      if (slicedItems.length === query.limit || done) {
        return {
          items: slicedItems,
          done,
          pagination: { 
            page: filteredItemsStillContainsResults ? pagination.page : pagination.page + 1,
            sliceOffset: filteredItemsStillContainsResults ? pagination.sliceOffset + query.limit : 0
          }
        }
      }

      // Recursion, we want to give the expected amount, when we had an sliceOffset, 
      // we call ourselves again to fill it to the amount expected. 
      const { done: restDone, items: restItems, pagination: restPagination } = await this.execute(query, { page: pagination.page, sliceOffset: 0 })
      const slicedRestItems = restItems.slice(0, query.limit - slicedItems.length)

      return {
        items: [...slicedItems, ...slicedRestItems],
        done: done,
        pagination: { 
          page: restDone ? 0 : restPagination.page,
          sliceOffset: restDone ? 0 : restPagination.sliceOffset - slicedItems.length
        }
      }
    }
    catch (exception) {
      console.error(`Could not fetch for`, query, exception)
      return { items: [], done: true, pagination: { page: 0, sliceOffset: 0 } }
    }
  }

}