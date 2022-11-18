export type AbstractQuery = {
  fulltextSearch?: string
  bcp47?: string,
  type?: string
  source?: string
  category?: string
  limit: number
}

export type Thing = {
  [key: string]: any
}

export interface FetcherInterface {
  execute (fetched: typeof globalThis.fetch, query: AbstractQuery, pagination?: { [key: string]: any }): Promise<{
    items: Array<Thing>,
    done: boolean,
    pagination: any
  }> 
}

export type Paginations = {
  [key: string]:  { [key: string]: any }
}

export interface SourceInterface<RawItem> {
  options?: sourceOptions & any,
  whitelistedDomains?: Array<string>
  fetcher: FetcherInterface
  normalize? (item: RawItem): Thing
  identifier: string
  label: string
  types: () => Array<string>
}

export interface LocalMechanismsInterface {
  fulltextSearch?: boolean
  languageFilter?: boolean
  typeFilter?: boolean
}

export type FetcherResult<Pagination> = Promise<{
  items: Array<Thing>,
  done: boolean,
  pagination: Pagination
}>

export type sourceOptions = {
  augmentedDataFiles?: Array<string>
  langCode?: string | ((item: any) => string)
}