import { AbstractQuery } from '../Core/AbstractQuery.ts'

export abstract class BaseDataSource<RawItem, NormalizedItem> {

  public done = false

  abstract normalize(item: RawItem): NormalizedItem

  abstract fetch(query: AbstractQuery, page: number): Promise<Array<NormalizedItem>>

}