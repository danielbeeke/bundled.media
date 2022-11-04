import { AbstractQuery } from '../../types.ts'
import { LightNet } from './LightNet.ts'
import { doMultipleRequests } from '../../Helpers/doMultipleRequests.ts'

const testSource = new LightNet({ 
  url: 'https://data.mediaworks.global',
  channel: 'library',
  types: ['ebook', 'video'],
  limit: 40,
})

Deno.test('Fetching data', async () => {
  const itemsPerRequest = 20
  const query: AbstractQuery = { limit: itemsPerRequest }
  await doMultipleRequests(query, testSource.fetcher, 6, 20)
})