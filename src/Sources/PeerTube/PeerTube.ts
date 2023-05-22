import { PeerTubeOptions, PeerTubeRawItem } from './PeerTubeTypes.ts'

import { FetcherInterface, SourceInterface, AbstractQuery, Thing } from '../../types.ts'
import { FetchByOffsetAndLimit } from '../../Fetchers/FetchByOffsetAndLimit.ts'
import { cache } from '../../Helpers/CacheDecorator.ts'

export class PeerTube implements SourceInterface<PeerTubeRawItem> {

  public fetcher: FetcherInterface

  options: PeerTubeOptions

  constructor (options: PeerTubeOptions) {
    this.options = options
    this.fetcher = new FetchByOffsetAndLimit(this.fetch.bind(this), this.normalize.bind(this), {
      fulltextSearch: true,
      languageFilter: true
    }, 100)
  }

  get label () {
    return this.options.label
  }

  get identifier () {
    return `PeerTube/${this.options.url.split('://').pop()}/${this.options.playlist}`
  }

  @cache
  async fetch (fetched: typeof globalThis.fetch, query: AbstractQuery, offset: number, limit: number) {
    const fetchUrl = new URL(`${this.options.url}/api/v1/video-playlists/${this.options.playlist}/videos`)

    fetchUrl.searchParams.set('start', offset.toString())
    fetchUrl.searchParams.set('count', limit.toString())
    fetchUrl.searchParams.set('sort', 'name')
    fetchUrl.searchParams.set('isLocal', '1')

    if (query.fulltextSearch) {
      fetchUrl.searchParams.set('search', `${query.fulltextSearch}`)
    }
    if (query.bcp47) fetchUrl.searchParams.set('languageOneOf', query.bcp47)

    const response = await fetched(fetchUrl)
    const json = await response.json()
    return { items: json.data?.map((item: any) => item.video ?? item) ?? [] }
  }

  /**
   * The transformation from an API specific item to a schema.org item.
   */
  normalize(item: PeerTubeRawItem) {
    const sourceUrl = new URL(this.options.url)

    return {
      '@id': item.url,
      'name': item.name,
      'description': item.description,
      'inLanguage': item.language?.id ?? 'en',
      '@type': 'VideoObject',
      'thumbnail': {
        'url': sourceUrl.origin + item.thumbnailPath,
      },
      'url': item.url
    }
  }

  /**
   * Returns schema.org normalized types.
   */
  types () {
    return ['VideoObject']
  }
}