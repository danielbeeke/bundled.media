export type AbstractQuery = {
  fulltextSearch?: string
  bcp47?: string
  types?: Array<string>
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

export interface SourceInterface<RawItem> {
  whitelistedDomains?: Array<string>
  fetcher: FetcherInterface
  normalize? (item: RawItem): Thing
  identifier: string
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