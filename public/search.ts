import { render, html } from 'https://unpkg.com/uhtml@3.0.1/esm/index.js?module'
import './json-viewer.ts'
import './init-bcp47-picker.ts'
import 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js';
import { JSONLD } from 'https://taisukef.github.io/jsonld-es/JSONLD.js'

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

let selectedCard: any = null

/**
 * The template function.
 * This uses uHTML.
 */
const draw = () => {
  render(document.querySelector('#app'), html`

<div class="modal fade" id="infoModal" tabindex="-1" aria-labelledby="infoModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      ${selectedCard ? html`
      <div class="modal-header">
        <h5 class="modal-title">${selectedCard.name}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <json-viewer data=${JSON.stringify(selectedCard)}></json-viewer>
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

    const mediaIcon = html`<div class="type-icon" ref=${async (element: HTMLDivElement) => {
      const response = await fetch(`/images/${type}.svg`)
      const svgData = await response.text()
      element.innerHTML = svgData
    }}></div>`

    const languageLabel = html`<span class="badge rounded-pill text-bg-light language-label">${item.inLanguage}</span>   `

    const imageFooter = html`${mediaIcon}${languageLabel}`

    return html`<div onclick=${async () => {
      selectedCard = await JSONLD.compact(item, {
        '@vocab': 'http://schema.org/',
        'schema': 'http://schema.org/'
      })
      draw()
    }} data-bs-toggle="modal" data-bs-target="#infoModal" 
      class=${`card ${type} ${!thumbnail && type === 'book' ? 'bible' : ''}`}>
      ${image ? html`
        <div class="image-wrapper">
          ${imageFooter}
          <img ref=${(element: HTMLImageElement) => {
            const url = image.includes('localhost') ? image : `//images.mediaworks.global/?url=${image}&h=200${type === 'videoobject' ? '' : ''}`
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
}

fetchData()
draw()
