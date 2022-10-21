import { dataSources as createDataSources } from '../../.env.ts'
import { AbstractQuery } from '../Core/AbstractQuery.ts'
import { BaseDataSource } from '../DataSources/BaseDataSource.ts'
import { CreativeWork, Organization, WithContext } from '../schema.org.ts';
import { tryToExtractLanguage } from '../Helpers/tryToExtractLanguage.ts'
import { baseUrl } from '../../.env.ts'
import { lastPart } from '../Helpers/lastPart.ts';
import JSONLD from 'npm:jsonld'

type DataFetchObject = {
  page: number,
  promise: Promise<void>,
  filteredItems: Array<CreativeWork>,
}

/**
 * A route with a sync response. 
 * It searches through multiple APIs at once.
 * We try to spread out items from all the different APIs.
 */
export class Search {

  public max = 20
  public rangeSize = 3

  #fetches: Map<BaseDataSource, Array<DataFetchObject>> = new Map()
  #sources: Array<BaseDataSource> = []
  #query: AbstractQuery
  #counters: Map<BaseDataSource, number> = new Map()
  #lastIndex = 0
  #urlPrefix: string

  constructor (query: AbstractQuery, urlPrefix: string) {
    this.#query = query
    this.#urlPrefix = urlPrefix
  }

