import { BaseDataSource } from '../BaseDataSource.ts'
import { AbstractQuery } from '../../Core/AbstractQuery.ts'
import { VideoObject } from '../../schema.org.ts';
import { VimeoOptions, VimeoRawItem } from './VimeoTypes.ts'
import { fetched } from '../../Helpers/fetched.ts'

export class VimeoDataSource extends BaseDataSource<VimeoOptions, VimeoRawItem, VideoObject> {

  public paginationType = 'page'

  public url = new URL('https://api.vimeo.com')

  async fetch (_query: AbstractQuery, page = 0, offset: string | undefined = undefined) {
    const fetchUrl = new URL(`https://api.vimeo.com/users/${this.options.channel}/videos`)
    fetchUrl.searchParams.set('sort', 'alphabetical')
    fetchUrl.searchParams.set('page', (offset !== undefined ? parseInt(offset) + 1 : page + 1).toString())
    fetchUrl.searchParams.set('per_page', '50')

    const request = await fetched(fetchUrl, {
      headers: { 'Authorization': `basic ${btoa(`${this.options.clientId}:${this.options.clientSecret}`)}`}
    })
    const response = await request.json()

    if (response.error) {
      console.error(response)
      this.done = true 
      return []
    }

    if (!response.paging.next) this.done = true 

    return response?.data ?? []
  }

  /**
   * The transformation from an API specific item to a schema.org item.
   */
  normalize(item: VimeoRawItem) {
    const normalizedItem = {
      'name': item.name,
      'description': item.description,
      '@type': 'VideoObject',
      'url': item.link,
      'inLanguage': item.language
    } as VideoObject

    return normalizedItem
  }

  types () {
    return ['https://schema.org/VideoObject']
  }
}