import { FunkWhaleOptions, FunkWhaleRawItem } from './FunkWhaleTypes.ts'

import { FetcherInterface, SourceInterface, AbstractQuery, Thing } from '../../types.ts'
import { FetchByPage } from '../../Fetchers/FetchByPage.ts'
import { cache } from '../../Helpers/CacheDecorator.ts'

export class FunkWhale implements SourceInterface<FunkWhaleRawItem> {

  public fetcher: FetcherInterface

  options: FunkWhaleOptions

  constructor (options: FunkWhaleOptions) {
    this.options = options
    this.fetcher = new FetchByPage(this.fetch.bind(this), this.normalize.bind(this), {}, 25)
  }

  get label () {
    return this.options.label
  }

  get identifier () {
    return `FunkWhale/${this.options.url.split('://').pop()}`
  }

  @cache
  async fetch (fetched: typeof globalThis.fetch, query: AbstractQuery, page: number) {
    const sourceUrl = new URL(this.options.url)

    const fetchUrl = new URL(`${sourceUrl.origin}/api/v1/tracks`)

    fetchUrl.searchParams.set('channel', this.options.channel)
    fetchUrl.searchParams.set('ordering', 'creation_date')
    fetchUrl.searchParams.set('page_size', '25')
    fetchUrl.searchParams.set('page', (page + 1).toString())
    fetchUrl.searchParams.set('include_channels', 'true')

    if (query.fulltextSearch) {
      fetchUrl.searchParams.set('q', `${query.fulltextSearch}`)
    }

    const response = await fetched(fetchUrl)
    const json = await response.json()
    return { items: json.results }
  }

  /**
   * The transformation from an API specific item to a schema.org item.
   */
  normalize(item: FunkWhaleRawItem) {
    const returnItem: any = {
      '@id': item.fid,
      'name': item.title,
      'description': item.title,
      'inLanguage': 'und',
      '@type': 'AudioObject',
      'url': this.options.url + item.listen_url
    }

    if (item.cover?.urls?.original) {
      returnItem.thumbnail = {
        'url': item.cover?.urls?.original
      }
    }

    return returnItem
  }

  /**
   * Returns schema.org normalized types.
   */
  types () {
    return ['AudioObject']
  }
}