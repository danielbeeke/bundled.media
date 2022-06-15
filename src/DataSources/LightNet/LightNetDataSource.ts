import { BaseDataSource } from '../BaseDataSource.ts'
import { AbstractQuery } from '../../Core/AbstractQuery.ts'
import { Thing } from '../../schema.org.ts';
import { LightNetTypeMapping, LightNetSchemaTypeMapping, LightNetOptions, LightNetRawItem } from './LightNetTypes.ts'
import { fetched } from '../../Helpers/fetched.ts'

export class LightNetDataSource extends BaseDataSource<LightNetOptions, LightNetRawItem, Thing> {

  public nativelySupports = {
    text: true,
    langCode: true,
    types: true
  }

  constructor (options: LightNetOptions) {
    super(options)
    this.url = new URL(`${options.url}/${options.channel}`)
  }

  async fetch (query: AbstractQuery, page = 0, offset = 0) {
    let types = this.options.types.join(',')
    
    if (query.types.length) {
      types = query.types.map((type: string) => LightNetSchemaTypeMapping[type]).join(',')
    }

    const fetchUrl = new URL(`${this.options.url}/${this.options.channel}/${types}`)

    fetchUrl.searchParams.set('offset', (offset + (page * this.options.limit)).toString())
    fetchUrl.searchParams.set('limit', this.options.limit.toString())
    fetchUrl.searchParams.set('sort[name]', 'asc')
    
    fetchUrl.searchParams.set('sidetrack[0]', 'authors')
    fetchUrl.searchParams.set('sidetrack[1]', 'category')
    fetchUrl.searchParams.set('sidetrack[2]', 'keywords')

    if (query.text) fetchUrl.searchParams.set('search', `*${query.text}*`)
    if (query.langCode) fetchUrl.searchParams.set('langCode', query.langCode)

    const response = await fetched(fetchUrl)
    const json = await response.json()

    if (json.errors) {
      console.log(json.errors)
      return []
    }

    if (json.total === json.data.length || !json.data.length) this.done = true 

    return json.data
  }

  /**
   * The transformation from an API specific item to a schema.org item.
   */
  normalize(item: LightNetRawItem) {
    return {
      '@type': LightNetTypeMapping[item.type],
      'name': item.name,
      'url': item.urls ?? item.src,
      'inLanguage': item.langCode
    } as Thing
  }

  /**
   * Returns schema.org normalized types.
   */
  types () {
    return this.options.types
    .map(type => `https://schema.org/${LightNetTypeMapping[type]}`)
  }
}