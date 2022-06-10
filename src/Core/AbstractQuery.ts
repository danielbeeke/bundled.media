export class AbstractQuery {

  #url: URL
  #params: URLSearchParams

  constructor (url: URL) {
    this.#url = url
    this.#params = url.searchParams

    // TODO throw a fatal when the URL is invalid.
  }

  get text () {
    return this.#params.get('text')
  }

  get langCode () {
    return this.#params.get('langCode')
  }

  get pagenation () {
    return this.#params.get('pagination')?.split(',').map(item => parseInt(item)) ?? []
  }
}