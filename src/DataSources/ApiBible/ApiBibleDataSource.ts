import { BaseDataSource } from '../BaseDataSource.ts'
import { AbstractQuery } from '../../Core/AbstractQuery.ts'
import { Thing } from '../../schema.org.ts';
import { ApiBibleOptions, ApiBibleRawItem } from './ApiBibleTypes.ts'
import { iso6393 } from 'https://esm.sh/iso-639-3@3'
import { bcp47Normalize } from 'https://esm.sh/bcp-47-normalize@2'

export class ApiBibleDataSource extends BaseDataSource<ApiBibleRawItem, Thing> {

  public url = 'https://api.scripture.api.bible'

  #options: ApiBibleOptions
  
  constructor (options: ApiBibleOptions) {
    super()
    this.#options = options
  }

  async fetch (query: AbstractQuery) {
    const fetchUrl = new URL(`${this.url}/v1/bibles`)

    // TODO this will be repeated, create helpers to normalize bcp47 to iso 2 or iso3.
    let matchedLanguage
    if (query.langCode) {
      if (query.langCode.length === 2) {
        matchedLanguage = iso6393.find(item => item.iso6391 === query.langCode)
        if (matchedLanguage) {
          fetchUrl.searchParams.set('language', matchedLanguage.iso6393)
        }  
      }
      else {
        fetchUrl.searchParams.set('language', query.langCode) 
      }
    }

    if (query.text) fetchUrl.searchParams.set('name', query.text)

    const response = await fetch(fetchUrl, { headers: { 'api-key': this.#options.key }})
    const json = await response.json()

    this.done = true // We are always done after one search. This API does not have pagination.

    return json.data ?? []
  }

  /**
   * The transformation from an API specific item to a schema.org item.
   */
  normalize(item: ApiBibleRawItem) {
    const normalizedItem: Thing = {
      '@type': 'Book',
      'name': item.name,
      'description': item.description,
      'url': `https://bibles.org/bible/${item.id}/_`,
      'inLanguage': bcp47Normalize(item.language.id) // TODO wrap this in a cache, this normalization process might be expensive.
    }

    return normalizedItem
  }
}