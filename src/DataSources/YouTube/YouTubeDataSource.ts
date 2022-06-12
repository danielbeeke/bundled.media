import { BaseDataSource } from '../BaseDataSource.ts'
import { AbstractQuery } from '../../Core/AbstractQuery.ts'
import { Thing } from '../../schema.org.ts';
import { YouTubeOptions, YouTubeRawItem } from './YouTubeTypes.ts'
import { bcp47Normalize } from '../../Helpers/bcp47Normalize.ts'

export class YouTubeDataSource extends BaseDataSource<YouTubeOptions, YouTubeRawItem, Thing> {

  public url = new URL('https://youtube.com')

  async fetch (query: AbstractQuery, page = 0, offset = 0) {
    return []
  }

  /**
   * The transformation from an API specific item to a schema.org item.
   */
  normalize(item: YouTubeRawItem) {
    const normalizedItem: Thing = {
      '@type': 'VideoObject',
      'name': item.name,
      'description': item.description,
      'url': `https://bibles.org/bible/${item.id}/_`,
      'inLanguage': bcp47Normalize(item.language.id)
    }

    return normalizedItem
  }

  types () {
    return ['https://schema.org/VideoObject']
  }
}