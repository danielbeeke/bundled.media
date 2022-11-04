import { AbstractQuery } from '../../types.ts'
import { JesusFilm } from './JesusFilm.ts'
import './JesusFilmStubs.ts'
import { doMultipleRequests } from '../../Helpers/doMultipleRequests.ts'

const testSource = new JesusFilm({ key: 'stubbed' })

Deno.test('Fetching data', async () => {
  const itemsPerRequest = 20

  const query: AbstractQuery = {
    limit: itemsPerRequest
  }

  await doMultipleRequests(query, testSource.fetcher, 1, 7)
})