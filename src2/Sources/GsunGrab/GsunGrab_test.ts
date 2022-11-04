import { AbstractQuery } from '../../types.ts'
import { GsunGrab } from './GsunGrab.ts'
import { doMultipleRequests } from '../../Helpers/doMultipleRequests.ts'
import './GsunGrabStubs.ts'

const testSource = new GsunGrab()

Deno.test('Fetching data', async () => {
  const itemsPerRequest = 20

  const query: AbstractQuery = {
    limit: itemsPerRequest
  }

  await doMultipleRequests(query, testSource.fetcher, 2, 3)
})