import { render, html } from 'https://unpkg.com/uhtml?module'
import './init-bcp47-picker.js'

let nextUrl = ''
let searchResults = []
const prevUrls = new Map()
const url = new URL(location)
let types = {}

const fetchTypes = async () => {
  const response = await fetch(`/types`, { headers: { 'accept': 'application/json' }})
  const types = await response.json()
  return types
}

/**
 * The main fetch function
 * The cool thing is, this 'app' is a HyperMedia control, 
 * so the URL to fetch is the same URL as in the browser only with an additional header.
 */
const fetchData = async () => {
  if (!Object.keys(types).length) types = await fetchTypes()
  const url = new URL(location)
  const response = await fetch(url, { headers: { 'accept': 'application/json' }})
  const json = await response.json()
  searchResults = json.items ?? []

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
const setParameter = (key, value, clearPagination = false) => {
  const url = new URL(location)
  url.searchParams.set(key, value)
  if (clearPagination) {
    url.searchParams.delete('pagination')
  }

  if (!url.searchParams.get('text')) url.searchParams.delete('text')
  if (!url.searchParams.get('langCode')) url.searchParams.delete('langCode')
  if (!url.searchParams.get('types')) url.searchParams.delete('types')

  history.pushState({}, '', url)
  fetchData()
}

/**
 * The template function.
 * This uses uHTML.
 */
const draw = () => {
  render(document.querySelector('#app'), html`
    <div class="input-group mb-3">
      <input placeholder="Search for a title" class="form-control" value=${url.searchParams.get('text')} onchange=${(event) => {
        setParameter('text', event.target.value, true)
      }} type="search" />

      <select class="form-select type-dropdown" onchange=${event => {
        setParameter('types', event.target.value, true)
      }}>
        <option selected value="">- all types -</option>
        ${Object.values(types).map(type => html`<option ?selected=${(url.searchParams.get('types') ?? '').split(',').includes(type.uri)} value=${type.uri}>${type.label}</option>`)}
      </select>

      <bcp47-picker multiple value=${url.searchParams.get('langCode')} onchange=${event => {
        setParameter('langCode', event.target.value, true)
      }} />
    </div>

    <ul class="list-group mb-3">
      ${searchResults.map(item => html`<li class="list-group-item">
        <details>
          <summary>${item?.name}</summary>
          <pre>${JSON.stringify(item, null, 2)}</pre>
        </details>
      </li>`)}
    </ul>

    <div>
      <a class=${`btn btn-secondary ${!prevUrls.get(location.toString()) ? 'disabled' : ''}`} onclick=${event => {
        event.preventDefault()
        history.pushState({}, '', prevUrls.get(location.toString()))
        fetchData()
      }} href=${prevUrls.get(location.toString())}>< Previous</a>

      <a class=${`btn btn-secondary float-end ${!nextUrl ? 'disabled' : ''}`} onclick=${event => {
        event.preventDefault()
        history.pushState({}, '', nextUrl)
        fetchData()
      }} href=${nextUrl}>Next ></a>
    </div>
  `)
}

fetchData()
draw()
