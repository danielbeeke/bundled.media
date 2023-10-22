import { sourceOptions } from '../../types.ts'

export type ExcelRawItem = {
  [key: string]: string
}

export type ColumnGetter = {
  column?: string,
  value?: string,
  langCode?: string
  langCodeColumn?: string
}

export type ExcelOptions = sourceOptions & {
  mapping: {
    [key: string]: Array<ColumnGetter> | ColumnGetter
  },
  label: string,
  url: string,
  sheet?: string,
  file: string,
  types: Array<string>
}
