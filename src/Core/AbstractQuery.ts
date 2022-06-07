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

}