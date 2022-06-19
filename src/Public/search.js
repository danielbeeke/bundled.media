import { render, html } from 'https://unpkg.com/uhtml?module'
import './init-bcp47-picker.js'

let nextUrl = ''
let searchResults = []
const prevUrls = new Map()
const url = new URL(location)
let types = {}
let sources = {}
const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

const fetchOptions = async (endpoint) => {
  const response = await fetch(`/${endpoint}`, { headers: { 'accept': 'application/json' }})
  return await response.json()
}

const fetchTypes = () => fetchOptions('types')
const fetchSources = () => fetchOptions('sources')

/**
 * The main fetch function
 * The cool thing is, this 'app' is a HyperMedia control, 
 * so the URL to fetch is the same URL as in the browser only with an additional header.
 */
const fetchData = async () => {
  if (!Object.keys(types).length) types = await fetchTypes()
  if (!Object.keys(sources).length) sources = await fetchSources()
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
    url.searchParams.delete('lastIndex')
  }

  if (!url.searchParams.get('text')) url.searchParams.delete('text')
  if (!url.searchParams.get('langCode')) url.searchParams.delete('langCode')
  if (!url.searchParams.get('types')) url.searchParams.delete('types')
  if (!url.searchParams.get('sources')) url.searchParams.delete('sources')

  history.pushState({}, '', url)
  fetchData()
}

let selectedCard = null

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
            <h5 class="modal-title" id="exampleModalLabel">${selectedCard.name}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <pre>${JSON.stringify(selectedCard, null, 2)}
            </pre>

            <a class="btn btn-primary" href=${selectedCard.url[0]} target="_blank">View</a>
          </div>
          ` : null}
        </div>
      </div>
    </div>

    <div class="top">

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

        <select class="form-select type-dropdown" onchange=${event => {
          setParameter('sources', event.target.value, true)
        }}>
          <option selected value="">- all sources -</option>
          ${Object.values(sources).map(source => html`<option ?selected=${(url.searchParams.get('sources') ?? '').split(',').includes(source.uri)} value=${source.uri}>${source.label}</option>`)}
        </select>

        <bcp47-picker multiple value=${url.searchParams.get('langCode')} onchange=${event => {
          setParameter('langCode', event.target.value, true)
        }} />
      </div>

      <div class="pagination mb-3">
        <a class=${`btn btn-secondary ${!prevUrls.get(location.toString()) ? 'disabled' : ''}`} onclick=${event => {
          event.preventDefault()
          history.pushState({}, '', prevUrls.get(location.toString()))
          fetchData()
        }} href=${prevUrls.get(location.toString())}>< Previous</a>

        <a class=${`btn btn-primary float-end ${!nextUrl ? 'disabled' : ''}`} onclick=${event => {
          event.preventDefault()
          history.pushState({}, '', nextUrl)
          fetchData()
        }} href=${nextUrl}>Next ></a>
      </div>

    </div>

    <div class="cards">
      ${searchResults.map(item => {
        let image = item.thumbnail?.url

        if (!image && item['@type'] === 'Book') {
          image = 'https://images.unsplash.com/photo-1499652848871-1527a310b13a'
        }

        return html`<div onclick=${() => {
          selectedCard = item
          draw()
        }} data-bs-toggle="modal" data-bs-target="#infoModal" class=${`card ${item['@type'].toLowerCase()} ${!item.thumbnail?.url  && item['@type'] === 'Book' ? 'bible' : ''}`}>
          ${image ? html`
            <div class="image-wrapper">
              <div class="type-icon" ref=${async (element) => {
                const response = await fetch(`/images/${item['@type'].toLowerCase()}.svg`)
                const svgData = await response.text()
                element.innerHTML = svgData
              }} src=${`/images/${item['@type'].toLowerCase()}.svg`}></div>
              <span class="badge rounded-pill text-bg-light language-label">${item.inLanguage}</span>   
              <img src=${`//images.weserv.nl/?url=${image}&h=200${item['@type'] === 'VideoObject' ? '' : ''}`} class="image" alt=${item.name}>            
            </div>
          ` : null}
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            ${item.author?.length ? html`
              <small class="card-sub-title d-block mb-2">${formatter.format(item.author.map(author => author.name))}</small>            
            ` : null}
            <p class="card-text">${item.description}</p>
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
