import { FetchByToken } from '../Fetchers/FetchByToken.ts'
import { FetcherInterface, SourceInterface, AbstractQuery, Thing, LocalMechanismsInterface } from '../types.ts'
import { Html5Entities } from 'https://deno.land/x/html_entities@v1.0/mod.js'
import { RawYouTubeItem, YouTubeOptions } from './YouTubeTypes.ts'
import { fetched } from '../Helpers/fetched.ts'

// We can not increase this, it is hardcoded max value for the YouTube API.
const maxResults = 50

export class YouTube implements SourceInterface<RawYouTubeItem> {

  #options: YouTubeOptions

  public fetcher: FetcherInterface

  constructor (options: YouTubeOptions) {
    this.#options = options

    // Which properties does our source implementation support?
    // Every property the source implementation that is not supported is done by the abstraction.
    // If your source does not support filtering on language, you just give back all the items unfiltered and the abstraction will do the rest.
    const localMechanisms: LocalMechanismsInterface = {
      fulltextSearch: true,
      languageFilter: true
    }

    this.fetcher = new FetchByToken(
      this.fetch.bind(this), 
      this.normalize.bind(this), 
      maxResults, 
      localMechanisms
    )
  }

  /**
   * It seemed difficult to get a channel ID from a channel name.
   * This third party API provides this service.
   */
  async channelNameToPlaylistId (channel: string) {
    const fetchUrl = new URL(`https://yt.lemnoslife.com/channels?part=snippet&forUsername=${channel}`)
    const request = await fetched(fetchUrl)
    const response = await request.json()
    return `UU${response.items[0]['id'].substring(2)}`
  }

  /**
   * YouTube has a token based API. This is great, each time more results are needed we can fetch it.
   * YouTube also supports full text search, but that API is expensive so we dont use it, for that reason we just fetch the whole channel.
   * Because of that way of dealing with YouTube our implementation does not support fulltext search.
   */
  async fetch (_query: AbstractQuery, token: string | null) {
    const channelId = await this.channelNameToPlaylistId(this.#options.channel)

    const fetchUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems')
    fetchUrl.searchParams.set('part', 'snippet')
    fetchUrl.searchParams.set('playlistId', channelId)
    fetchUrl.searchParams.set('key', this.#options.key)
    fetchUrl.searchParams.set('maxResults', maxResults.toString())
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
   normalize(item: RawYouTubeItem) {
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
    } as Thing
  }

  /**
   * Used for static filtering
   */
  types () {
    return ['VideoObject']
  }
}