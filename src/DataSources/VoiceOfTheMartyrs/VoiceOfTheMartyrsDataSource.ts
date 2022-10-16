import { BaseDataSource } from '../BaseDataSource.ts'
import { AbstractQuery } from '../../Core/AbstractQuery.ts'
import { VideoObject } from '../../schema.org.ts';
import { VoiceOfTheMartyrsOptions, VoiceOfTheMartyrsRawItem } from './VoiceOfTheMartyrsTypes.ts'
import { fetched } from '../../Helpers/fetched.ts'
import { DOMParser, Element } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

export class VoiceOfTheMartyrsDataSource extends BaseDataSource<VoiceOfTheMartyrsOptions, VoiceOfTheMartyrsRawItem, VideoObject> {

  public url = new URL('https://www.vm1.tv')
  public label = 'Voice of the Martyrs'

  public nativelySupports = {
    text: false,
    langCode: true,
    types: true
  }

  async fetch (query: AbstractQuery, page = 0, offset = 0) {
    const languages = query.langCode ? [query.langCode] : ['en']
    const languageGetters = (await Promise.all(languages.map(async (langCode) => await this.getLanguagePage(langCode)))).flat()
    const calculatedOffset = (page * query.size) + offset
    const getters = languageGetters.slice(calculatedOffset, calculatedOffset + query.size)

    if (getters.length < query.size || !getters.length) {
      this.done = true
    }

    console.log(page, offset)

    return await Promise.all(getters.map(getter => getter()))
  }

  async getLanguages () {
    const response = await fetched(this.url)
    const homepage = await response.text()
    const document = new DOMParser().parseFromString(homepage, 'text/html')!
    const languagePicker = document.querySelector('.language-picker')!
    const anchors = languagePicker.querySelectorAll('li a')
    return [...anchors].map(anchor => anchor.getAttribute('href').replaceAll('/', '')).filter(Boolean)
  }

  async getLanguagePage (langCode: string) {
    const response = await fetched(`${this.url}${langCode}`)
    const languagePage = await response.text()
    const document = new DOMParser().parseFromString(languagePage, 'text/html')!
    const anchors = document.querySelectorAll('#all-videos .product-title')
    const links = [...anchors].map(anchor => anchor.getAttribute('href')).filter(Boolean).map((link: string) => `https://www.vm1.tv/watch/${link.split('/').pop()}`)


    return links.map(link => () => this.getVideoPage(link, langCode))
  }

  async getVideoPage (url: string, langCode: string) {
    const response = await fetched(url)
    const videoPage = await response.text()
    const document = new DOMParser().parseFromString(videoPage, 'text/html')!

    const title = document.querySelector('meta[property="og:title"]')!.getAttribute('content')
    const description = document.querySelector('meta[property="og:description"]')!.getAttribute('content')
    const downloads = [...document.querySelectorAll('#downloads-modal a')].map(link => link.getAttribute('href'))
    
    let thumbnail: string = ''
    let sources = []

    try {
      const videoSetup = videoPage.match(/ah_video_setup\((.*)/)

      if (videoSetup) {
        const videoSetupObject = JSON.parse(videoSetup[1].trim().replace(`, 'Film', false, 'video_1');`, ''))  
        thumbnail = videoSetupObject[0].image
        sources = videoSetupObject[0].sources.map((source: { file: string }) => source.file)
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
    /** @ts-ignore */
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
    } as VideoObject

    return normalizedItem
  }

  types () {
    return ['https://schema.org/VideoObject']
  }

  identifier () {
    return `https://vm1.tv`
  }

  resolveId (id: string) {
    return id.includes(`https://vm1.tv`)
  }

}