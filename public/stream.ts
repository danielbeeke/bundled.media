import { BundledMedia, Filters } from './BundledMedia.ts'
import { switchMap, tap, bufferWhen, interval, filter, bufferCount, fromEvent } from 'https://esm.sh/rxjs@7.5.7'
import { html, render } from 'https://esm.sh/uhtml'
import { card } from './card.ts'
import { getIcon } from './getIcon.ts'

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
      <div class="card empty"></div>
      <div class="card empty"></div>
      <div class="card empty"></div>
      <div class="card empty"></div>
      <div class="card empty"></div>
      <div class="card empty"></div>
      <div class="card empty"></div>
      <div class="card empty"></div>
      <div class="card empty"></div>
      <div class="card empty"></div>
      <div class="card empty"></div>
    </div>
  `)
}

let aborted = false
let abortMethod = () => {}

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
    abortMethod()

    const { abort, stream: results } = bundledMedia.stream(location.toString())
    abortMethod = abort
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
    ${bundledMedia.pagination(data, currentIndex, html`
      ${isLoading ? html`
      <div class="p-2">
        <div class="spinner-border spinner-border-sm" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <button onclick=${() => {
        aborted = true
        abortMethod()
        isLoading = false
        renderPagination()
      }} class="btn btn-secondary"><div ref=${getIcon(`/images/stop.svg`)}></div></button>
      ` : null}

      ${aborted ? html`
      <button onclick=${() => {
        window.dispatchEvent(new CustomEvent('restartStream'))
        aborted = false
      }} class="btn btn-secondary"><div ref=${getIcon(`/images/restart.svg`)}></div></button>
      ` : null}    
    `)}
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