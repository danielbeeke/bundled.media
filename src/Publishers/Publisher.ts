import { Organization } from '../schema.org.ts'

export type Publisher = Organization & {
  '@type': 'Organization',
  name: string,
  url: URL
}