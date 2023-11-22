import { FetchByPage } from '../../Fetchers/FetchByPage.ts'
import { FetcherInterface, SourceInterface, AbstractQuery, Thing, LocalMechanismsInterface, sourceOptions } from '../../types.ts'
import { VimeoRawItem, VimeoOptions } from './VimeoTypes.ts'
import { cache } from '../../Helpers/CacheDecorator.ts'

export class Vimeo implements SourceInterface<VimeoRawItem> {

  options: VimeoOptions
  public whitelistedDomains: Array<string> = [
    'api.vimeo.com'
  ]

  public maxResults = 50
  public fetcher: FetcherInterface

  constructor (options: VimeoOptions) {
    this.options = options

    const localMechanisms: LocalMechanismsInterface = {
      fulltextSearch: true,
      languageFilter: true
    }

    this.fetcher = new FetchByPage(
      this.fetch.bind(this), 
      this.normalize.bind(this), 
      localMechanisms,
      this.maxResults,
    )
  }

  get label () {
    return this.options.label ?? this.options.channel.charAt(0).toUpperCase() + this.options.channel.slice(1)
  }

  get identifier () {
    return `vimeo/${this.options.channel}`
  }

  /**
   * The main fetch method.
   */
  @cache
  async fetch (fetched: typeof globalThis.fetch, _query: AbstractQuery, page: number) {
    const fetchUrl = new URL(`https://api.vimeo.com/users/${this.options.channel}/videos`)
    fetchUrl.searchParams.set('sort', 'alphabetical')
    fetchUrl.searchParams.set('page', (page + 1).toString())
    fetchUrl.searchParams.set('per_page', '50')

    const request = await fetch(fetchUrl, {
      headers: { 'Authorization': `basic ${btoa(`${this.options.clientId}:${this.options.clientSecret}`)}`}
    })

    const response = await request.json()
    return { items: response?.data ?? [] }
  }

  /**
   * The transformation from an API specific item to a schema.org item.
   */
   normalize(item: VimeoRawItem): Thing {
    const image = item.pictures.sizes.pop()!
    const id = item.uri.split('/').pop()

    const output: any = {
      '@id': `https://vimeo.com/${id}`,
      'name': item.name,
      'description': item.description,
      '@type': 'VideoObject',
      'url': `https://vimeo.com/${id}`,
      'keywords': item.tags?.map(tag => tag.tag) ?? [],
      'inLanguage': item.language
    }

    if (image) {
      output.thumbnail = {
        'url': image.link,
        'width': image.width.toString(),
        'height': image.height.toString(),
      }
    }

    return output
  }

  /**
   * Used for static filtering
   */
  types () {
    return ['VideoObject']
  }
}