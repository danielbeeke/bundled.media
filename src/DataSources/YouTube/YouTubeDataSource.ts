import { BaseDataSource } from '../BaseDataSource.ts'
import { AbstractQuery } from '../../Core/AbstractQuery.ts'
import { Thing } from '../../schema.org.ts';
import { YouTubeOptions, YouTubeRawItem } from './YouTubeTypes.ts'
import { fetched } from '../../Helpers/fetched.ts'
import { Html5Entities } from 'https://deno.land/x/html_entities@v1.0/mod.js'

export class YouTubeDataSource extends BaseDataSource<YouTubeOptions, YouTubeRawItem, Thing> {

  public url = new URL('https://youtube.com')
  public paginationType = 'token'

  async fetch (query: AbstractQuery, page = 0, offset = '') {
    const fetchUrl = new URL('https://www.googleapis.com/youtube/v3/search')
    fetchUrl.searchParams.set('part', 'snippet')
    fetchUrl.searchParams.set('channelId', this.options.channel)
    fetchUrl.searchParams.set('type', 'video,playlist')
    fetchUrl.searchParams.set('order', 'title')
    fetchUrl.searchParams.set('maxResults', '50')
    fetchUrl.searchParams.set('key', this.options.key)

    if (query.text) fetchUrl.searchParams.set('q', query.text)

    if (offset && page === 0) fetchUrl.searchParams.set('pageToken', offset)
    else if (this.tokens.get(page)) fetchUrl.searchParams.set('pageToken', this.tokens.get(page))

    const request = await fetched(fetchUrl)
    const response = await request.json()

    if (response.error) {
      console.error(response.error)
      return []
    }

    if (!response.nextPageToken)
      this.done = true

    if (response.nextPageToken) this.tokens.set(page + 1, response.nextPageToken)

    return response?.items ?? []
  }

  /**
   * The transformation from an API specific item to a schema.org item.
   */
  normalize(item: YouTubeRawItem) {
    const normalizedItem: Thing = {
      '@type': 'VideoObject',
      'name': Html5Entities.decode(item.snippet.title),
      'description': item.snippet.description,
      'url': `https://www.youtube.com/watch?v=${item.id.videoId ?? item.id.playlistId}`,
    }

    normalizedItem.inLanguage = typeof this.options.langCode === 'function' ? 
      this.options.langCode(normalizedItem) : this.options.langCode


    return normalizedItem
  }

  types () {
    return ['https://schema.org/VideoObject']
  }
}