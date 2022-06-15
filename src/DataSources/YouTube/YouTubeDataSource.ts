import { BaseDataSource } from '../BaseDataSource.ts'
import { AbstractQuery } from '../../Core/AbstractQuery.ts'
import { VideoObject } from '../../schema.org.ts';
import { YouTubeOptions, YouTubeRawItem } from './YouTubeTypes.ts'
import { fetched } from '../../Helpers/fetched.ts'
import { Html5Entities } from 'https://deno.land/x/html_entities@v1.0/mod.js'

export class YouTubeDataSource extends BaseDataSource<YouTubeOptions, YouTubeRawItem, VideoObject> {

  public url = new URL('https://youtube.com')
  public paginationType = 'token'

  /**
   * At the moment we went for playlist instead of search. Fetching the playlist can be cached.
   * It will have same results for everyone and this costs little credits.
   * The search endpoint is more expensive and it will be slower.
   * 
   * Generally a channel might have a 1000 videos. We can easily cache this in 20 page requests.
   * This will result in 20 points where a search request costs 10 points each time.
   * 
   * Consequence: searching on youtube data happens in memory.
   */
  async fetch (_query: AbstractQuery, page = 0, offset = '') {
    const channelId = await this.channelNameToPlaylistId(this.options.channel)
    const fetchUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems')
    fetchUrl.searchParams.set('part', 'snippet')
    fetchUrl.searchParams.set('playlistId', channelId)
    fetchUrl.searchParams.set('key', this.options.key)
    fetchUrl.searchParams.set('maxResults', '50')

    if (offset && page === 0) fetchUrl.searchParams.set('pageToken', offset)
    else if (this.tokens.get(page)) fetchUrl.searchParams.set('pageToken', this.tokens.get(page))

    const request = await fetched(fetchUrl)
    const response = await request.json()

    if (response.error) {
      console.error(response.error)
      return []
    }

    if (!response.nextPageToken) this.done = true
    if (response.nextPageToken) this.tokens.set(page + 1, response.nextPageToken)
    return response?.items ?? []
  }

  async channelNameToPlaylistId (channelName: string) {
    const fetchUrl = new URL(`https://yt.lemnoslife.com/channels?part=snippet&forUsername=${channelName}`)
    const request = await fetched(fetchUrl)
    const response = await request.json()
    return 'UU' + response.items[0]['id'].substring(2)
  }

  /**
   * The transformation from an API specific item to a schema.org item.
   */
  normalize(item: YouTubeRawItem) {
    const normalizedItem = {
      'name': Html5Entities.decode(item.snippet.title),
      'description': item.snippet.description,
      '@type': 'VideoObject',
      'url': `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`
    } as VideoObject
    
    normalizedItem.inLanguage = typeof this.options.langCode === 'function' ? 
      this.options.langCode(normalizedItem) : this.options.langCode

    return normalizedItem
  }

  types () {
    return ['https://schema.org/VideoObject']
  }
}