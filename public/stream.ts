import { BundledMedia } from './BundledMedia.ts'
import type { Filters } from './BundledMedia.ts'
import { bufferCount, Observable } from 'https://esm.sh/rxjs@7.5.7'
import { html, render } from 'https://esm.sh/uhtml'
import { card } from './card.ts'
import { pagination } from './rxjs-form-elements/pagination.ts'
import { waitFor } from './misc/waitFor.ts'

const data: Array<Array<any>> = []

const bundledMedia = new BundledMedia(location.toString())

const { stream: results, filters } = await bundledMedia.filterUI((filters: Filters): Observable => {
  data.splice(0, data.length)
  return bundledMedia.stream(filters).pipe(bufferCount(12))
})

const { element: paginationButtons, stream: paginationStream } = pagination(data, results)

results.subscribe((newItems: Array<any>) => {
  data.push(newItems)
})

paginationStream
.pipe(waitFor(results))
.subscribe((currentPage: number) => {
  render(document.querySelector('#app')!, html`
    <div class="input-group mb-3">
      ${filters}
    </div>

    <div class="cards mb-3">
      ${data[currentPage]?.map(item => card(item))}
    </div>

    ${paginationButtons}
  `)
})