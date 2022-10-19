import { Publisher } from '../../Publishers/Publisher.ts'
import { BaseDataSourceOptions } from '../../Types/BaseDataSourceOptions.ts'

export type ExcelRawItem = {

}

export type ColumnGetter = {
  column: string,
  langCode?: string
  langCodeColumn?: string
}

export type ExcelOptions = BaseDataSourceOptions & {
  mapping: {
    name: Array<ColumnGetter>,
    author: Array<ColumnGetter>,
    description: Array<ColumnGetter>,
    url: Array<ColumnGetter>,
    inLanguage: ColumnGetter,
  },
  url: string,
  sheet?: string,
  file: string,
  types: Array<string>
}
