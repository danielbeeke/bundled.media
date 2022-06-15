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
    this.dispatchEvent(new CustomEvent('used-text'))
    return this.#params.get('text')?.toLocaleLowerCase()
  }

  get langCode () {
    this.dispatchEvent(new CustomEvent('used-langCode'))
    return this.#params.get('langCode')
  }

  get pagenation (): Array<number | string> {
    this.dispatchEvent(new CustomEvent('used-pagination'))
    return this.#params.get('pagination')?.split(',') ?? []
  }

  get types () {
    this.dispatchEvent(new CustomEvent('used-types'))
    return this.#params.get('types')?.split(',') ?? []
  }
}