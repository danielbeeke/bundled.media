import { ExcelOptions, ExcelRawItem, ColumnGetter } from './ExcelTypes.ts'
import { bcp47Normalize } from '../../Helpers/bcp47Normalize.ts'
import { FetcherInterface, SourceInterface, AbstractQuery, Thing, LocalMechanismsInterface } from '../../types.ts'
import { FetchAll } from '../../Fetchers/FetchAll.ts'
import { cache } from '../../Helpers/CacheDecorator.ts'

import * as xlsx from 'https://deno.land/x/sheetjs@v0.18.3/xlsx.mjs'
import * as cptable from 'https://deno.land/x/sheetjs@v0.18.3/dist/cpexcel.full.mjs'
xlsx.set_cptable(cptable)

export class Excel implements SourceInterface<ExcelRawItem> {

  #options: ExcelOptions
  public fetcher: FetcherInterface

  constructor (options: ExcelOptions) {
    this.#options = options
    
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

  get identifier () {
    return `excel:${this.#options.file}`
  }

  @cache
  async fetch (_query: AbstractQuery) {
    const data = await Deno.readFile(`./data/${this.#options.file}`)
    const workbook = xlsx.read(data)
    const sheetName = this.#options.sheet ?? workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const items: Array<ExcelRawItem> = xlsx.utils.sheet_to_json(sheet)
    return { items }
  }

  /**
   * A helper that maps the settings to the Excel sheet.
   */
  getColumn (columnGetters: Array<ColumnGetter>, row: ExcelRawItem) {
    return columnGetters.map(columnGetter => {
      const value = row[columnGetter.column]
      if (!value) return null
      const langCode = columnGetter.langCodeColumn ? row[columnGetter.langCodeColumn] : columnGetter.langCode ?? false
      if (langCode) return { '@value': value, '@language': langCode }  
      return value
    }).filter(Boolean)
  }

  /**
   * The transformation from an API specific item to a schema.org item.
   */
  normalize(item: ExcelRawItem): Thing {
    const urls = this.#options.mapping.url.map(columnGetter => item[columnGetter.column])
    return {
      '@id': urls[0],
      '@type': this.#options.types[0].split('/').pop(),
      name: this.getColumn(this.#options.mapping.name, item),
      description: this.getColumn(this.#options.mapping.description, item),
      url: urls,
      inLanguage: bcp47Normalize(item[this.#options.mapping.inLanguage.column]),  
    }
  }

  /**
   * Returns schema.org normalized types.
   */
  types () {
    return this.#options.types
  }
}