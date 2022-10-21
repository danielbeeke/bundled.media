import { BaseDataSource } from '../BaseDataSource.ts'
import { AbstractQuery } from '../../Core/AbstractQuery.ts'
import { Thing } from '../../schema.org.ts';
import { ExcelOptions, ExcelRawItem, ColumnGetter } from './ExcelTypes.ts'
import { bcp47Normalize } from '../../Helpers/bcp47Normalize.ts'

import * as xlsx from 'https://deno.land/x/sheetjs@v0.18.3/xlsx.mjs'
import * as cptable from 'https://deno.land/x/sheetjs@v0.18.3/dist/cpexcel.full.mjs'
xlsx.set_cptable(cptable)

export class ExcelDataSource extends BaseDataSource<ExcelOptions, ExcelRawItem, Thing> {

  public nativelySupports = {
    text: false,
    langCode: false,
    types: false
  }

  public rows: Array<any>

  constructor (options: ExcelOptions) {
    super(options)

    this.url = new URL(options.url)
    this.rows = []
  }

  boot () {
    const data = Deno.readFileSync(`./data/${this.options.file}`)
    const workbook = xlsx.read(data)
    const sheetName = this.options.sheet ?? workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const rows: any = xlsx.utils.sheet_to_json(sheet)

    const normalized: Array<any> = []

    for (const row of rows) {
      const normalizedRow: any = {}

      normalizedRow.name = this.getColumn(this.options.mapping.name, row)

      normalizedRow.description = this.getColumn(this.options.mapping.description, row)

      normalizedRow.url = this.options.mapping.url.map(columnGetter => row[columnGetter.column])
      normalizedRow['@id'] = normalizedRow.url[0]

      normalizedRow.inLanguage = bcp47Normalize(row[this.options.mapping.inLanguage.column])
      normalizedRow['@type'] = this.options.types[0].split('/').pop()

      if (normalizedRow['@id'] && typeof normalizedRow['@id'] === 'string')
        normalized.push(normalizedRow)
    }

    this.rows = normalized
    this.booted = true
  }

  getColumn (columnGetters: Array<ColumnGetter>, row: any) {
    return columnGetters.map(columnGetter => {
      const value = row[columnGetter.column]
      if (!value) return null
      const langCode = columnGetter.langCodeColumn ? row[columnGetter.langCodeColumn] : columnGetter.langCode ?? false
      if (langCode) return { '@value': value, '@language': langCode }  
      return value
    }).filter(Boolean)
  }

  async fetch (query: AbstractQuery, page = 0, offset = 0) {
    const calculatedOffset = (page * query.size) + offset
    const slicedRows = await this.rows.slice(calculatedOffset, calculatedOffset + query.size)

    if (slicedRows.length < query.size) this.done = true

    return slicedRows
  }

  /**
   * The transformation from an API specific item to a schema.org item.
   */
  normalize(item: any) {
    return item
  }

  /**
   * Returns schema.org normalized types.
   */
  types () {
    return this.options.types
  }

  resolveId (id: string) {
    return false
  }
}