import { AbstractQuery, LocalMechanismsInterface, Thing } from '../types.ts'
import JSONLD from 'npm:jsonld'
import { AugmentedData } from '../Core/AugmentedData.ts'
import merge from 'npm:deepmerge'
import { tryToExtractLanguage } from '../Helpers/tryToExtractLanguage.ts'

export type FetchByTokenCallback = (query: AbstractQuery, token: string | null) => Promise<{ items: Array<Thing>, token: string | null }>
export type NormalizeCallback = (item: any) => Thing
export type FetchByTokenPagination = { token: string | null, sliceOffset: number }

const extractValues = (rdfValues: Array<{ '@value': string }> | undefined) => {
  if (!rdfValues) return []
  return rdfValues.map(value => value['@value'])
}

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
    const normalizedItems = (await Promise.all(allItems.map(async item => {
      try {
        let normalizedItem = this.normalizeCallback(item)
        normalizedItem['@context'] = { '@vocab': 'http://schema.org/' }
        if (!normalizedItem['@id']) return null

        /**
         * Add additional data given by the .env.ts
         */
        const itemAugmentedData = AugmentedData.get(normalizedItem['@id'])
        if (itemAugmentedData && Object.keys(itemAugmentedData)?.length) {
          normalizedItem = merge(normalizedItem, itemAugmentedData)
        }

        const expandedItem = await JSONLD.expand(normalizedItem).then((graph: Array<any>) => graph.pop())

        if (!expandedItem['http://schema.org/inLanguage']) {
          const language = tryToExtractLanguage([
            ...extractValues(expandedItem['http://schema.org/name']),
            ...extractValues(expandedItem['http://schema.org/keywords']),
            ...extractValues(expandedItem['http://schema.org/genre']),
          ])

          if (language) {
            expandedItem['http://schema.org/inLanguage'] = [{ '@value': language }]
          }
        }

        return expandedItem
      }
      catch (exception) {
        console.error('error', exception)
        return null
      }
    }))).filter(Boolean)

    // De-duplicate
    const unique = new Map()
    for (const item of normalizedItems) unique.set(item['@id'], item)
    return [...unique.values()]
  }

}