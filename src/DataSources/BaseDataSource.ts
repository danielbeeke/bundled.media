import { AbstractQuery } from '../Core/AbstractQuery.ts'
import { Thing } from '../schema.org.ts';

export abstract class BaseDataSource<Options = any, RawItem = any, NormalizedItem = Thing> {

  public paginationType = 'offset'

  public done = false
  public url: URL = new URL('https://example.com')
  public options: Options = {} as Options
  public tokens = new Map()

  abstract normalize(item: RawItem): NormalizedItem

  abstract fetch(query: AbstractQuery, page: number, offset: number | string | undefined): Promise<Array<NormalizedItem>>

  abstract types(): Array<string>

  constructor (options: Options) {
    this.options = options
  }

  getLastToken () {
    return [...this.tokens.values()].pop()
  }

  boot () {}
}