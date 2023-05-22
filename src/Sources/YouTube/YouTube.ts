import { FetchByToken } from '../../Fetchers/FetchByToken.ts'
import { FetcherInterface, SourceInterface, AbstractQuery, Thing, LocalMechanismsInterface } from '../../types.ts'
import { Html5Entities } from 'https://deno.land/x/html_entities@v1.0/mod.js'
import { YouTubeRawItem, YouTubeOptions } from './YouTubeTypes.ts'
import { cache } from '../../Helpers/CacheDecorator.ts'
import { tryToExtractLanguage } from '../../Helpers/tryToExtractLanguage.ts'

/**
 * YouTube has a token based API. This is great, each time when more results are needed we can fetch it.
 * YouTube also supports full text search, but that API is expensive so we dont use it, for that reason we just fetch the whole channel.
 * Because of that way of dealing with YouTube our implementation does not support fulltext search on the source side.
 * That is why we have localMechanisms.fulltextSearch = true. The abstraction will do it on behalf of us.
 */
export class YouTube implements SourceInterface<YouTubeRawItem> {

  options: YouTubeOptions
  public whitelistedDomains: Array<string> = [
    'www.googleapis.com'
  ]

  // We can not increase this, it is hardcoded max value for the YouTube API.
  public maxResults = 50
  public fetcher: FetcherInterface

  constructor (options: YouTubeOptions) {
    this.options = options

    const localMechanisms: LocalMechanismsInterface = {
      fulltextSearch: true,
      languageFilter: true
    }

    this.fetcher = new FetchByToken(
      this.fetch.bind(this), 
      this.normalize.bind(this), 
      localMechanisms,
      this.maxResults,
    )
  }

  get label () {
    return this.options.channel.charAt(0).toUpperCase() + this.options.channel.slice(1)
  }

  get identifier () {
    return `youtube/${this.options.channel}`
  }

  /**
   * It seemed difficult to get a channel ID from a channel name by the API.
   */
  @cache
  async channelNameToPlaylistId (fetched: typeof globalThis.fetch, channel: string) {
    const fetchUrl = new URL(`https://www.youtube.com/@${channel}`)
    const response = await fetched(fetchUrl)
    const page = await response.text()
    const regex = /c4TabbedHeaderRenderer":{"channelId":"UC([a-zA-Z0-9_]*)"/g
    const matches = regex.exec(page)
    return `UU${matches?.[1]}`
  }

  /**
   * The main fetch method. Grabs every thing in one fetch, but it does filter.
   */
  @cache
  async fetch (fetched: typeof globalThis.fetch, _query: AbstractQuery, token: string | null) {
    const channelId = await this.channelNameToPlaylistId(fetched, this.options.channel)

    console.log(channelId)

    const fetchUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems')
    fetchUrl.searchParams.set('part', 'snippet')
    fetchUrl.searchParams.set('playlistId', channelId)
    fetchUrl.searchParams.set('key', this.options.key)
    fetchUrl.searchParams.set('maxResults', this.maxResults.toString())
    fetchUrl.searchParams.set('fields', 'nextPageToken,items(id,snippet(title,resourceId,thumbnails.high))')

    if (token) fetchUrl.searchParams.set('pageToken', token)

    const request = await fetched(fetchUrl)
    const response = await request.json()

    const ids = response.items?.map((item: YouTubeRawItem) => item.snippet.resourceId.videoId) ?? []
    const videosUrl = new URL('https://www.googleapis.com/youtube/v3/videos')
    videosUrl.searchParams.set('fields', 'nextPageToken,items(id,snippet(defaultAudioLanguage,defaultLanguage))')
    videosUrl.searchParams.set('part', 'snippet')
    videosUrl.searchParams.set('id', ids.join(','))
    videosUrl.searchParams.set('key', this.options.key)

    const videosRequest = await fetched(videosUrl)
    const videosResponse = await videosRequest.json()

    for (const item of (response?.items ?? [])) {
      const meta = videosResponse.items.find((metaItem: any) => metaItem.id === item.snippet.resourceId.videoId)
      item.defaultAudioLanguage = meta.snippet.defaultAudioLanguage
      item.defaultLanguage = meta.snippet.defaultLanguage
    }

    return {
      items: response.items,
      token: response.nextPageToken
    }
  }

  /**
   * The transformation from an API specific item to a schema.org item.
   */
   normalize(item: YouTubeRawItem): Thing {
    const title = Html5Entities.decode(item.snippet.title)
    const extractedLanguage = tryToExtractLanguage([...title.split(' ')])
    const language = extractedLanguage ?? item.defaultAudioLanguage ?? item.defaultLanguage

    return {
      '@id': `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
      'name': title,
      'description': item.snippet.description,
      'inLanguage': language,
      '@type': 'VideoObject',
      'thumbnail': {
        'url': item.snippet.thumbnails.high.url,
        'width': item.snippet.thumbnails.high.width.toString(),
        'height': item.snippet.thumbnails.high.height.toString(),
      },
      'url': `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`
    }
  }

  /**
   * Used for static filtering
   */
  types () {
    return ['VideoObject']
  }
}