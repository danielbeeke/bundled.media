export type ExcelRawItem = {
  [key: string]: string
}

export type ColumnGetter = {
  column: string,
  langCode?: string
  langCodeColumn?: string
}

export type ExcelOptions = {
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
