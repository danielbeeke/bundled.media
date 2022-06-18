export class AbstractQuery extends EventTarget {

  #url: URL
  #params: URLSearchParams

  constructor (url: URL) {
    super()
    this.#url = url
    this.#params = url.searchParams

    // TODO throw a fatal when the URL is invalid.
  }

  get text () {
    return this.#params.get('text')?.toLocaleLowerCase()
  }

  get langCode () {
    return this.#params.get('langCode')
  }

  get pagenation (): Array<number | string> {
    return this.#params.get('pagination')?.split('|') ?? []
  }

  get types () {
    return this.#params.get('types')?.split('|') ?? []
  }

  get sources () {
    return this.#params.get('sources')?.split('|') ?? []
  }

  get lastIndex () {
    return parseInt(this.#params.get('lastIndex') ?? '0')
  }
}