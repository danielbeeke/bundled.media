import { AbstractQuery, LocalMechanismsInterface, Thing } from '../types.ts'
import JSONLD from 'npm:jsonld'

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
    return await Promise.all(allItems.map(item => {
      try {
        const normalizedItem = this.normalizeCallback(item)
        normalizedItem['@context'] = { '@vocab': 'https://schema.org/' }
        return JSONLD.expand(normalizedItem).then((graph: Array<any>) => graph.pop())
      }
      catch (exception) {
        console.error(item, exception)
        return null
      }
    }).filter(Boolean))
  }

}