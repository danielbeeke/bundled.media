import { Publisher } from './Publisher.ts'

export const Unknown: Publisher = {
  '@type': 'Organization',
  name: 'Unknown',
  url: new URL('https://example.com')
}