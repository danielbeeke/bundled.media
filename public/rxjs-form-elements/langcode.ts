import { html, render } from 'https://esm.sh/uhtml'
import { fromEvent, map, startWith } from 'https://esm.sh/rxjs@7.5.7'
import '../misc/init-bcp47-picker.ts'

export const langcode = (defaultValue: string) => {
  const wrapper = document.createElement('div')
  let element: HTMLInputElement | undefined = undefined

  const template = html`
    <bcp47-picker value=${defaultValue ? defaultValue : null} ref=${(e: HTMLInputElement) => element = e} />
  `
  render(wrapper, template)

  const stream = fromEvent(element!, 'change').pipe(
    map((e: any) => e.target.value),
    startWith(defaultValue)
  )
  
  return { element, stream }
}