  /**
   * The route handler. 
   * We create a fresh set of dataSources and then fetch results.
   */
  async handle () {
    this.#sources = createDataSources()
    // For now categories only work if you have a file added in the .env via augmentedCategoryFiles
    .filter(source => !this.#query.categories.length || source.options.augmentedCategoryFiles?.length)
    // Static filter on media types.
    .filter(source => !this.#query.types.length || this.#query.types.some(type => source.types().includes(type)))
    // Source filter
    .filter(source => this.#query.sources.length ? this.#query.sources.includes(source.identifier()) : true)

    this.rangeSize = Math.min(this.#sources.length, 3) // Token based sources can only be used once per range.

    this.applyPreviousState(this.#query)

    await this.fetchDataForResponse()
    const items = this.aggregateFetchedResults()

    // Sorting
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
    items.sort((a: CreativeWork, b: CreativeWork) => collator.compare(a.name as string, b.name as string))

    return {
      fetches: [...this.#fetches.entries()].map(([dataSource, fetches]) => [dataSource.url, fetches.length]),
      items: items,
      nextUrl: this.createNextUrl(this.#urlPrefix)
    }
  }

  /**
   * If we are in a second page or further,
   * it might be that some sources are already done, save that into the current state.
   */
  applyPreviousState (query: AbstractQuery) {
    this.#lastIndex = this.#query.lastIndex;

    for (const [index, dataSource] of this.#sources.entries()) {
      if (query.pagenation[index] === 'd') dataSource.done = true
    }
  }

  /**
   * Fetch all needed data
   */
  async fetchDataForResponse () {
    while (this.#sources.some(dataSource => !dataSource.done) && this.getResultCount('all') < this.#query.size) {
      const finishedSourcesItemCount = this.getResultCount('done')
      // TODO average is probably to low. Investigate how to get a better number.
      const average = (this.#query.size - finishedSourcesItemCount) / this.#sources.filter(dataSource => !dataSource.done).length

      const promises = []

      // Run the amount of the range.
      for (let i = 0; i < this.rangeSize; i++) {
        const dataSource = this.#sources[this.#lastIndex]

        if (!dataSource.done && this.getResultCount('all', dataSource) < average) {
          if (!dataSource.booted) await dataSource.boot()
          promises.push(this.fetch(dataSource, this.#query, this.#query.pagenation[this.#lastIndex]))
        }

        this.#lastIndex = this.#lastIndex === this.#sources.length - 1 ? 0 : this.#lastIndex + 1;
      } 

      await Promise.all(promises)
    }
  }

  /**
   * Fetches data for one source.
   * Page sizes may differ.
   */
  fetch (dataSource: BaseDataSource, query: AbstractQuery, offset: undefined | string | number = undefined) {

    // Assign the right data type to the offset variable.
    if (['page', 'offset'].includes(dataSource.paginationType) && offset && typeof offset === 'string')  {
      offset = parseInt(offset)
    }

    const dataSourcefetches: Array<DataFetchObject> = this.#fetches.get(dataSource) ?? []
    const page = dataSourcefetches.length

    const dataSourceFetch: DataFetchObject = {
      page,
      filteredItems: [],
      promise: dataSource.fetch(query, page, offset).then(async (items: Array<any>) => {
        const normalizedItems = await Promise.all(items
          .map((item: any) => this.genericNormalizeItem(dataSource.normalize(item) as WithContext<CreativeWork>, dataSource)))

        dataSourceFetch.filteredItems = this.filter(dataSource, normalizedItems, query)
      })
    }

    dataSourcefetches.push(dataSourceFetch)
    this.#fetches.set(dataSource, dataSourcefetches)

    return dataSourceFetch.promise
  }

  /**
   * A generic normalization.
   */
  genericNormalizeItem (normalizedItem: WithContext<CreativeWork>, dataSource: BaseDataSource) {
    if (!normalizedItem.inLanguage) {
      if (typeof dataSource.options.langCode === 'string')
        normalizedItem.inLanguage = dataSource.options.langCode

      if (typeof dataSource.options.langCode === 'function')
        normalizedItem.inLanguage = dataSource.options.langCode(normalizedItem)

      if (!normalizedItem.inLanguage && typeof normalizedItem.name === 'string') {
        normalizedItem.inLanguage = tryToExtractLanguage(normalizedItem.name)
      }
    }

    normalizedItem.publisher = Object.assign({}, dataSource.publisher) as unknown as Organization
    /** @ts-ignore */
    if (normalizedItem.publisher.url) normalizedItem.publisher.url = normalizedItem.publisher.url.toString()
    /** @ts-ignore */
    normalizedItem['@context'] = {
      '@vocab': 'http://schema.org/',
      'schema': 'http://schema.org/',
      'cgt': 'http://taxonomy.mediaworks.global/'
    }

    if (!('http://taxonomy.mediaworks.global/category' in normalizedItem) && dataSource.categoryMap?.[normalizedItem['@id'] as string]) {
      /** @ts-ignore */
      normalizedItem['http://taxonomy.mediaworks.global/category'] = dataSource.categoryMap?.[normalizedItem['@id'] as string].map(item => ({ '@id': item}))
    }

    if (dataSource.nativelySupports.multilingualItems) {
      normalizedItem['http://bundled.media/multilingualItems'] = true
    }

    return JSONLD.expand(normalizedItem).then(graph => graph[0])
  }

  /**
   * This is the second filtering.
   * If the source support full text search / langCode filtering / or type selection we do not repeat that process.
   */
   filter (dataSource: BaseDataSource, normalizedItems: Array<CreativeWork>, query: AbstractQuery) {
    return normalizedItems
    .filter((item: CreativeWork) => query.langCode && !dataSource.nativelySupports.langCode ? 
      query.langCode.includes(item.inLanguage as string) : true)
    .filter((item: CreativeWork) => query.text && !dataSource.nativelySupports.text ? 
      (item.name as string)?.toLocaleLowerCase().includes(query.text) : true)
    .filter((item: CreativeWork) => query.types.length && !dataSource.nativelySupports.types ? 
      query.types.map(type => type.split('/').pop()).includes(item['@type']) : true)
    .filter((item: CreativeWork) => query.categories.length ? 
      /** @ts-ignore */
      item['http://taxonomy.mediaworks.global/category']?.some((category: string) => query.categories.includes('http://taxonomy.mediaworks.global/' + lastPart(category['@id']))) : true)
  }

  /**
   * This extracts all the filtered items from the seperate fetches and sources into one array.
   */
  getResultCount (type: 'all' | 'done' = 'all', filterSource: BaseDataSource | undefined = undefined) {
    return [...this.#fetches.entries()]
    .flatMap(([source, dataSourcefetches]) => 
      (filterSource && source === filterSource || !filterSource) &&
        (type === 'done' && source.done || type === 'all') ? 
          dataSourcefetches.flatMap(dataSourceFetch => dataSourceFetch.filteredItems) : []).length
  }

  /**
   * Grabs from each sources an item until we have enough.
   */
  aggregateFetchedResults () {
    const items: Array<CreativeWork> = []

    const correctMax = Math.min(this.#query.size, this.getResultCount())
    const mergedFilteredItems = new Map()

    for (const [dataSource, dataSourcefetches] of this.#fetches.entries())
      mergedFilteredItems.set(dataSource, dataSourcefetches.flatMap(dataSourcefetch => dataSourcefetch.filteredItems))

    while (items.length < correctMax) {
      for (const dataSource of this.#fetches.keys()) {
        let counter = this.#counters.get(dataSource) ?? 0
        const sourceMergedFilteredItems = mergedFilteredItems.get(dataSource)
        if (sourceMergedFilteredItems.length && sourceMergedFilteredItems[counter] && items.length < correctMax) {
          items.push(sourceMergedFilteredItems[counter])
          counter++
          this.#counters.set(dataSource, counter)  
        }
      }
    }

    return items
  }

  /**
   * Create the next URL.
   */
   createNextUrl (urlPrefix: string) {
    let nextUrl: false | URL = false
    
    if (this.#sources.some(dataSource => !dataSource.done)) {
      nextUrl = new URL(urlPrefix)
      nextUrl.hostname = baseUrl.hostname
      nextUrl.protocol = baseUrl.protocol
      nextUrl.host = baseUrl.host
      nextUrl.port = baseUrl.port

      const paginationString = this.#sources.map((dataSource, index) => {
        if (dataSource.done) return 'd'

        if (dataSource.paginationType === 'offset') {
          return (this.#counters.get(dataSource) ?? 0) + 
            (this.#query.pagenation[index] ? parseInt(this.#query.pagenation[index] + '') : 0 ?? 0)
        }

        if (dataSource.paginationType === 'page') {
          return (Math.max(this.#fetches.get(dataSource)?.length ?? 0, 0) ?? 0) + 
            (this.#query.pagenation[index] ? parseInt(this.#query.pagenation[index] + '') : 0 ?? 0)
        }

        if (dataSource.paginationType === 'token')
          return dataSource.getLastToken()

        throw new Error(`Pagination type: ${dataSource.paginationType} is not yet implemented`)
      }).join('|')
      nextUrl.searchParams.set('pagination', paginationString)  
      nextUrl.searchParams.set('lastIndex', this.#lastIndex.toString())
    }

    return nextUrl
  }
  
}