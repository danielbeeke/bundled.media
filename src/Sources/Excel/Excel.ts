import { ExcelOptions, ExcelRawItem, ColumnGetter } from './ExcelTypes.ts'
import { bcp47Normalize } from '../../Helpers/bcp47Normalize.ts'
import { FetcherInterface, SourceInterface, AbstractQuery, Thing, LocalMechanismsInterface } from '../../types.ts'
import { FetchAll } from '../../Fetchers/FetchAll.ts'
import { cache } from '../../Helpers/CacheDecorator.ts'

import * as xlsx from 'https://deno.land/x/sheetjs@v0.18.3/xlsx.mjs'
import * as cptable from 'https://deno.land/x/sheetjs@v0.18.3/dist/cpexcel.full.mjs'
xlsx.set_cptable(cptable)

export class Excel implements SourceInterface<ExcelRawItem> {

  options: ExcelOptions
  public fetcher: FetcherInterface

  constructor (options: ExcelOptions) {
    this.options = options
    
    const localMechanisms: LocalMechanismsInterface = {
      fulltextSearch: true,
      languageFilter: true
    }

    this.fetcher = new FetchAll(
      this.fetch.bind(this), 
      this.normalize.bind(this), 
      localMechanisms
    )
  }

  get label () {
    return this.options.label
  }

  get identifier () {
    return `excel/${this.options.file}`
  }

  @cache
  async fetch (_fetched: typeof globalThis.fetch, _query: AbstractQuery) {
    const data = await Deno.readFile(`./data/${this.options.file}`)
    const workbook = xlsx.read(data)
    const sheetName = this.options.sheet ?? workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const items: Array<ExcelRawItem> = xlsx.utils.sheet_to_json(sheet)
    return { items }
  }

  /**
   * A helper that maps the settings to the Excel sheet.
   */
  getColumn (columnGetters: Array<ColumnGetter> | ColumnGetter, row: ExcelRawItem) {
    const value = (Array.isArray(columnGetters) ? columnGetters : [columnGetters]).map(columnGetter => {
      if (columnGetter.value) return columnGetter.value
      
      const value = row[columnGetter.column!]
      if (!value) return null
      const langCode = columnGetter.langCodeColumn ? row[columnGetter.langCodeColumn] : columnGetter.langCode ?? false
      if (langCode) return { '@value': value, '@language': langCode }  
      return value
    }).filter(Boolean)

    if (!Array.isArray(columnGetters)) return value[0]

    return value
  }

  /**
   * The transformation from an API specific item to a schema.org item.
   */
  normalize(item: ExcelRawItem): Thing {
    const urls = this.options.mapping.url.map(columnGetter => item[columnGetter.column!])

    const returnObject: { [key: string]: any } = {
      '@id': urls[0],
      '@type': this.options.types[0].split('/').pop(),
    }

    for (const [key, mapping] of Object.entries(this.options.mapping)) {
      returnObject[key] = this.getColumn(mapping, item)
    }

    if (typeof returnObject['inLanguage'] === 'string') {
      returnObject['inLanguage'] = bcp47Normalize(returnObject['inLanguage'])
    }

    return returnObject
  }

  /**
   * Returns schema.org normalized types.
   */
  types () {
    return this.options.types
  }
}