import { AbstractQuery, LocalMechanismsInterface, Thing } from '../types.ts'
import JSONLD from 'npm:jsonld'
import { AugmentedCategories } from '../Core/AugmentedCategories.ts'

export type FetchByTokenCallback = (query: AbstractQuery, token: string | null) => Promise<{ items: Array<Thing>, token: string | null }>
export type NormalizeCallback = (item: any) => Thing
export type FetchByTokenPagination = { token: string | null, sliceOffset: number }

export class FetcherBase<FetchCallback> {

  public fetchCallback: FetchCallback
  public normalizeCallback: NormalizeCallback
  public localMechanisms: LocalMechanismsInterface

  constructor (fetchCallback: FetchCallback, normalizeCallback: NormalizeCallback, localMechanisms: LocalMechanismsInterface = {}) {
    this.fetchCallback = fetchCallback
    this.normalizeCallback = normalizeCallback
    this.localMechanisms = localMechanisms
  }

  /**
   * Normalizes and expands to JSON-ld items.
   */
   async normalizeItems (allItems: Array<Thing>) {
    const normalizedItems = (await Promise.all(allItems.map(item => {
      try {
        const normalizedItem = this.normalizeCallback(item)
        normalizedItem['@context'] = { '@vocab': 'http://schema.org/' }
        if (!normalizedItem['@id']) return null

        const categories = AugmentedCategories.get(normalizedItem['@id'])
        if (categories?.length) {
          normalizedItem['http://taxonomy.mediaworks.global/category'] = categories
        }

        return JSONLD.expand(normalizedItem).then((graph: Array<any>) => graph.pop())
      }
      catch (exception) {
        console.error('error', item, exception)
        return null
      }
    }))).filter(Boolean)

    // De-duplicate
    const unique = new Map()
    for (const item of normalizedItems) unique.set(item['@id'], item)
    return [...unique.values()]
  }

}