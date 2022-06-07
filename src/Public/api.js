/**
 * TODO add bcp47-picker from npm.
 * bcp47-pciker needs to allow multiple and including a compiled version should be made possible.
 */

import { render, html } from 'https://unpkg.com/uhtml?module'

let searchResults = []
const url = new URL(location)

const fetchData = async (search) => {
  const url = new URL(location)
  url.searchParams.set('text', search)
  const response = await fetch(url, {
    headers: { 'accept': 'application/json' }
  })

  const json = await response.json()
  
  searchResults = json.items ?? []

  draw()
  history.pushState({}, '', url)
}

if (url.searchParams.get('text')) fetchData(url.searchParams.get('text'))

const draw = () => {
  render(document.body, html`
    <div class="container m-5">
    <h1>bundled.media</h1>

    <input class="mb-3" value=${url.searchParams.get('text')} onchange=${(event) => fetchData(event.target.value)} type="search" />

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