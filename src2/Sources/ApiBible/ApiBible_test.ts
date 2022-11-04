import { AbstractQuery } from '../../types.ts'
import { ApiBible } from './ApiBible.ts'
import './ApiBibleStubs.ts'
import { doMultipleRequests } from '../../Helpers/doMultipleRequests.ts'

const testSource = new ApiBible({ key: 'stubbed' })

Deno.test('Fetching data', async () => {
  const query: AbstractQuery = {
    limit: 20,
    fulltextSearch: 'Bible'
  }

  await doMultipleRequests(query, testSource.fetcher, 5, 5)
})