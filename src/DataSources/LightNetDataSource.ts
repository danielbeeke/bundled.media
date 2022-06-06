import { BaseDataSource } from './BaseDataSource.ts'

export type LightNetRawItem = {
  "language": string,
  "langCode": string,
  "id": string,
  "type": string,
  "description": string,
  "authors": Array<string>,
  "category": Array<string>,
  "covers": Array<{
    height: string,
    width: string,
    url: string
  }>
  "keywords": Array<string>,
  "name": string,
  "originalTitle": string,
  "urls": Array<string>,
}

export type LightNetOptions = {
  url: string,
  channel: string,
  types: Array<'video' | 'ebook'>
}

export class LightNetDataSource extends BaseDataSource<LightNetRawItem, any> {

  #options: LightNetOptions

  constructor (options: LightNetOptions) {
    super()
    this.#options = options
  }

  done() {
    return false
  }

  normalize(item: LightNetRawItem) {
    console.log(item)
    return {}
  }

}