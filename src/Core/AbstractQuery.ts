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

  get pagenation (): Array<number | string> {
    return this.#params.get('pagination')?.split(',') ?? []
  }

  get types () {
    return this.#params.get('types')?.split(',') ?? []
  }
}