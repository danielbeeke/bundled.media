import { AbstractQuery } from '../../types.ts'
import { excelSource } from './ExcelTestSource.ts'
import { doMultipleRequests } from '../../Helpers/doMultipleRequests.ts'

Deno.test('Fetching data', async () => {
  const itemsPerRequest = 20

  const query: AbstractQuery = {
    limit: itemsPerRequest,
    fulltextSearch: 'Word'
  }

  await doMultipleRequests(query, excelSource.fetcher, 2, 4)
})