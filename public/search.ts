import { BundledMedia, ApiResponse, Filters } from './BundledMedia.ts'
import { fromEvent, startWith, map, exhaustMap, tap, filter, combineLatest } from 'https://esm.sh/rxjs@7.5.7'
import { html, render } from "https://esm.sh/uhtml@3.1.0"
import { card } from './card.ts'

const bundledMedia = new BundledMedia(location.toString())

const filters = await bundledMedia.filters()

const data: Map<string, Array<any>> = new Map()

let currentIndex = 0

const pagination = bundledMedia.paginationStream()

const originalPushState = history.pushState

history.pushState = (data: any, unused: string, url?: string | URL | null | undefined) => {
  const result = originalPushState.apply(history, [data, unused, url])
  globalThis.dispatchEvent(new CustomEvent('pushState'))
  return result
}

globalThis.addEventListener('popstate', () => {
  globalThis.dispatchEvent(new CustomEvent('pushState'))
})

pagination.subscribe(([index, url]: [number, string]) => {
  currentIndex = index
  history.pushState(null, '', url)
})

filters.stream.subscribe((filters: Filters) => {
  data.clear()
  currentIndex = 0
  const newUrl = new URL(location.toString().split('?')[0])
  for (const [key, value] of Object.entries(filters))
    value ? newUrl.searchParams.set(key, value.toString()) : newUrl.searchParams.delete(key)
  history.pushState(null, '', newUrl)
})

const results = fromEvent(window, 'pushState').pipe(
  map(() => location.toString()),
  startWith(location.toString()),
  exhaustMap(() => bundledMedia.search(location.toString())),
  tap((response: ApiResponse) => {
    const { items, nextUrl } = response
    data.set(location.toString(), items)
    if (nextUrl) data.set(nextUrl, [])
  }),
  startWith({ items: [], loading: true })
)

results.subscribe(({ items, loading }) => {
  render(document.querySelector('#app')!, html`
    ${filters}

    <div class="cards mb-3">
      ${loading ? html`
        <span>Loading</span>
      ` : html`
        ${items?.map(card)}
      `}
    </div>

    ${bundledMedia.pagination(data, currentIndex)}
`)
})
