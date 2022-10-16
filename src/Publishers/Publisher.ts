import { Organization } from '../schema.org.ts'

export type Publisher = any & {
  '@type': 'Organization',
  name: string,
  url: URL
}