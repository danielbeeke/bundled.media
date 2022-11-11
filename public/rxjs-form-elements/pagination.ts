import { html, render } from 'https://esm.sh/uhtml'
import { fromEvent, map, startWith, Observable, combineLatest } from 'https://esm.sh/rxjs@7.5.7'

export const pagination = (data: Array<Array<any>>, results: Observable) => {
  const element = document.createElement('div')
  element.classList.add('d-flex')

  const template = (currentPage: number) => {

    const max = data.length - 1
    
    const buttons = new Set([
      0,
      currentPage - 3,
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
      currentPage + 3,
      max
    ].filter(page => page > -1 && page <= max))

    const button = (index: number, title?: string | undefined) => {
      return index > -1 && index <= max ? html`
        <li class="page-item">
          <a class=${`page-link ${index === currentPage ? 'active' : ''}`} 
            data-index=${index} href="#">
            ${title ?? index + 1}
          </a>
        </li>
      ` : null
    }

    return html`
      <ul class="d-flex pagination">
        ${button(0, 'First')}
        ${button(currentPage - 1, 'Previous')}
        ${[...buttons].map(index => button(index))}
        ${button(currentPage + 1, 'Next')}
        ${button(max, 'Last')}
      </ul>
    `
  }

  const stream = fromEvent(element, 'click').pipe(
    map((e: any) => parseInt(e.target.dataset.index)),
    startWith(0)
  )

  combineLatest([
    results,
    stream
  ]).subscribe(([_newItems, currentPage]: [Array<any>, number]) => {
    render(element, template(currentPage))
  })
  
  return { element, stream }
}