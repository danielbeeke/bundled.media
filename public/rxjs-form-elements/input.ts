import { html, render } from 'https://esm.sh/uhtml'
import { fromEvent, map, startWith, debounceTime } from 'https://esm.sh/rxjs@7.5.7'

export const input = () => {
  const wrapper = document.createElement('div')
  let element: HTMLInputElement | undefined = undefined

  const template = html`
  <input ref=${(e: HTMLInputElement) => element = e} placeholder="Search for a title" class="form-control" type="search" />
  `

  render(wrapper, template)

  const stream = fromEvent(element!, 'input').pipe(
    map((e: any) => e.target.value),
    debounceTime(1000),
    startWith('')
  )
  
  return { element, stream }
}