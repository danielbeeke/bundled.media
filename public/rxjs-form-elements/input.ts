import { html, render } from 'https://esm.sh/uhtml@3.2.2'
import { fromEvent, map, startWith, debounceTime, filter } from 'https://esm.sh/rxjs@7.5.7'

export const input = (defaultValue: string) => {
  const wrapper = document.createElement('div')
  let element: HTMLInputElement | undefined = undefined

  const template = html`
  <input .value=${defaultValue} ref=${(e: HTMLInputElement) => element = e} placeholder="Search for a title" class="form-control" type="search" />
  `

  render(wrapper, template)

  const stream = fromEvent(element!, 'input').pipe(
    map((e: any) => e.target.value),
    debounceTime(1000),
    filter((search: string) =>  search.length === 0 || search.length > 3),
    startWith(defaultValue)
  )

  return { element, stream }
}