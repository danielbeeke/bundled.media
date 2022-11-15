import { GsunGrabRawItem } from './GsunGrabTypes.ts'
import merge from 'npm:deepmerge'
import { DOMParser, Element } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';
import { FetcherInterface, SourceInterface, AbstractQuery, Thing, LocalMechanismsInterface } from '../../types.ts'
import { FetchAll } from '../../Fetchers/FetchAll.ts'
import { cache } from '../../Helpers/CacheDecorator.ts'
import { fetched } from '../../Helpers/fetched.ts'

export class GsunGrab implements SourceInterface<GsunGrabRawItem> {

  public fetcher: FetcherInterface

  constructor () {
    const localMechanisms: LocalMechanismsInterface = {
      fulltextSearch: true,
      languageFilter: true
    }

    this.fetcher = new FetchAll(
      this.fetch.bind(this), 
      (item) => item, 
      localMechanisms
    )
  }

  #languages = {
    en: {
      url: 'https://www.gsungrab.org/en/resources/',
      download: 'Download',
      tibetan: 'Tibetan',
      chinese: 'Tibetan & Chinese',
      english: 'Tibetan & English'
    }, 
    bo: {
      url: 'https://www.gsungrab.org/bo/resources/',
      download: 'ཕབ་ལེན།',
      tibetan: 'དབྱིན་ཡིག',
      chinese: 'བོད་རྒྱ་ཤན་སྦྱར།',
      english: 'བོད་དབྱིན་ཤན་སྦྱར།',
    }, 
    zh: {
      url: 'https://www.gsungrab.org/zh/resources/',
      download: '藏文版',
      tibetan: '藏文版',
      chinese: '藏汉文对照本',
      english: '藏英文对照本',
    }
  }

  get label () {
    return 'GsunGrab'
  }

  get identifier () {
    return 'gsungrab'
  }

  @cache
  async fetch (_query: AbstractQuery) {
    const pageMetdata: any = {}
    
    for (const [langCode, language] of Object.entries(this.#languages)) {
      const response = await fetched(language.url)
      const html = await response.text()
      const document: any = new DOMParser().parseFromString(html, 'text/html')
    
      const languageMetaData = [...document.querySelectorAll('.product, .hero')].filter(product => {
        const buttons = [...product.querySelectorAll('.button')]
        return buttons.some(button => (button as Element)?.getAttribute('href')?.endsWith('.pdf'))
      }).map(product => {
        const metadata = {
          name: product.querySelector('h2, h3').innerText?.trim(),
          thumbnail: product.querySelector('img')?.getAttribute('src'),
          description: product.querySelector('p')?.innerText,
          url: {
            bo: [...product.querySelectorAll('.button')].find(button => {
              return button.innerText.trim() === language.tibetan
            })?.getAttribute('href'),
            ['bo-x-mltlngl-zh']: [...product.querySelectorAll('.button')]
              .find(button => button.innerText.includes(language.chinese))?.getAttribute('href'),
            ['bo-x-mltlngl-en']: [...product.querySelectorAll('.button')]
              .find(button => button.innerText.includes(language.english))?.getAttribute('href')	
          }
        }
      
        if (!metadata.url['bo'] && !metadata.url['bo-x-mltlngl-zh'] && !metadata.url['bo-x-mltlngl-en']) {
          metadata.url.bo = [...product.querySelectorAll('.button')]
            .find(button => button.innerText.trim() == language.download && ((button as Element)?.getAttribute('href')?.endsWith('.pdf')))?.getAttribute('href')
        }
      
        return metadata
      })
    
      pageMetdata[langCode] = {}
    
      for (const metadata of languageMetaData) {
      
        for (const [innerLangCode, url] of Object.entries(metadata.url)) {
          if (url) {
            const item: any = {
              '@id': `https://www.gsungrab.org${url}`,
              '@type': 'Book',
              name: [{ '@language': langCode, '@value': metadata.name }],
              thumbnail: { url: metadata.thumbnail },
              inLanguage: innerLangCode,
              url: `https://www.gsungrab.org${url}`
            }
      
            if (metadata.description) {
              item.description = [{ '@language': langCode, '@value': metadata.description }]
            }
      
            pageMetdata[langCode][`https://www.gsungrab.org${url}`] = item
          }  
        }
      }
    }
   
    const output = merge.all(Object.values(pageMetdata)) as Array<Thing>
    const items = Object.values(output)

    return { items }
  }

  /**
   * Returns schema.org normalized types.
   */
  types () {
    return ['Book']
  }
}