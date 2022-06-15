type Image = {
  height: string,
  width: string,
  url: string
}

export type LightNetRawItem = {
  "language": string,
  "langCode": string,
  "id": string,
  "type": 'video' | 'ebook',
  "description": string,
  "authors": Array<string>,
  "category": Array<string>,
  "covers"?: Array<Image>
  "cover"?: Image,
  "keywords": Array<string>,
  "name": string,
  "originalTitle": string,
  "urls": Array<string>,
  "src": Array<string>,
}

export type LightNetOptions = {
  url: string,
  channel: string,
  limit: number,
  types: Array<'video' | 'ebook'>,
}

export const LightNetTypeMapping = {
  'video': 'VideoObject' as const,
  'ebook': 'Book' as const
}

export const LightNetSchemaTypeMapping: { [key: string]: string } = {
  'https://schema.org/VideoObject': 'video',
  'https://schema.org/Book': 'ebook'
}
