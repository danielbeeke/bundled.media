import { BaseDataSource } from '../BaseDataSource.ts'
import { AbstractQuery } from '../../Core/AbstractQuery.ts'
import { Thing, VideoObject, ImageObject } from '../../schema.org.ts';
import { JesusFilmOptions, JesusFilmRawItem } from './JesusFilmTypes.ts'
import { fetched } from '../../Helpers/fetched.ts'

const languagesMap = new Map()

export class JesusFilmDataSource extends BaseDataSource<JesusFilmOptions, JesusFilmRawItem, Thing> {

  public url = new URL('https://api.arclight.org')

  private key: string

  public nativelySupports = {
    text: true,
    langCode: true,
    types: true
  }

  constructor (options: JesusFilmOptions) {
    super(options)
    this.key = options.key
  }

  async fetch (query: AbstractQuery, page = 0, offset = 0) {
    const langCode = query.langCode ? query.langCode : 'en'

    const languageIds = await this.getLanguageIdsByBcp47(langCode)

    if (!languageIds?.length) {
      this.done = true
      return []
    }
    
    const fetchUrl = new URL(`https://api.arclight.org/v2/media-components`)

    fetchUrl.searchParams.set('subTypes', 'featureFilm')
    fetchUrl.searchParams.set('filter', 'default')
    fetchUrl.searchParams.set('metadataLanguageTags', `${langCode},en`)    
    fetchUrl.searchParams.set('apiKey', this.key)
    fetchUrl.searchParams.set('languageIds', languageIds.join(','))
    fetchUrl.searchParams.set('page', ((offset / 10) + page + 1).toString())
    fetchUrl.searchParams.set('limit', '10')    

    if (query.text) fetchUrl.searchParams.set('term', query.text)

    const response = await fetched(fetchUrl)
    const json = await response.json()

    if (json.page === json.pages || !json._embedded?.mediaComponents) this.done = true
    const items = json._embedded?.mediaComponents ?? []

    if (!Array.isArray(items)) {
      this.done = true
      return []
    }

    const promises = items.filter((item: { mediaComponentId: string, downloads: any }) => item.mediaComponentId)
    .map(async (item: { mediaComponentId: string, subtitles: any, urls: any, bcp47: string, id: string }) => {
      const { urls, subtitles, id } = await this.getLocalizedItem(item.mediaComponentId, languageIds, langCode)
      item.urls = urls
      item.subtitles = subtitles
      item.bcp47 = langCode
      item.id = id
      return item
    })

    return await Promise.all(promises)
  }

  async getLocalizedItem (id: string, languageIds: Array<string>, bcp47: string) {
    const url = new URL(`https://api.arclight.org/v2/media-components/${id}/languages`)
    url.searchParams.set('bcp47', bcp47)
    url.searchParams.set('metadataLanguageTags', `${bcp47},en`)    
    url.searchParams.set('languageIds', languageIds.join(','))
    url.searchParams.set('filter', 'default')
    url.searchParams.set('platform', 'ios')
    url.searchParams.set('apiKey', this.key)
    const response = await fetched(url)
    const json = await response.json()
    const data = json._embedded.mediaComponentLanguage[0]
    const urls = data.streamingUrls.m3u8.map((urlObject: any) => urlObject.url.split('?apiSessionId')[0] + '#.m3u8')
    const subtitles = data.subtitleUrls.vtt

    if (data.shareUrl) urls.push(data.shareUrl.split('?')[0] + '#viewer')

    const youtubeUrl = data.socialMediaUrls?.YouTube?.url
    if (youtubeUrl) urls.push(youtubeUrl)

    return {
      subtitles, urls, id: data.refId
    }
  }

  async getLanguageIdsByBcp47 (bcp47: string) {
    if (!languagesMap.get(bcp47)) {
      const fetchLanguageUrl = new URL(`https://api.arclight.org/v2/media-languages`)
      fetchLanguageUrl.searchParams.set('bcp47', bcp47)
      fetchLanguageUrl.searchParams.set('metadataLanguageTags', 'en')    
      fetchLanguageUrl.searchParams.set('filter', 'default')
      fetchLanguageUrl.searchParams.set('apiKey', this.key)
      fetchLanguageUrl.searchParams.set('limit', '10')    
      const languageResponse = await fetched(fetchLanguageUrl)
      const languageJson = await languageResponse.json()
      const languages = languageJson?._embedded?.mediaLanguages
  
      if (!languagesMap.has(bcp47)) languagesMap.set(bcp47, [])
  
      if (languages) {
        for (const language of languages) {
          const bcp47Matches = languagesMap.get(bcp47)
          if (!bcp47Matches.includes(language.languageId)) {
            bcp47Matches.push(language.languageId)
          }
        }    
      }
    }

    return languagesMap.get(bcp47) ?? []
  }

  /**
   * The transformation from an API specific item to a schema.org item.
   */
  normalize(item: JesusFilmRawItem) {
    return {
      '@id': `urn:jesus-film:${item.id}`,
      '@type': 'VideoObject',
      'name': item.title,
      'url': item.urls,
      'inLanguage': item.bcp47 ?? 'en',
      'description': item.longDescription,
      // 'author': authors,
      // 'http://taxonomy.mediaworks.global/category': this.categoryMap?.[languageIndependantId],
      'thumbnail': {
        "@type": "ImageObject",
        url: item.imageUrls!.videoStill ?? item.imageUrls!.mobileCinematicHigh ?? item.imageUrls!.thumbnail,
      } as ImageObject,
    } as VideoObject
  }

  /**
   * Returns schema.org normalized types.
   */
  types () {
    return ['http://schema.org/VideoObject']
  }

  resolveId (id: string) {
    return id.includes(`https://jesusfilm.com`)
  }
}