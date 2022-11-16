import { BaseRoute } from './BaseRoute.ts'
import { Search } from '../Search/Search.ts'
import { AbstractQuery, Paginations, SourceInterface } from '../types.ts'
import { sources } from '../../.env.ts'
import { filterSourcesStatically } from '../Helpers/filterSourcesStatically.ts'

const paginationTerms = {
  sliceOffset: 's',
  offset: 'o',
  page: 'p',
  token: 't',
  done: 'd'
}

const paginationTermsInverted = Object.fromEntries(Object.entries(paginationTerms).map(a => a.reverse()))

/**
 * A route with a sync response. 
 * It searches through multiple APIs at once.
 * We try to spread out items from all the different APIs.
 */
export class SearchRoute extends BaseRoute {

  static path = '/search'
  static description = `Search and filter through all the enabled sources in a synchronous way.`


  /**
   * The route handler. 
   * We create a fresh set of dataSources and then fetch results.
   */
  async handle () {
    const url = new URL(this.url)

    const query: AbstractQuery = {
      limit: url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : 20,
      fulltextSearch: url.searchParams.get('fulltextSearch') ?? undefined,
      bcp47: url.searchParams.get('bcp47') ?? undefined,
      category: url.searchParams.get('category') ?? undefined,
      type: url.searchParams.get('type') ?? undefined,
      source: url.searchParams.get('source') ?? undefined
    }

    const paginationRaw = url.searchParams.get('pagination')
    const filteredSources = filterSourcesStatically(sources, query)

    const previousPaginations = paginationRaw ? this.decompressPaginations(paginationRaw, filteredSources) : undefined
    const lastIndex = parseInt(url.searchParams.get('lastIndex') ?? '')

    const searcher = new Search(query, 3, previousPaginations, lastIndex)

    const { paginations, items, lastIndex: newLastIndex, done } = await searcher.handle()

    if (done) return { items }

    const paginationsCompressed = this.compressPaginations(paginations, filteredSources)

    const nextUrl = new URL(this.url)
    nextUrl.searchParams.set('pagination', paginationsCompressed)
    nextUrl.searchParams.set('lastIndex', newLastIndex.toString())

    return { 
      items, 
      nextUrl, 
      pagination: paginationsCompressed, 
      lastIndex: newLastIndex 
    }
  }

  /**
   * The paginations are quite verbose.
   * For the URL we need them to be smallest possible.
   */
  compressPaginations (paginations: Paginations, filteredSources: Array<SourceInterface<any>>) {
     return filteredSources.map(source => {
      if (!paginations[source.identifier]) return ''

      return Object.entries(paginations[source.identifier]).map(([key, value]: [string, string]) => {
        if (key === 'done') return paginationTerms.done
        if (value !== null) {
          return (paginationTerms[key as keyof typeof paginationTerms] ?? key) + value
        }
        else {
          return (paginationTerms[key as keyof typeof paginationTerms] ?? key) + 'n'
        }
      }).filter(Boolean).join('.')
    }).join('|')
  }

  /**
   * Parse the given paginations.
   */
  decompressPaginations (rawPaginations: string, filteredSources: Array<SourceInterface<any>>): Paginations {
    const paginations: Paginations = {}

    for (const [index, rawPagination] of rawPaginations.split('|').entries()) {
      const pagination: { [key: string]: any } = {}
      const identifier = filteredSources[index].identifier

      for (const part of rawPagination.split('.')) {
        const [letter, ...characters] = part
        let value: any = characters.join('')
        if (value === 'n') value = null
        const key = paginationTermsInverted[letter]

        if (key === 'done') {
          pagination.done = true
        }
        else if (key === 'token') {
          pagination[key] = value ? value : null
        }
        else if (key) {
          pagination[key] = parseInt(value)
        }
      }

      if (Object.keys(pagination).length) {
        paginations[identifier] = pagination
      }
    }

    return paginations
  }

  /**
   * The template for the HyperMedia response
   * We handle the HTML clientside.
   */
  async template (_variables: { [key: string]: string }){ 
    return await `
      <script src="/search.ts" type="module"></script>
    `
  }

}