import { BundledMedia } from './BundledMedia.ts'
import type { Filters } from './BundledMedia.ts'
import { bufferCount, switchMap, startWith } from 'https://esm.sh/rxjs@7.5.7'
import { html, render } from 'https://esm.sh/uhtml'
import { card } from './card.ts'

const bundledMedia = new BundledMedia(location.toString())

const { 
  stream: filtersStream, 
  element: filters 
} = await bundledMedia.filterUI()

const results = filtersStream.pipe(
  switchMap(() => bundledMedia.stream(location.toString())),
)

// results.subscribe(console.log)

console.log(bundledMedia)

// let currentPage = 0


// const renderCards = () => {
//   render(cards, html`
//     <div class="cards mb-3">
//       ${data[currentPage]?.map(item => card(item))}
//     </div>
//   `)
// }

// // paginationStream.subscribe((page: number) => {
// //   currentPage = page
// //   if (data.length > 0) renderCards()
// //   renderPagination()
// // })

// results.subscribe((newItems: Array<any>) => {
//   if (data.length === 1) renderCards()
//   data.push(newItems)
//   renderPagination()
// })
const cards = document.createElement('div')

results.subscribe((items) => {
  render(document.querySelector('#app')!, html`
  
  <div class="input-group mb-3">
    ${filters}
  </div>

  <div class="cards mb-3">
    ${cards}
  </div>

  ${bundledMedia.pagination()}
`)
})
