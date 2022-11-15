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
  execute (query: AbstractQuery, pagination?: { [key: string]: any }): Promise<{
    items: Array<Thing>,
    done: boolean,
    pagination: any
  }> 
}

export type Paginations = {
  [key: string]:  { [key: string]: any }
}

export interface SourceInterface<RawItem> {
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
}

export type FetcherResult<Pagination> = Promise<{
  items: Array<Thing>,
  done: boolean,
  pagination: Pagination
}>