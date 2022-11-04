import { LightNetTypeMapping, LightNetSchemaTypeMapping, LightNetOptions, LightNetRawItem } from './LightNetTypes.ts'

import { FetcherInterface, SourceInterface, AbstractQuery, Thing } from '../../types.ts'
import { fetched } from '../../Helpers/fetched.ts'
import { FetchByOffsetAndLimit } from '../../Fetchers/FetchByOffsetAndLimit.ts'
import { cache } from '../../Helpers/CacheDecorator.ts'

export class LightNet implements SourceInterface<LightNetRawItem> {

  public fetcher: FetcherInterface

  public nativelySupports = {
    text: true,
    langCode: true,
    types: true,
    multilingualItems: false,
  }

  #options: LightNetOptions

  constructor (options: LightNetOptions) {
    this.#options = options
    this.fetcher = new FetchByOffsetAndLimit(this.fetch.bind(this), this.normalize.bind(this), {}, options.limit)
  }

  @cache
  async fetch (query: AbstractQuery, offset: number, limit: number) {
    const types = this.#options.types.join(',')
    
    // if (query.types.length) {
    //   types = query.types.map((type: string) => LightNetSchemaTypeMapping[type]).join(',')
    // }

    const fetchUrl = new URL(`${this.#options.url}/${this.#options.channel}/${types}`)

    fetchUrl.searchParams.set('offset', offset.toString())
    fetchUrl.searchParams.set('limit', limit.toString())
    fetchUrl.searchParams.set('sort[name]', 'asc')
    
    fetchUrl.searchParams.set('sidetrack[0]', 'authors')

    if (query.fulltextSearch) fetchUrl.searchParams.set('search', `*${query.fulltextSearch}*`)
    if (query.bcp47) fetchUrl.searchParams.set('langCode', query.bcp47)

    const response = await fetched(fetchUrl)
    const json = await response.json()

    this.addSidetracksToData(json)

    return { items: json.data }
  }

  addSidetracksToData (json: any) {
    for (const item of json.data) {
      item.authorsData = (item.authors ?? []).map((authorUrl: string) => {
        const personTranslations = json.sidetrack.person?.filter((item: any) => item.id === authorUrl.split('/').pop()) ?? []
        const organizationTranslations = json.sidetrack.organization?.filter((item: any) => item.id === authorUrl.split('/').pop()) ?? []
  
        return [
          ...personTranslations,
          ...organizationTranslations
        ]
      })
    }

    return json
  }

  /**
   * The transformation from an API specific item to a schema.org item.
   */
  normalize(item: LightNetRawItem) {
    const image = item.covers ? item.covers.find(image => image.url.includes('front')) ?? item.covers[0] : item.cover

    const authors = item.authorsData.map((authorTranslations) => authorTranslations
      .find((authorTranslation: any) => authorTranslation.langCode === item.langCode) ?? authorTranslations[0])
    .filter(Boolean)  
    .map(author => {
      return {
        '@type': author.type.substring(0, 1).toUpperCase() + author.type.substring(1),
        name: author.name,
        url: `${this.#options.url.toString().replace('data', 'rdf')}/contents/${author.type}/${author.id}`
      }
    })

    const languageIndependantId = `${this.#options.url.toString().replace('data', 'rdf')}/contents/${item.type}/${item.id}`

    const urls = [...item?.urls ?? [], item.src].filter(Boolean)

    const object = {
      '@id': `${languageIndependantId}/${item.langCode}`,
      '@type': LightNetTypeMapping[item.type],
      'name': item.name,
      'url': urls,
      'inLanguage': item.langCode,
      'description': item.description,
      'author': authors,
      'thumbnail': {
        url: image!.url,
        width: image!.width?.toString(),
        height: image!.height?.toString()
      },
    } as Thing

    return object
  }

  /**
   * Returns schema.org normalized types.
   */
  types () {
    return this.#options.types
    .map(type => LightNetTypeMapping[type])
  }

}