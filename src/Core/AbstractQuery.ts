export class AbstractQuery extends EventTarget {

  #url: URL
  #params: URLSearchParams

  constructor (url: URL) {
    super()
    this.#url = url
    this.#params = url.searchParams

    // TODO throw a fatal when the URL is invalid.
  }

  get params () {
    return this.#params
  }

  get text (): string {
    return this.#params.get('text')?.toLocaleLowerCase() ?? ''
  }

  get langCode (): string {
    return this.#params.get('langCode') ?? ''
  }

  get pagenation (): Array<number | string> {
    return this.#params.get('pagination')?.split('|') ?? []
  }

  get categories (): Array<string> {
    return this.#params.get('categories')?.split('|') ?? []
  }

  get types (): Array<string> {
    return this.#params.get('types')?.split('|') ?? []
  }

  get size (): number {
    return this.#params.get('size') ? parseInt(this.#params.get('size')!) : 20
  }

  get sources (): Array<string> {
    return this.#params.get('sources')?.split('|') ?? []
  }

  get lastIndex (): number {
    return parseInt(this.#params.get('lastIndex') ?? '0')
  }
}