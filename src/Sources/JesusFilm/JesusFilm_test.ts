import { AbstractQuery } from '../../types.ts'
import './JesusFilmStubs.ts'
import { doMultipleRequests } from '../../Helpers/doMultipleRequests.ts'
import { jesusFilmSource } from './JesusFilmTestSource.ts'

Deno.test('Fetching data', async () => {
  const itemsPerRequest = 20

  const query: AbstractQuery = {
    limit: itemsPerRequest
  }

  await doMultipleRequests(query, jesusFilmSource.fetcher, 1, 7)
})