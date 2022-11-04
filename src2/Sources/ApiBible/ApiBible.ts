import { FetchAll } from '../../Fetchers/FetchAll.ts'
import { FetcherInterface, SourceInterface, AbstractQuery, Thing } from '../../types.ts'
import { bcp47Normalize } from '../../Helpers/bcp47Normalize.ts'
import { ApiBibleRawItem, ApiBibleOptions } from './ApiBibleTypes.ts'
import { fetched } from '../../Helpers/fetched.ts'
import { ISO639_1_to_ISO639_3 } from '../../Helpers/ISO639_1_to_ISO639_3.ts'

/**
 * API bible is a good and simple example.
 * You have a fetch and a normalize.
 * It supports searching, filtering on language, but it does not support pagination.
 */
export class ApiBible implements SourceInterface<ApiBibleRawItem> {

  #options: ApiBibleOptions
  public whitelistedDomains: Array<string> = [
    'api.scripture.api.bible'
  ]

  public fetcher: FetcherInterface

  constructor (options: ApiBibleOptions) {
    this.#options = options
    this.fetcher = new FetchAll(this.fetch.bind(this), this.normalize.bind(this))
  }

  /**
   * API Bible is quite simple.
   */
  async fetch (query: AbstractQuery) {
    const fetchUrl = new URL('https://api.scripture.api.bible/v1/bibles')
    if (query.bcp47) fetchUrl.searchParams.set('language', ISO639_1_to_ISO639_3(query.bcp47))
    if (query.fulltextSearch) fetchUrl.searchParams.set('name', query.fulltextSearch)
    const response = await fetched(fetchUrl, { headers: { 'api-key': this.#options.key }})
    const json = await response.json()
    return { items: json.data }
  }

  /**
   * The transformation from an API specific item to a schema.org item.
   */
   normalize(item: ApiBibleRawItem): Thing {
    return {
      '@type': 'Book',
      'name': item.name,
      'description': item.description,
      '@id': `https://api.bible/${item.id}`,
      'url': `https://bibles.org/bible/${item.id}/_`,
      'inLanguage': bcp47Normalize(item.language.id)
    }
  }

  /**
   * Used for static filtering
   */
  types () {
    return ['Book']
  }
}