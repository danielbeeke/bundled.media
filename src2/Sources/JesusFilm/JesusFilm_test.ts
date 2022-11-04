import { assertEquals } from 'https://deno.land/std@0.161.0/testing/asserts.ts'
import { AbstractQuery } from '../../types.ts'
import { JesusFilm } from './JesusFilm.ts'
import { ensureNoDuplicates } from '../../Helpers/ensureNoDuplicates.ts'
import './JesusFilmStubs.ts'

const testSource = new JesusFilm({ key: 'stubbed' })

Deno.test('Fetching data', async () => {
  const itemsPerRequest = 20

  const query: AbstractQuery = {
    limit: itemsPerRequest
  }

  const results1 = await testSource.fetcher.execute(query)
  assertEquals(results1.items.length, 7)
  assertEquals(results1.done, true)
  ensureNoDuplicates(results1.items)
})