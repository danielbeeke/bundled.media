import { assertEquals } from 'https://deno.land/std@0.161.0/testing/asserts.ts'
import { AbstractQuery } from '../../types.ts'
import { GsunGrab } from './GsunGrab.ts'
import { ensureNoDuplicates } from '../../Helpers/ensureNoDuplicates.ts'
import './GsunGrabStubs.ts'

const testSource = new GsunGrab()

Deno.test('Fetching data', async () => {
  const itemsPerRequest = 20

  const query: AbstractQuery = {
    limit: itemsPerRequest
  }

  const results1 = await testSource.fetcher.execute(query)
  assertEquals(results1.items.length, itemsPerRequest)
  assertEquals(results1.done, false)
  ensureNoDuplicates(results1.items)

  const results2 = await testSource.fetcher.execute(query, results1.pagination)
  assertEquals(results2.items.length, 3)
  assertEquals(results2.done, true)
  ensureNoDuplicates(results1.items, results2.items)
})