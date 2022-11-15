import { html, render } from 'https://esm.sh/uhtml'
import { fromEvent, map, startWith } from 'https://esm.sh/rxjs@7.5.7'

type Items = Array<{ value?: string | number, uri?: string | number, label: string }>

export const select = async (input: string | Items, startWithValue: any = '') => {
  const wrapper = document.createElement('div')
  let items: Items
  if (typeof input === 'string') {
    const response = await fetch(input)
    items = Object.values(await response.json())
  }
  else {
    items = input
  }

  let element: HTMLSelectElement | undefined = undefined

  const template = html`
    <select ref=${(e: HTMLSelectElement) => element = e} class="form-select type-dropdown">
      ${html`<option selected value="">- all -</option>`}
      ${Object.values(items).map(item => html`
        <option selected=${startWithValue === item?.value ?? item?.uri ? true : null} value=${item?.value ?? item?.uri}>${item.label}</option>
      `)}
    </select>
  `

  render(wrapper, template)

  const stream = fromEvent(element!, 'input').pipe(
    map((e: any) => {
      const typeOfFirstItem = typeof startWithValue
      return typeOfFirstItem === 'number' ? parseInt(e.target.value) : e.target.value
    }),
    startWith(startWithValue)
  )
  
  return { element, stream }
}