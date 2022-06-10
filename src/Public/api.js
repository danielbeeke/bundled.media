import { render, html } from 'https://unpkg.com/uhtml?module'
import { init } from 'https://unpkg.com/bcp47-picker@1.0.8/dist/init.modern.js';

init({
  get sources () {
    return (async () => {
      return { 
        lmt: await fetch('https://bcp47.danielbeeke.nl/data/lmt.json')
          .then(response => response.json())
          .then((json) => new Map(json)), 
        grn: await fetch('https://bcp47.danielbeeke.nl/data/grn.json')
          .then(response => response.json())
          .then((json) => new Map(json)), 
      }
    })()
  },
  theme: {
    valueInput: 'form-control',
    valueContainer: 'input-group',
    base: 'bootstrap',
    valueContainerAdvanced: 'form-floating mb-3',
    showPartsButton: 'btn btn-outline-secondary hidden',
    showSearchButton: 'btn btn-outline-secondary',
    backButton: 'btn btn-outline-secondary',
    results: 'list-group',
    resultItem: 'list-group-item list-group-item-action',
    code: 'badge rounded-pill bg-light text-dark',
    resultCount: 'input-group-text',
    collapseButton: 'btn btn-outline-secondary',
    expandButton: 'btn btn-outline-secondary',
    loading: 'loading',
    advanced: 'mt-4',
    advancedTitle: 'mb-2'
  }
})

let nextUrl = ''
let searchResults = []

const url = new URL(location)

const fetchData = async () => {
  const url = new URL(location)
  const response = await fetch(url, { headers: { 'accept': 'application/json' }})
  const json = await response.json()
  searchResults = json.items ?? []

  // TODO add previous URL inside the client inside a Map()
  if (json.nextUrl) nextUrl = json.nextUrl

  draw()
  history.pushState({}, '', url)
}

const setParam = (key, value) => {
  const url = new URL(location)
  url.searchParams.set(key, value)
  history.pushState({}, '', url)
  fetchData()
}

fetchData()

const draw = () => {
  render(document.body, html`
    <div class="container m-5">
    <h1>bundled.media</h1>

    <div class="input-group mb-3">

      <input class="form-control" value=${url.searchParams.get('text')} onchange=${(event) => {
        setParam('text', event.target.value)
      }} type="search" />
      <bcp47-picker multiple value=${url.searchParams.get('langCode')} onchange=${event => {
        setParam('langCode', event.target.value)
      }} />

    </div>
  
    <a onclick=${event => {
      event.preventDefault()
      history.pushState({}, '', nextUrl)
      fetchData()
    }} href=${nextUrl}>Next</a>

    <ul class="list-group">
      ${searchResults.map(item => html`<li class="list-group-item">
        <details>
          <summary>${item.name}</summary>
          <pre>${JSON.stringify(item, null, 2)}</pre>
        </details>
      </li>`)}
    </ul>
    </div>
  `)
}

draw()