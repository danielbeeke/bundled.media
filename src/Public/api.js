import { render, html } from 'https://unpkg.com/uhtml?module'

let searchResults = []

const draw = () => {
  render(document.body, html`
    <div class="container m-5">
    <h1>bundled.media</h1>

    <input onchange=${async (event) => {
      const url = new URL(location)
      url.searchParams.set('text', event.target.value)
      const response = await fetch(url, {
        headers: { 'accept': 'application/json' }
      })

      const json = await response.json()
      
      searchResults = json.items ?? []

      draw()
      history.pushState({}, '', url)
    }} type="search" />

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