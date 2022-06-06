export abstract class BaseDataSource<RawItem, NormalizedItem> {
  
  abstract done(): boolean

  abstract normalize(item: RawItem): NormalizedItem
}