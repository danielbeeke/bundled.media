import { BundledMedia, Filters } from './BundledMedia.ts'
import { switchMap, tap } from 'https://esm.sh/rxjs@7.5.7'
import { html, render } from 'https://esm.sh/uhtml'
import { card } from './card.ts'

const bundledMedia = new BundledMedia(location.toString())

const filters = await bundledMedia.filters()
const data: Map<number, Array<any>> = new Map()
let currentIndex = 0

const results = filters.stream.pipe(
  tap((filters: Filters) => {
    data.clear()
    const newUrl = new URL(location.toString().split('?')[0])
    for (const [key, value] of Object.entries(filters))
      value ? newUrl.searchParams.set(key, value.toString()) : newUrl.searchParams.delete(key)
    
    history.pushState(null, '', newUrl)
  }),
  switchMap(() => bundledMedia.stream(location.toString(), 20)),
  tap((chunk: Array<any>) => {
    data.set(data.size, chunk)
    if (data.size === 1) renderCards()
  })
)

const pagination = document.createElement('div')
const renderPagination = () => {
  render(pagination, bundledMedia.pagination(data, currentIndex))
}

results.subscribe(() => renderPagination())

const paginationStream = bundledMedia.paginationStream()

const cards = document.createElement('div')
const renderCards = () => {
  render(cards, html`
    <div class="cards mb-3">
      ${data.get(currentIndex)?.map(item => card(item))}
    </div>
  `)
}

paginationStream.subscribe(([index]: [number]) => {
  currentIndex = index
  renderCards()
  renderPagination()
})

render(document.querySelector('#app')!,  html`
  ${filters}
  ${cards}
  ${pagination}
`)
