import { FetchByToken } from '../../Fetchers/FetchByToken.ts'
import { FetcherInterface, SourceInterface, AbstractQuery, Thing, LocalMechanismsInterface } from '../../types.ts'
import { Html5Entities } from 'https://deno.land/x/html_entities@v1.0/mod.js'
import { YouTubeRawItem, YouTubeOptions } from './YouTubeTypes.ts'
import { fetched } from '../../Helpers/fetched.ts'

/**
 * YouTube has a token based API. This is great, each time when more results are needed we can fetch it.
 * YouTube also supports full text search, but that API is expensive so we dont use it, for that reason we just fetch the whole channel.
 * Because of that way of dealing with YouTube our implementation does not support fulltext search on the source side.
 * That is why we have localMechanisms.fulltextSearch = true. The abstraction will do it on behalf of us.
 */
export class YouTube implements SourceInterface<YouTubeRawItem> {

  #options: YouTubeOptions
  public whitelistedDomains: Array<string> = [
    'www.googleapis.com',
    'yt.lemnoslife.com'
  ]

  // We can not increase this, it is hardcoded max value for the YouTube API.
  public maxResults = 50
  public fetcher: FetcherInterface

  constructor (options: YouTubeOptions) {
    this.#options = options

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

  get identifier () {
    return `youtube:${this.#options.channel}`
  }

  /**
   * It seemed difficult to get a channel ID from a channel name.
   * This third party API provides this service.
   */
  async channelNameToPlaylistId (channel: string) {
    const fetchUrl = new URL(`https://www.youtube.com/c/${channel}`)
    const response = await fetched(fetchUrl)
    const page = await response.text()
    const regex = /<meta itemprop="channelId" content="UC([a-zA-Z0-9_]*)">/g
    const matches = regex.exec(page)
    return `UU${matches?.[1]}`
  }

  /**
   * The main fetch method. Grabs every thing in one fetch, but it does filter.
   */
  async fetch (_query: AbstractQuery, token: string | null) {
    const channelId = await this.channelNameToPlaylistId(this.#options.channel)

    const fetchUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems')
    fetchUrl.searchParams.set('part', 'snippet')
    fetchUrl.searchParams.set('playlistId', channelId)
    fetchUrl.searchParams.set('key', this.#options.key)
    fetchUrl.searchParams.set('maxResults', this.maxResults.toString())
    fetchUrl.searchParams.set('fields', 'nextPageToken,items(id,snippet(title,resourceId,thumbnails.high))')

    if (token) fetchUrl.searchParams.set('pageToken', token)

    const request = await fetched(fetchUrl)
    const response = await request.json()

    return {
      items: response.items,
      token: response.nextPageToken
    }
  }

  /**
   * The transformation from an API specific item to a schema.org item.
   */
   normalize(item: YouTubeRawItem): Thing {
    return {
      '@id': `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
      'name': Html5Entities.decode(item.snippet.title),
      'description': item.snippet.description,
      'inLanguage': item.defaultAudioLanguage ?? item.defaultLanguage,
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