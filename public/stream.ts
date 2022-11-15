import { BundledMedia, Filters } from './BundledMedia.ts'
import { switchMap, tap, bufferWhen, interval, filter, bufferCount, Observable } from 'https://esm.sh/rxjs@7.5.7'
import { html, render } from 'https://esm.sh/uhtml'
import { card } from './card.ts'

const bundledMedia = new BundledMedia(location.toString())

const filters = await bundledMedia.filters()
const data: Map<number, Array<any>> = new Map()
let currentIndex = 0

const maxVertical = Math.floor(document.body.clientHeight / 370)
const limit = Math.floor(document.querySelector('#app')!.clientWidth / 230) * maxVertical

const statuses: Array<any> = []
let isLoading = true

const cards = document.createElement('div')
const renderCards = () => {
  render(cards, html`
    <div class="cards mb-3">
      ${data.get(currentIndex)?.map(item => card(item))}
    </div>
  `)
}

const results = filters.stream.pipe(
  tap((filters: Filters) => {
    isLoading = true
    data.clear()
    renderCards()
    currentIndex = 0
    const newUrl = new URL(location.toString().split('?')[0])
    for (const [key, value] of Object.entries(filters))
      value ? newUrl.searchParams.set(key, value.toString()) : newUrl.searchParams.delete(key)
    
    history.pushState(null, '', newUrl)
  }),
  switchMap(() => {
    const results = bundledMedia.stream(location.toString())
    statuses.splice(0, statuses.length)

    return results.pipe(
      tap((item: any) => {
        if (item['@type'] === 'http://bundled.media/StreamStatus') {
          statuses.push(item)

          const startStatus = statuses.find(status => status.sources)
          if (statuses.length === startStatus.sources.length + 1) {
            isLoading = false
            renderPagination()
          }
        }
      }),
      filter((item: any) => item['@type'] !== 'http://bundled.media/StreamStatus'),
      bufferCount(limit),
      bufferWhen(() => interval(data.size < 3 ? 100 : 2000))
    )
  }),
  tap((chunks: Array<Array<any>>) => {
    for (const chunk of chunks) {
      data.set(data.size, chunk)
      if (data.size === 1) renderCards()
    }
  })
)

const pagination = document.createElement('div')
const renderPagination = () => {
  render(pagination, html`
    ${bundledMedia.pagination(data, currentIndex)}
    ${isLoading ? html`
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    ` : null}
  `)
}

results.subscribe(() => renderPagination())

const paginationStream = bundledMedia.paginationStream()


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