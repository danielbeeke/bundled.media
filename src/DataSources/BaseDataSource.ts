import { AbstractQuery } from '../Core/AbstractQuery.ts'
import { Thing } from '../schema.org.ts';
import { Publisher } from '../Publishers/Publisher.ts'

export abstract class BaseDataSource<Options = any, RawItem = any, NormalizedItem = Thing> {

  public paginationType = 'offset'

  public publisher: Publisher | undefined
  public label: string | undefined

  public done = false
  public url: URL = new URL('https://example.com')
  public options: Options = {} as Options
  public tokens = new Map()

  public nativelySupports = {
    text: false,
    langCode: false,
    types: false
  }

  // TODO cache time to live.

  abstract normalize(item: RawItem): NormalizedItem

  abstract fetch(query: AbstractQuery, page: number, offset: number | string | undefined): Promise<Array<NormalizedItem>>

  abstract types(): Array<string>

  constructor (options: Options) {
    this.options = options
  }

  identifier () {
    return this.url.toString()
  }

  getLastToken () {
    return [...this.tokens.values()].pop()
  }

  boot () {}

  abstract resolveId (id: string): boolean | any
}