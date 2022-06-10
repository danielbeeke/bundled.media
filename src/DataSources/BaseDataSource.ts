import { AbstractQuery } from '../Core/AbstractQuery.ts'
import { Thing } from '../schema.org.ts';

export abstract class BaseDataSource<Options = any, RawItem = any, NormalizedItem = Thing> {

  public done = false

  public options: Options = {} as Options

  abstract normalize(item: RawItem): NormalizedItem

  abstract fetch(query: AbstractQuery, page: number, offset: number): Promise<Array<NormalizedItem>>

  constructor (options: Options) {
    this.options = options
  }
}