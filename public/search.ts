import { render, html } from 'https://unpkg.com/uhtml@3.0.1/esm/index.js?module'
import './json-viewer.ts'
import './init-bcp47-picker.ts'
import 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js';
import { JSONLD } from 'https://taisukef.github.io/jsonld-es/JSONLD.js'
import { parse } from 'https://cdn.skypack.dev/bcp-47@2?dts'

let nextUrl = ''
let searchResults: Array<any> = []
const prevUrls = new Map()
const url = new URL(location.toString())
let types: {
  [key: string]: {
    uri: string,
    label: string
  }
} = {}
let sources: {
  [key: string]: {
    uri: string,
    label: string
  }
} = {}
let categories: Array<{
  uri: string,
  label: string,
  slug: string
}> = []

const defaultSize = 20
const sizes = [10, 20, 40, 80]

const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });
let isFetchingNext = true
let isFetchingPrevious = false

const fetchOptions = async (endpoint: string) => {
  const response = await fetch(`/${endpoint}`, { headers: { 'accept': 'application/json' }})
  return await response.json()
}

const fetchTypes = () => fetchOptions('types')
const fetchSources = () => fetchOptions('sources')
const fetchCategories = () => fetchOptions('categories')

const icons: Map<string, string | Promise<string>> = new Map()
const getIcon = (path: string) => {

  if (!icons.has(path)) {
    const promise = fetch(path).then(response => response.text()).then(svgData => {
      icons.set(path, svgData)
      return svgData
    })

    icons.set(path, promise)
  }

  return (element: HTMLElement) => {
    const icon = icons.get(path)
    if (icon instanceof Promise) {
      icon.then((resolvedIcon: string) => {
        element.innerHTML = resolvedIcon
      })
    }
    else if (typeof icon === 'string') {
      element.innerHTML = icon
    }
  }
}

/**
 * The main fetch function
 * The cool thing is, this 'app' is a HyperMedia control, 
 * so the URL to fetch is the same URL as in the browser only with an additional header.
 */
const fetchData = async () => {
  if (!Object.keys(types).length) types = await fetchTypes()
  if (!Object.keys(sources).length) sources = await fetchSources()
  if (!categories.length) categories = await fetchCategories()

  const url = new URL(location.toString())
  const response = await fetch(url, { headers: { 'accept': 'application/json' }})
  const json = await response.json()
  searchResults = json.items ?? []

  isFetchingPrevious = false
  isFetchingNext = false

  if (json.nextUrl)
    prevUrls.set(json.nextUrl, url.toString())
  
  nextUrl = json.nextUrl

  draw()
  if (location.toString() !== url.toString())
    history.pushState({}, '', url)
}

/**
 * Reloads the URL with an extra parameter.
 */
const setParameter = (key: string, value: string, clearPagination = false) => {
  const url = new URL(location.toString())
  url.searchParams.set(key, value)
  if (clearPagination) {
    url.searchParams.delete('pagination')
    url.searchParams.delete('lastIndex')
  }

  if (!url.searchParams.get('text')) url.searchParams.delete('text')
  if (!url.searchParams.get('langCode')) url.searchParams.delete('langCode')
  if (!url.searchParams.get('types')) url.searchParams.delete('types')
  if (!url.searchParams.get('sources')) url.searchParams.delete('sources')
  if (!url.searchParams.get('categories')) url.searchParams.delete('categories')

  history.pushState({}, '', url)
  isFetchingPrevious = true
  isFetchingNext = true
  draw()
  fetchData()
}

let selectedCardCompacted: any = null
let selectedCardExpanded: any = null
let bcp47Picker: any = null

/**
 * The template function.
 * This uses uHTML.
 */
