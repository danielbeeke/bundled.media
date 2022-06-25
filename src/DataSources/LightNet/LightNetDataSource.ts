import { BaseDataSource } from '../BaseDataSource.ts'
import { AbstractQuery } from '../../Core/AbstractQuery.ts'
import { Thing, VideoObject, Book } from '../../schema.org.ts';
import { LightNetTypeMapping, LightNetSchemaTypeMapping, LightNetOptions, LightNetRawItem } from './LightNetTypes.ts'
import { fetched } from '../../Helpers/fetched.ts'

export class LightNetDataSource extends BaseDataSource<LightNetOptions, LightNetRawItem, Thing> {

  public nativelySupports = {
    text: true,
    langCode: true,
    types: true
  }

  constructor (options: LightNetOptions) {
    super(options)
    this.url = new URL(`${options.url}/${options.channel}`)
    this.publisher = options.publisher
    this.label = options.label
  }

  async fetch (query: AbstractQuery, page = 0, offset = 0) {
    let types = this.options.types.join(',')
    
    if (query.types.length) {
      types = query.types.map((type: string) => LightNetSchemaTypeMapping[type]).join(',')
    }

    const fetchUrl = new URL(`${this.options.url}/${this.options.channel}/${types}`)

    fetchUrl.searchParams.set('offset', (offset + (page * this.options.limit)).toString())
    fetchUrl.searchParams.set('limit', this.options.limit.toString())
    fetchUrl.searchParams.set('sort[name]', 'asc')
    
    fetchUrl.searchParams.set('sidetrack[0]', 'authors')

    if (query.text) fetchUrl.searchParams.set('search', `*${query.text}*`)
    if (query.langCode) fetchUrl.searchParams.set('langCode', query.langCode)

    const response = await fetched(fetchUrl)
    const json = await response.json()

    if (json.errors) {
      console.log(json.errors)
      this.done = true
      return []
    }

    if (json.total === json.data.length || !json.data.length) this.done = true 
    this.addSidetracksToData(json)
    return json.data
  }

  addSidetracksToData (json: any) {
    for (const item of json.data) {
      item.authorsData = (item.authors ?? []).map((authorUrl: string) => {
        const personTranslations = json.sidetrack.person?.filter((item: any) => item.id === authorUrl.split('/').pop()) ?? []
        const organizationTranslations = json.sidetrack.organization?.filter((item: any) => item.id === authorUrl.split('/').pop()) ?? []
  
        return [
          ...personTranslations,
          ...organizationTranslations
        ]
      })
    }

    return json
  }

  /**
   * The transformation from an API specific item to a schema.org item.
   */
  normalize(item: LightNetRawItem) {
    const image = item.covers ? item.covers.find(image => image.url.includes('front')) ?? item.covers[0] : item.cover

    const authors = item.authorsData.map((authorTranslations) => authorTranslations
      .find((authorTranslation: any) => authorTranslation.langCode === item.langCode) ?? authorTranslations[0])
    .filter(Boolean)  
    .map(author => {
      return {
        '@type': author.type.substring(0, 1).toUpperCase() + author.type.substring(1),
        name: author.name,
        url: `${this.options.url.toString().replace('data', 'rdf')}/contents/${author.type}/${author.id}`
      }
    })

    return {
      '@id': `${this.options.url.toString().replace('data', 'rdf')}/contents/${item.type}/${item.id}:${item.langCode}`,
      '@type': LightNetTypeMapping[item.type],
      'name': item.name,
      'url': item.urls ?? item.src,
      'inLanguage': item.langCode,
      'description': item.description,
      'author': authors,
      'thumbnail': {
        url: image!.url,
        width: image!.width?.toString(),
        height: image!.height?.toString()
      },
    } as VideoObject | Book
  }

  /**
   * Returns schema.org normalized types.
   */
  types () {
    return this.options.types
    .map(type => `https://schema.org/${LightNetTypeMapping[type]}`)
  }

  async resolveId (id: string) {
    const isOurs = id.includes(this.options.url.toString().replace('data', 'rdf'))
    if (isOurs) {
      const [lightNetId, langCode] = id.split('/').pop()!.split(':')
      const fetchUrl = new URL(`${this.options.url}/${this.options.channel}/${this.options.types.join(',')}`)
      fetchUrl.searchParams.set('filter[id]', lightNetId)
      fetchUrl.searchParams.set('langCode', langCode)
      fetchUrl.searchParams.set('sidetrack[0]', 'authors')

      const response = await fetched(fetchUrl)
      const json: { data: Array<any> } = await response.json()
      this.addSidetracksToData(json)
      return json?.data?.[0]
    }
  }
}