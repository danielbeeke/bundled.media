export type LightNetRawItem = {
  "language": string,
  "langCode": string,
  "id": string,
  "type": 'video' | 'ebook',
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
  "src": Array<string>,
}

export type LightNetOptions = {
  url: string,
  channel: string,
  types: Array<'video' | 'ebook'>
}

export const LightNetTypeMapping = {
  'video': 'VideoObject' as const,
  'ebook': 'Book' as const
}
