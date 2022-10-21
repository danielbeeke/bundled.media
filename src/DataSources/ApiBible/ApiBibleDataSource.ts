import { BaseDataSource } from '../BaseDataSource.ts'
import { AbstractQuery } from '../../Core/AbstractQuery.ts'
import { Thing } from '../../schema.org.ts';
import { ApiBibleOptions, ApiBibleRawItem } from './ApiBibleTypes.ts'
import { bcp47Normalize } from '../../Helpers/bcp47Normalize.ts'
import { ISO639_1_to_ISO639_3 } from '../../Helpers/ISO639_1_to_ISO639_3.ts'
import { fetched } from '../../Helpers/fetched.ts'
import { AmericanBibleSociety } from '../../Publishers/AmericanBibleSociety.ts'

export class ApiBibleDataSource extends BaseDataSource<ApiBibleOptions, ApiBibleRawItem, Thing> {

  public label = 'api.bible'
  public publisher = AmericanBibleSociety

  public url = new URL('https://api.scripture.api.bible')

  public nativelySupports = {
    text: true,
    langCode: true,
    types: true,
    multilingualItems: false,
  }

  async fetch (query: AbstractQuery, page = 0, offset = 0) {
    const fetchUrl = new URL(`${this.url}v1/bibles`)

    if (query.langCode) fetchUrl.searchParams.set('language', ISO639_1_to_ISO639_3(query.langCode))
    if (query.text) fetchUrl.searchParams.set('name', query.text)
    
    const response = await fetched(fetchUrl, { headers: { 'api-key': this.options.key }})
    const json = await response.json()

    this.done = true // We are always done after one search. This API does not have pagination.

    return (json.data as Array<any>)?.slice(offset) ?? []
  }

  /**
   * The transformation from an API specific item to a schema.org item.
   */
  normalize(item: ApiBibleRawItem) {
    const normalizedItem: Thing = {
      '@type': 'Book',
      'name': item.name,
      'description': item.description,
      '@id': `https://api.bible/${item.id}`,
      'url': `https://bibles.org/bible/${item.id}/_`,
      'inLanguage': bcp47Normalize(item.language.id)
    }

    return normalizedItem
  }

  types () {
    return ['http://schema.org/Book']
  }

  async resolveId (id: string) {
    const isOurs = id.includes('https://api.bible/')
    if (isOurs) {
      const bibleId = id.split('/').pop()
      const fetchUrl = new URL(`${this.url}v1/bibles/${bibleId}`)
      const response = await fetched(fetchUrl, { headers: { 'api-key': this.options.key }})
      const json = await response.json()
      return json.data
    }
  }
}