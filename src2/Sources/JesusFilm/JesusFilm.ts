import { FetcherInterface, SourceInterface, AbstractQuery, Thing } from '../../types.ts'
import { JesusFilmOptions, JesusFilmRawItem } from './JesusFilmTypes.ts'
import { fetched } from '../../Helpers/fetched.ts'
import { FetchByPage } from '../../Fetchers/FetchByPage.ts'
import { cache } from '../../Helpers/CacheDecorator.ts'

export class JesusFilm implements SourceInterface<JesusFilmRawItem> {

  #options: JesusFilmOptions
  public whitelistedDomains: Array<string> = [
    'api.arclight.org'
  ]

  public fetcher: FetcherInterface

  constructor (options: JesusFilmOptions) {
    this.#options = options
    this.fetcher = new FetchByPage(this.fetch.bind(this), this.normalize.bind(this), {}, 10)
  }

  @cache
  async fetch (query: AbstractQuery, page = 0) {
    const langCode = query.bcp47 ? query.bcp47 : 'en'
    const languages = await this.getLanguageIdsByBcp47(langCode)
    if (!languages.length) throw new Error('Could not get the language by bcp47')
    const fetchUrl = new URL('https://api.arclight.org/v2/media-components')

    fetchUrl.searchParams.set('subTypes', 'featureFilm')
    fetchUrl.searchParams.set('filter', 'default')
    fetchUrl.searchParams.set('metadataLanguageTags', `${langCode},en`)    
    fetchUrl.searchParams.set('apiKey', this.#options.key)
    fetchUrl.searchParams.set('languageIds', languages.join(','))
    fetchUrl.searchParams.set('page', (page + 1).toString())
    fetchUrl.searchParams.set('limit', '10')    
    if (query.fulltextSearch) fetchUrl.searchParams.set('term', query.fulltextSearch)

    const response = await fetched(fetchUrl)
    const json = await response.json()
    const genericItems = json._embedded?.mediaComponents ?? []

    const items = await Promise.all(genericItems.filter((item: any) => item.mediaComponentId).map(async (item: any) => {
      const localizedItem = await this.getLocalizedItem(item.mediaComponentId, languages, langCode)
      Object.assign(item, localizedItem)
      item.bcp47 = langCode
      return item
    }))

    return { items }
  }

  @cache
  async getLocalizedItem (id: string, languageIds: Array<string>, bcp47: string) {
    const url = new URL(`https://api.arclight.org/v2/media-components/${id}/languages`)
    url.searchParams.set('bcp47', bcp47)
    url.searchParams.set('metadataLanguageTags', `${bcp47},en`)    
    url.searchParams.set('languageIds', languageIds.join(','))
    url.searchParams.set('filter', 'default')
    url.searchParams.set('platform', 'ios')
    url.searchParams.set('apiKey', this.#options.key)
    const response = await fetched(url)
    const json = await response.json()
    const data = json._embedded.mediaComponentLanguage[0]
    const urls = data.streamingUrls.m3u8.map((urlObject: any) => urlObject.url.split('?apiSessionId')[0] + '#.m3u8')
    const subtitles = data.subtitleUrls.vtt

    if (data.shareUrl) urls.push(data.shareUrl.split('?')[0] + '#viewer')
    const youtubeUrl = data.socialMediaUrls?.YouTube?.url
    if (youtubeUrl) urls.push(youtubeUrl)

    return { subtitles, urls, id: data.refId }
  }

  @cache
  async getLanguageIdsByBcp47 (bcp47: string) {
    const fetchLanguageUrl = new URL(`https://api.arclight.org/v2/media-languages`)
    fetchLanguageUrl.searchParams.set('bcp47', bcp47)
    fetchLanguageUrl.searchParams.set('metadataLanguageTags', 'en')    
    fetchLanguageUrl.searchParams.set('filter', 'default')
    fetchLanguageUrl.searchParams.set('apiKey', this.#options.key)
    fetchLanguageUrl.searchParams.set('limit', '10')    
    const languageResponse = await fetched(fetchLanguageUrl)
    const languageJson = await languageResponse.json()
    return languageJson?._embedded?.mediaLanguages?.map((language: any) => language.languageId) ?? []
  }

  /**
   * The transformation from an API specific item to a schema.org item.
   */
  normalize(item: JesusFilmRawItem): Thing {
    return {
      '@id': `urn:jesus-film:${item.id}`,
      '@type': 'VideoObject',
      'name': item.title,
      'url': item.urls,
      'inLanguage': item.bcp47 ?? 'en',
      'description': item.longDescription,
      'thumbnail': {
        "@type": "ImageObject",
        url: item.imageUrls!.videoStill ?? item.imageUrls!.mobileCinematicHigh ?? item.imageUrls!.thumbnail,
      },
    }
  }

  /**
   * Returns schema.org normalized types.
   */
  types () {
    return ['VideoObject']
  }
}