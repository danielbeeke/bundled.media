import './ApiBibleStubs.ts'
import { doMultipleRequests } from '../../Helpers/doMultipleRequests.ts'
import { apiBibleSource } from './ApiBibleTestSource.ts'

Deno.test('Fetching data', async () => {
  await doMultipleRequests({ limit: 20, fulltextSearch: 'Bible' }, apiBibleSource.fetcher, 5, 5)
})