import { BaseDataSource } from '../BaseDataSource.ts'
import { AbstractQuery } from '../../Core/AbstractQuery.ts'
import { Thing, VideoObject } from '../../schema.org.ts';
import { GsunGrabOptions, GsunGrabRawItem } from './GsunGrabTypes.ts'
import merge from 'npm:deepmerge'
import { DOMParser, Element } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';

const languages = {
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

export class GsunGrabDataSource extends BaseDataSource<GsunGrabOptions, GsunGrabRawItem, Thing> {

  public url = new URL('https://www.gsungrab.org')

  public nativelySupports = {
    text: false,
    langCode: false,
    types: false,
    multilingualItems: false
  }

  public rows: Array<any> = []

  constructor (options: GsunGrabOptions) {
    super(options)
  }

  async boot() {
    const pageMetdata: any = {}
    
    for (const [langCode, language] of Object.entries(languages)) {
      const response = await fetch(language.url)
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
   
    const output = merge.all(Object.values(pageMetdata))
    this.rows = Object.values(output)
  }

  async fetch (query: AbstractQuery, page = 0, offset = 0) {
    const calculatedOffset = await (page * query.size) + offset
    const slicedRows = this.rows.slice(calculatedOffset, calculatedOffset + query.size)

    if (slicedRows.length < query.size) this.done = true

    return slicedRows
  }

  /**
   * Returns schema.org normalized types.
   */
  types () {
    return ['http://schema.org/Book']
  }

  resolveId (id: string) {
    return id.includes(`https://GsunGrab.com`)
  }
}