const draw = () => {
  const url = new URL(location.toString())

  render(document.querySelector('#app'), html`

<div class="modal fade" id="infoModal" tabindex="-1" aria-labelledby="infoModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      ${selectedCardCompacted ? html`
      <div class="modal-header">
        <h5 class="modal-title">${selectedCardExpanded['http://schema.org/name'][0]['@value']}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <json-viewer data=${JSON.stringify(selectedCardCompacted)}></json-viewer>
      </div>
      ` : null}
    </div>
  </div>
</div>

<div class="top">

  <div class="input-group mb-3">
    <input placeholder="Search for a title" class="form-control" value=${url.searchParams.get('text')} onchange=${(event: InputEvent) => {
      setParameter('text', (event.target as HTMLInputElement).value, true)
    }} type="search" />

    <select class="form-select type-dropdown" onchange=${(event: InputEvent) => {
      setParameter('types', (event.target as HTMLInputElement).value, true)
    }}>
      <option selected value="">- all types -</option>
      ${Object.values(types).map(type => html`<option ?selected=${(url.searchParams.get('types') ?? '').split(',')
      .includes(type.uri)} value=${type.uri}>${type.label}</option>`)}
    </select>

    <select class="form-select type-dropdown" onchange=${(event: InputEvent) => {
      setParameter('categories', (event.target as HTMLInputElement).value, true)
    }}>
      <option selected value="">- all categories -</option>
      ${Object.values(categories).map(category => html`
        <option ?selected=${(url.searchParams.get('categories') ?? '').split(',').includes(category.slug)} value=${category.slug}>${category.label}</option>
      `)}
    </select>

    <select class="form-select type-dropdown" onchange=${(event: InputEvent) => {
      setParameter('sources', (event.target as HTMLInputElement).value, true)
    }}>
      <option selected value="">- all sources -</option>
      ${Object.values(sources).map(source => html`
        <option ?selected=${(url.searchParams.get('sources') ?? '').split(',').includes(source.uri)} value=${source.uri}>${source.label}</option>
      `)}
    </select>

    <select class="form-select type-dropdown" onchange=${(event: InputEvent) => {
      setParameter('size', (event.target as HTMLInputElement).value, true)
    }}>
      ${Object.values(sizes).map(size => html`
        <option ?selected=${parseInt(url.searchParams.get('size') ?? defaultSize.toString()) === size} value=${size}>${size}</option>
      `)}
    </select>

    <bcp47-picker multiple value=${url.searchParams.get('langCode')} onchange=${(event: InputEvent) => {
      setParameter('langCode', (event.target as HTMLInputElement).value, true)
    }} />
  </div>

  <div class="pagination mb-3">
    <a class=${`btn btn-secondary ${isFetchingPrevious || isFetchingNext ? 'disabled' : ''} 
        ${isFetchingPrevious ? 'is-fetching' : ''} ${!prevUrls.get(location.toString()) ? 'disabled' : ''}`} 
      onclick=${(event: InputEvent) => {
      event.preventDefault()
      history.pushState({}, '', prevUrls.get(location.toString()))
      isFetchingPrevious = true
      draw()
      fetchData()
    }} href=${prevUrls.get(location.toString())}>${isFetchingPrevious ? html`Fetching <img src="/images/spin.svg" />` : '< Previous'}</a>

    <button class="btn btn-secondary toggle-menu" onclick=${() => {
      document.body.classList.toggle('show-menu')
    }}>menu</button>

    <a class=${`btn btn-primary 
        ${isFetchingPrevious || isFetchingNext ? 'disabled' : ''} ${isFetchingNext ? 'is-fetching' : ''} float-end ${!nextUrl ? 'disabled' : ''}`} 
      onclick=${(event: InputEvent) => {
      event.preventDefault()
      history.pushState({}, '', nextUrl)
      isFetchingNext = true
      draw()
      fetchData()
    }} href=${nextUrl}>${isFetchingNext ? html`Fetching <img src="/images/spin.svg" />` : 'Next >'}</a>
  </div>

</div>

<div class="cards">
  ${searchResults.map(item => {
    const type: string = item['@type'][0].split(/\/|:|#/g).pop().toLowerCase()
    const urls = item['http://schema.org/url']?.map((item: any) => item?.['@value'])
    const names = item['http://schema.org/name']?.map((item: any) => item?.['@value'])
    const descriptions = item['http://schema.org/description']?.map((item: any) => item?.['@value']) ?? []
    const authors = item['http://schema.org/author']?.flatMap((item: any) => item['http://schema.org/name']?.map((item: any) => item?.['@value']))

    const thumbnail = item['http://schema.org/thumbnail']?.[0]?.['http://schema.org/url']?.[0]?.['@value']
    let image = thumbnail

    if (!image && type === 'book') {
      image = 'https://images.unsplash.com/photo-1499652848871-1527a310b13a'
    }

    let video = ''
    if (!image) {
      video = urls.find((url: string) => url.endsWith('.mp4'))
      image = `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}/thumb/${video}`
    }

    const mediaIcon = html`<div class="type-icon" ref=${getIcon(`/images/${type}.svg`)}></div>`

    const shouldShowMultiLingual = !url.searchParams.get('langCode') && item['http://bundled.media/multilingualItems']?.[0]?.['@value']

    const langCodes: Set<string> = new Set(item['http://schema.org/inLanguage']?.[0]?.['@value'].split('-x-mltlngl-'))
      
    const bcp47Picker = document.createElement('bcp47-picker')

    const languageLabels = [...langCodes].map((langCode: string) => { 
      const label = bcp47Picker.label(parse(langCode))
      return label ? label : langCode
    })
      .filter(Boolean)

    const languageLabel = html`
      <span class="badge rounded-pill text-bg-light language-label">
        ${shouldShowMultiLingual ? 
          html`<div class="icon"  data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="This item is available in a lot of languages. Please filter to a language to see if this item is available." ref=${getIcon(`/images/translate.svg`)}></div>` : 
          languageLabels.join(' & ')
        }
      </span>
    `

    const imageFooter = html`${mediaIcon}${languageLabel}`

    return html`<div onclick=${async () => {
      selectedCardCompacted = await JSONLD.compact(item, {
        '@vocab': 'http://schema.org/',
        'schema': 'http://schema.org/'
      })

      selectedCardExpanded = item
      draw()
    }} data-bs-toggle="modal" data-bs-target="#infoModal" 
      class=${`card ${type} ${!thumbnail && type === 'book' ? 'bible' : ''}`}>
      ${image ? html`
        <div class="image-wrapper">
          ${imageFooter}
          <img ref=${(element: HTMLImageElement) => {
            const url = ['localhost'].some(noImage => image.includes(noImage)) ? image : `//images.mediaworks.global/?url=${image}&h=200${type === 'videoobject' ? '' : ''}`
            element.classList.add('loading')

            element.src = ''
            requestAnimationFrame(() => {
              element.onload = () => {
                element.classList.remove('loading')
              }
              element.src = url
            })
          }} class=${`image loading`} alt=${item.name}>            
        </div>
      ` : null}

      ${!image && video ? html`
          <div class="image-wrapper">
          ${imageFooter}

            <video class="image">
              <source src=${`${video}#t=10`}>
            </video>
          </div>
      ` : null}
      <div class="card-body">
        <h5 class="card-title">${names[0]}</h5>
        ${authors?.length ? html`
          <small class="card-sub-title d-block mb-2">${formatter.format(authors.map((author: string) => author))}</small>            
        ` : null}
        <p class="card-text">${descriptions[0]}</p>
      </div>
    </div>`
  })}

  <div class="card empty"></div>
  <div class="card empty"></div>
  <div class="card empty"></div>
  <div class="card empty"></div>
  <div class="card empty"></div>
  <div class="card empty"></div>
  <div class="card empty"></div>
</div>

  `)

  const tooltipTriggerList: any = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

}

fetchData()
draw()
