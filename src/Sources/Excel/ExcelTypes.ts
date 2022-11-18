import { sourceOptions } from '../../types.ts'

export type ExcelRawItem = {
  [key: string]: string
}

export type ColumnGetter = {
  column: string,
  langCode?: string
  langCodeColumn?: string
}

export type ExcelOptions = sourceOptions & {
  mapping: {
    name: Array<ColumnGetter>,
    author: Array<ColumnGetter>,
    description: Array<ColumnGetter>,
    url: Array<ColumnGetter>,
    inLanguage: ColumnGetter,
  },
  label: string,
  url: string,
  sheet?: string,
  file: string,
  types: Array<string>
}
