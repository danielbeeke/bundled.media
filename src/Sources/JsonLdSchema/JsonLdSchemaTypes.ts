import { sourceOptions } from '../../types.ts'

export type JsonLdSchemaOptions = sourceOptions & {
  url: string,
  rdfClass: string,
}

export type JsonLdSchemaRawItem = any