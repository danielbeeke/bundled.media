import { FetcherInterface, SourceInterface, AbstractQuery, Thing } from '../../types.ts'
import { VoiceOfTheMartyrsOptions, VoiceOfTheMartyrsRawItem } from './VoiceOfTheMartyrsTypes.ts'
import { FetchAll } from '../../Fetchers/FetchAll.ts'
import { cache } from '../../Helpers/CacheDecorator.ts'
import { DOMParser, Element } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

export class VoiceOfTheMartyrs implements SourceInterface<VoiceOfTheMartyrsRawItem> {

  options: VoiceOfTheMartyrsOptions
  public whitelistedDomains: Array<string> = [
    'vm1.tv'
  ]

  public fetcher: FetcherInterface
  private url = 'https://www.vm1.tv/'

  constructor (options: VoiceOfTheMartyrsOptions) {
    this.options = options
    this.fetcher = new FetchAll(this.fetch.bind(this), this.normalize.bind(this), {
      fulltextSearch: true,
      languageFilter: false
    })
  }

  get label () {
    return 'VoiceOfTheMartyrs'
  }
  
  get identifier () {
    return 'vom'
  }

  @cache
  async fetch (fetched: typeof globalThis.fetch, query: AbstractQuery) {
    const language = query.bcp47 ?? 'en'
    const items = await this.getLanguagePage(fetched, language)
    return { items }
  }

  async getLanguages (fetched: typeof globalThis.fetch) {
    const response = await fetched(this.url)
    const homepage = await response.text()
    const document = new DOMParser().parseFromString(homepage, 'text/html')!
    const languagePicker = document.querySelector('.language-picker')!
    const anchors = languagePicker.querySelectorAll('li a')
    return [...anchors].map(anchor => (anchor as Element)?.getAttribute('href')?.replaceAll('/', ''))?.filter(Boolean)
  }

  async getLanguagePage (fetched: typeof globalThis.fetch, langCode: string): Promise<Array<any>> {
    const response = await fetched(`${this.url}${langCode}`)
    const languagePage = await response.text()
    const document = new DOMParser().parseFromString(languagePage, 'text/html')!
    const anchors = document.querySelectorAll('#all-videos .product-title')
    const links = [...anchors].map(anchor => (anchor as Element).getAttribute('href')).filter(Boolean).map((link: any) => `https://www.vm1.tv/watch/${link.split('/').pop()}`)
    const items = await Promise.all(links.map(link => this.getVideoPage(fetched, link, langCode)))
    return items.filter(Boolean)
  }

  async getVideoPage (fetched: typeof globalThis.fetch, url: string, langCode: string) {
    const response = await fetched(url)
    const videoPage = await response.text()
    const document = new DOMParser().parseFromString(videoPage, 'text/html')!

    const title = document.querySelector('meta[property="og:title"]')!.getAttribute('content')
    const description = document.querySelector('meta[property="og:description"]')!.getAttribute('content')
    const downloads = [...document.querySelectorAll('#downloads-modal a')].map(link => (link as Element).getAttribute('href'))
    
    let thumbnail = ''
    // let sources = []

    try {
      const videoSetup = videoPage.match(/ah_video_setup\((.*)/)

      if (videoSetup) {
        const videoSetupObject = JSON.parse(videoSetup[1].trim().replace(`, 'Film', false, 'video_1');`, ''))  
        thumbnail = videoSetupObject[0].image
        // sources = videoSetupObject[0].sources.map((source: { file: string }) => source.file)
      }
    }
    catch (exception) {
      return null
    }

    if (!thumbnail) {
      thumbnail = document.querySelector('.product-poster.hidden-xs')!.getAttribute('src')!
    }

    return {
      title,
      id: url,
      langCode,
      description,
      url: [...downloads],
      thumbnail
    }
  }

  /**
   * The transformation from an API specific item to a schema.org item.
   */
   normalize(item: VoiceOfTheMartyrsRawItem) {
    const normalizedItem = {
      '@id': item.id,
      'name': item.title,
      'description': item.description,
      '@type': 'VideoObject',
      'inLanguage': item.langCode,
      'thumbnail': {
        'url': item.thumbnail
      },
      'url': item.url
    }

    return normalizedItem
  }

  /**
   * Returns schema.org normalized types.
   */
  types () {
    return ['VideoObject']
  }
}