import { html, render } from 'https://esm.sh/uhtml'
import { fromEvent, map, startWith } from 'https://esm.sh/rxjs@7.5.7'

export const createSelectStream = async (url: string) => {
  const wrapper = document.createElement('div')
  
  const response = await fetch(url)
  const items: Array<{ uri: string, label: string }> = await response.json()
  let element: HTMLSelectElement | undefined = undefined

  const template = html`
    <select ref=${(e: HTMLSelectElement) => element = e} class="form-select type-dropdown">
      <option selected value="">- all -</option>
      ${Object.values(items).map(item => html`
        <option value=${item.uri}>${item.label}</option>
      `)}
    </select>
  `

  render(wrapper, template)

  const stream = fromEvent(element!, 'input').pipe(
    map((e: any) => e.target.checked),
    startWith('')
  )
  
  return { element, stream }
}