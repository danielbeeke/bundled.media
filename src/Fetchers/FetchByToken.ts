import { AbstractQuery, FetcherInterface, FetcherResult, Thing, LocalMechanismsInterface } from '../types.ts'
import { filterNormalizedItems } from './filterNormalizedItems.ts'
import { FetcherBase } from './FetcherBase.ts'

export type FetchByTokenCallback = (fetched: typeof globalThis.fetch, query: AbstractQuery, token: string | null) => Promise<{ items: Array<Thing>, token: string | null }>
export type NormalizeCallback = (item: any) => Thing
export type FetchByTokenPagination = { token: string | null, sliceOffset: number }

export class FetchByToken extends FetcherBase<FetchByTokenCallback> implements FetcherInterface {

  public itemCountToExpect: number

  constructor (fetchCallback: FetchByTokenCallback, normalizeCallback: NormalizeCallback, localMechanisms: LocalMechanismsInterface, itemCountToExpect: number) {
    super(fetchCallback, normalizeCallback, localMechanisms)
    this.itemCountToExpect = itemCountToExpect
  }

  async execute(fetched: typeof globalThis.fetch, query: AbstractQuery, pagination: FetchByTokenPagination = { token: null, sliceOffset: 0 }): FetcherResult<FetchByTokenPagination> {
    try {
      const { items: allItems, token } = await this.fetchCallback(fetched, query, pagination.token)
      const normalizedItems = allItems ? await this.normalizeItems(allItems) : []
      const filteredItems = filterNormalizedItems(query, normalizedItems, this.localMechanisms)
      const slicedItems = filteredItems.slice(pagination.sliceOffset, pagination.sliceOffset + query.limit)
      const filteredItemsStillContainsResults = filteredItems.length > pagination.sliceOffset + query.limit

      const done = slicedItems.length < this.itemCountToExpect && !filteredItemsStillContainsResults

      return {
        items: slicedItems,
        done,
        pagination: { 
          token: filteredItemsStillContainsResults ? pagination.token : token,
          sliceOffset: filteredItemsStillContainsResults ? pagination.sliceOffset + query.limit : 0
        }
      }
    }
    catch (exception) {
      console.error(`Could not fetch for`, query, exception)
      return { items: [], done: true, pagination: { token: null, sliceOffset: 0 } }
    }
  }

}