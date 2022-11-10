import { doMultipleRequests } from '../../Helpers/doMultipleRequests.ts'
import './LightNetStubs.ts'
import { lightNetSource } from './LightNetTestSource.ts'

Deno.test('Fetching data', async () => {
  await doMultipleRequests({ limit: 20 }, lightNetSource.fetcher, 6, 20)
  await doMultipleRequests({ limit: 20, fulltextSearch: 'Dorie' }, lightNetSource.fetcher, 1, 10)
})