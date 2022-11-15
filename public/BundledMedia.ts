import { stream } from 'https://esm.sh/ndjson-rxjs';
import { select } from './rxjs-form-elements/select.ts'
import { input } from './rxjs-form-elements/input.ts'
import { langcode } from './rxjs-form-elements/langcode.ts'
import { map, combineLatestWith, fromEvent, filter, from, tap, bufferCount, startWith, Observable, EMPTY } from 'https://esm.sh/rxjs@7.5.7'
import { html, render } from 'https://esm.sh/uhtml'

export type Filters = {
  fulltextSearch: string, 
  type: string, 
  category: string, 
  source: string, 
  bcp47: string
}

export type ApiResponse = {
  items: Array<any>, 
  nextUrl?: string, 
  pagination?: string, 
  lastIndex?: number,
  loading?: boolean
}

export class BundledMedia {

  #host: string
  data: Map<string | number, ApiResponse> = new Map()

  constructor (host: string) {
    this.#host = host    
  }

  filtersToUrl (filters: Filters) {
    const url = new URL(this.#host)

    for (const [key, value] of Object.entries(filters)) {
      if (value && ['string', 'number'].includes(typeof value)) {
        url.searchParams.set(key, value.toString())
      }      
  
      if (Array.isArray(value)) {
        url.searchParams.set(key, value.join(','))
      }
  }

    return url
  }

  stream (url: string): Observable<Array<any>> {
    return stream(url)
  }

  search (url: string) {
    if (this.data.has(url) && this.data.get(url)) {
      return from([this.data.get(url)!])
    }

    // Prepareation for POSTing the pagination instead of GETting.
    // We need this in the future so we are able to do 300 sources at once.
    return from(fetch(url, {
      method: 'POST',
    }).then(response => response.json())).pipe(
      tap((response: ApiResponse) => this.data.set(url, response))
    ).pipe(
      startWith({ items: [], loading: true })
    )
  }

  pagination (data: Map<string | number, Array<any>>, activeIndex: number) {
    const keys = [...data.keys()]

    const isValid = (page: number) => page > -1 && page <= max

    const button = (index: number, value: string | number, label: string) => {
      return isValid(index) ? html`
        <li class="page-item">
          <a class=${`page-link ${activeIndex === index ? 'active' : ''}`} 
            .value=${[index, value]} href="#">
            ${label}
          </a>
        </li>
      ` : null
    }

    const max = data.size - 1

    const buttons = new Set([
      0, 
      1, 
      2,
      activeIndex - 3,
      activeIndex - 2,
      activeIndex - 1,
      activeIndex,
      activeIndex + 1,
      activeIndex + 2,
      activeIndex + 3,
      max - 2,
      max - 1,
      max
    ].filter(isValid))


    const template = html`
      <ul class="d-flex pagination justify-content-start">
      ${button(0, keys[0], '«')}
      ${button(activeIndex - 1, keys[activeIndex - 1], '‹')}
      ${[...buttons.values()].map(index => button(index, keys[index], (index + 1).toString()))}
      ${button(activeIndex + 1, keys[activeIndex + 1], '›')}
      ${button(max, keys[max], '»')}
      </ul>
    `

    return template
  }

  paginationStream () {
    return fromEvent(document.body, 'click').pipe(
      filter((e: any) => e.target.closest('.pagination') && e.target.classList.contains('page-link')),
      tap((e: any) => e.preventDefault()),
      map((e: any) => e.target.value),
      startWith([0, location.toString()])
    )
  }

  /**
   * Generate filters and a combined stream to act on.
   */
  async filters () {
    const url = new URL(this.#host)

    const { element: searchFilter, stream: searchStream } = input(url.searchParams.get('fulltextSearch') ?? '')
    const { element: typesFilter, stream: typesStream } = await select('/types', url.searchParams.get('type') ?? '')
    const { element: categoriesFilter, stream: categoriesStream } = await select('/categories', url.searchParams.get('category') ?? '')
    const { element: sourcesFilter, stream: sourcesStream } = await select('/sources', url.searchParams.get('source') ?? '')
    const { element: langCodeFilter, stream: langCodeStream } = langcode(url.searchParams.get('bcp47') ?? '')

    const filtersStream = searchStream.pipe(combineLatestWith(
      typesStream,
      categoriesStream,
      sourcesStream,
      langCodeStream,
    )).pipe (
      map(([fulltextSearch, type, category, source, bcp47]) => ({ fulltextSearch, type, category, source, bcp47 })),
    )

    const template = html`
      <div class="col">
        <label class="form-label">Search</label>
        ${searchFilter}
      </div>

      <div class="col">
        <label class="form-label">Type</label>
        ${typesFilter}
      </div>

      <div class="col">
        <label class="form-label">Category</label>
        ${categoriesFilter}
      </div>

      <div class="col">
        <label class="form-label">Source</label>
        ${sourcesFilter}
      </div>

      <div class="col">
        <label class="form-label">Language</label>
        ${langCodeFilter}
      </div>
    `

    const element = document.createElement('div') as HTMLDivElement & { stream: Observable<Filters> }
    element.classList.add('input-group')
    element.classList.add('mb-3')
    element.classList.add('gap-2')
    element.stream = filtersStream
    render(element, template)

    return element
  }
}