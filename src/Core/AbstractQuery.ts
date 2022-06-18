export class AbstractQuery extends EventTarget {

  #url: URL
  #params: URLSearchParams
  #defaultRange: `${number}-${number}`

  constructor (url: URL, defaultRange: `${number}-${number}`) {
    super()
    this.#url = url
    this.#params = url.searchParams
    this.#defaultRange = defaultRange

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

  get range () {
    const [start, end] = (this.#params.get('range') ?? this.#defaultRange).split('-').map(item => parseInt(item)) as [number, number]
    return [...Array(end + 1).keys()].slice(start)
  }
}