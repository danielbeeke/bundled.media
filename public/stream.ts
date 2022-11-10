import { BundledMedia } from './BundledMedia.ts'
import { createSelectStream } from './createSelectStream.ts'
import { createInputStream } from './createInputStream.ts'
import { createLangCodeStream } from './createLangCodeStream.ts'
import { combineLatest, switchMap, bufferCount } from 'https://esm.sh/rxjs@7.5.7'
import { html, render } from 'https://esm.sh/uhtml'

const bundledMedia = new BundledMedia(location.toString())

const { element: searchFilter, stream: searchStream } = createInputStream()
const { element: typesFilter, stream: typesStream } = await createSelectStream('/types')
const { element: categoriesFilter, stream: categoriesStream } = await createSelectStream('/categories')
const { element: sourcesFilter, stream: sourcesStream } = await createSelectStream('/sources')
const { element: langCodeFilter, stream: langCodeStream } = createLangCodeStream()

let data: Array<any> = []

const results = combineLatest([
  searchStream,
  typesStream,
  categoriesStream,
  sourcesStream,
  langCodeStream
]).pipe(
  switchMap(([search, types, categories, sources, langCodes]: 
    [string, Array<string>, Array<string>, Array<string>, Array<string>]) => {
    data = []
    return bundledMedia.search({ search, types, categories, sources, langCodes })
  })
)

const template = () => html`
  ${searchFilter}
  ${typesFilter}
  ${categoriesFilter}
  ${sourcesFilter}
  ${langCodeFilter}

  ${data.map(item => html`
    <div>${item['http://schema.org/name'][0]['@value']}</div>
  `)}
`

results
.pipe(bufferCount(20))
.subscribe((newItems: Array<any>) => {
  data.push(...newItems)
  console.log('woop')
  render(document.querySelector('#app')!, template)
})

