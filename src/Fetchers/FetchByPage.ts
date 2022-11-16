import { AbstractQuery, FetcherInterface, FetcherResult, Thing, LocalMechanismsInterface } from '../types.ts'
import { filterNormalizedItems } from './filterNormalizedItems.ts'
import { FetcherBase } from './FetcherBase.ts'

export type FetchByPageCallback = (fetched: typeof globalThis.fetch, query: AbstractQuery, page: number) => Promise<{ items: Array<Thing> }>
export type NormalizeCallback = (item: any) => Thing
export type FetchByPagePagination = { page: number, sliceOffset: number }

export class FetchByPage extends FetcherBase<FetchByPageCallback> implements FetcherInterface {

  public itemCountToExpect: number

  constructor (fetchCallback: FetchByPageCallback, normalizeCallback: NormalizeCallback, localMechanisms: LocalMechanismsInterface, itemCountToExpect: number) {
    super(fetchCallback, normalizeCallback, localMechanisms)
    this.itemCountToExpect = itemCountToExpect
  }

  async execute(fetched: typeof globalThis.fetch, query: AbstractQuery, pagination: FetchByPagePagination = { page: 0, sliceOffset: 0 }): FetcherResult<FetchByPagePagination> {
    try {
      const { items: allItems } = await this.fetchCallback(fetched, query, pagination.page)
      const normalizedItems = allItems ? await this.normalizeItems(allItems) : []
      const filteredItems = filterNormalizedItems(query, normalizedItems, this.localMechanisms)
      const slicedItems = filteredItems.slice(pagination.sliceOffset, pagination.sliceOffset + query.limit)
      const filteredItemsStillContainsResults = filteredItems.length > pagination.sliceOffset + query.limit

      const done = allItems.length < this.itemCountToExpect && !filteredItemsStillContainsResults

      return {
        items: slicedItems,
        done,
        pagination: { 
          page: filteredItemsStillContainsResults ? pagination.page : pagination.page + 1,
          sliceOffset: filteredItemsStillContainsResults ? pagination.sliceOffset + query.limit : 0
        }
      }
    }
    catch (exception) {
      console.error(`Could not fetch for`, query, exception)
      return { items: [], done: true, pagination: { page: 0, sliceOffset: 0 } }
    }
  }

}