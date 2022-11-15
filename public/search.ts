import { BundledMedia } from './BundledMedia.ts'
import { switchMap, startWith, map, fromEvent, tap, filter, combineLatest } from 'https://esm.sh/rxjs@7.5.7'
import { html, render } from "https://esm.sh/uhtml@3.1.0"
import { card } from './card.ts'

const bundledMedia = new BundledMedia(location.toString())

const filters = await bundledMedia.filters()

const data: Map<string, Array<any>> = new Map()

let currentIndex = 0

const pagination = bundledMedia.paginationStream()

pagination.subscribe(([index, url]: [number, string]) => {
  currentIndex = index
  history.pushState(null, '', url)
})

const results = combineLatest([
  filters.stream,
  pagination
]).pipe(
  switchMap(() => bundledMedia.search(location.toString())),
  tap(({ items, nextUrl }: { items: Array<any>, nextUrl: string }) => {
    data.set(location.toString(), items)
    data.set(nextUrl, [])
    return items
  }),
  startWith({ items: [], nextUrl: '' })
)

results.subscribe(({ items }) => {
  render(document.querySelector('#app')!, html`
    ${filters}

    <div class="cards mb-3">
      ${items?.map(card)}
    </div>

    ${bundledMedia.pagination(data, currentIndex)}
`)
})
