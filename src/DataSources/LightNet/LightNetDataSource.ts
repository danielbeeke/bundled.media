import { BaseDataSource } from '../BaseDataSource.ts'
import { AbstractQuery } from '../../Core/AbstractQuery.ts'
import { Thing } from '../../schema.org.ts';
import { LightNetTypeMapping, LightNetOptions, LightNetRawItem } from './LightNetTypes.ts'

export class LightNetDataSource extends BaseDataSource<LightNetRawItem, Thing> {

  #options: LightNetOptions
  
  constructor (options: LightNetOptions) {
    super()
    this.#options = options
  }

  get url () {
    return this.#options.url
  }

  async fetch (query: AbstractQuery, page = 0) {
    const fetchUrl = new URL(`${this.#options.url}/${this.#options.channel}/${this.#options.types.join(',')}`)

    fetchUrl.searchParams.set('offset', (page * 30).toString())
    fetchUrl.searchParams.set('limit', '30')
    fetchUrl.searchParams.set('sort[name]', 'asc')
    
    fetchUrl.searchParams.set('sidetrack[0]', 'authors')
    fetchUrl.searchParams.set('sidetrack[1]', 'category')
    fetchUrl.searchParams.set('sidetrack[2]', 'keywords')

    if (query.text) fetchUrl.searchParams.set('search', `*${query.text}*`)

    // console.log(fetchUrl.toString())

    const response = await fetch(fetchUrl)
    const json = await response.json()

    if (json.total === json.data.length || !json.data.length) this.done = true 

    return json.data
  }

  /**
   * The transformation from an API specific item to a schema.org item.
   */
  normalize(item: LightNetRawItem) {
    const normalizedItem: Thing = {
      '@type': LightNetTypeMapping[item.type],
      'name': item.name,
      'url': item.urls,
      'inLanguage': item.langCode
    }

    return normalizedItem
  }
}