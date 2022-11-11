import { stream } from 'https://esm.sh/ndjson-rxjs';
import { select } from './rxjs-form-elements/select.ts'
import { input } from './rxjs-form-elements/input.ts'
import { langcode } from './rxjs-form-elements/langcode.ts'

import { combineLatest, switchMap, bufferCount, Observable } from 'https://esm.sh/rxjs@7.5.7'
import { html, render, Hole } from 'https://esm.sh/uhtml'

export type Filters = {
  search: string, 
  types: Array<string>, 
  categories: Array<string>, 
  sources: Array<string>, 
  langCodes: Array<string>
}

export class BundledMedia {

  #host: string

  constructor (host: string) {
    this.#host = host    
  }

  stream (filters: {}) {
    return stream(this.#host)
  }

  search (filters: {}) {

  }

  async filterUI (callback: (filters: Filters) => Promise<{ stream: Observable, filters: Hole }>) {
    const { element: searchFilter, stream: searchStream } = input()
    const { element: typesFilter, stream: typesStream } = await select('/types')
    const { element: categoriesFilter, stream: categoriesStream } = await select('/categories')
    const { element: sourcesFilter, stream: sourcesStream } = await select('/sources')
    const { element: langCodeFilter, stream: langCodeStream } = langcode()
    
    const results = combineLatest([
      searchStream,
      typesStream,
      categoriesStream,
      sourcesStream,
      langCodeStream
    ]).pipe(
      switchMap((
        [search, types, categories, sources, langCodes]: 
        [string, Array<string>, Array<string>, Array<string>, Array<string>]
      ) => {
        return callback({ search, types, categories, sources, langCodes })
      })
    )

    return {
      filters: html`
        <div class="col">
          <label class="form-label">Search</label>
          ${searchFilter}
        </div>

        <div class="col">
          <label class="form-label">Types</label>
          ${typesFilter}
        </div>

        <div class="col">
          <label class="form-label">Categories</label>
          ${categoriesFilter}
        </div>

        <div class="col">
          <label class="form-label">Sources</label>
          ${sourcesFilter}
        </div>

        <div class="col">
          <label class="form-label">Languages</label>
          ${langCodeFilter}
        </div>

      `,
      stream: results
    }
  }
}