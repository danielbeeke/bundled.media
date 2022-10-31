import { assertEquals } from 'https://deno.land/std@0.161.0/testing/asserts.ts'
import { AbstractQuery, Thing } from '../../types.ts'
import { ApiBible } from './ApiBible.ts'
import './ApiBibleStubs.ts'

const testSource = new ApiBible({ key: 'stubbed' })

const ensureNoDuplicates = (...items: Array<Array<Thing>>) => {
  const all = items.flatMap(nestedItems => nestedItems.map(item => item['@id']))
  const ids = new Set(all)
  assertEquals(all.length, ids.size)
}

Deno.test('Fetching data', async () => {
  const itemsPerRequest = 20

  const query: AbstractQuery = {
    limit: itemsPerRequest,
    fulltextSearch: 'Bible'
  }

  const results1 = await testSource.fetcher.execute(query)
  assertEquals(results1.items.length, itemsPerRequest)
  assertEquals(results1.done, false)
  ensureNoDuplicates(results1.items)

  const results2 = await testSource.fetcher.execute(query, results1.pagination)
  assertEquals(results2.items.length, itemsPerRequest)
  assertEquals(results2.done, false)
  ensureNoDuplicates(results1.items, results2.items)

  const results3 = await testSource.fetcher.execute(query, results2.pagination)
  assertEquals(results3.items.length, itemsPerRequest)
  assertEquals(results3.done, false)
  ensureNoDuplicates(results1.items, results2.items, results3.items)

  const results4 = await testSource.fetcher.execute(query, results3.pagination)
  assertEquals(results4.items.length, 20)
  assertEquals(results4.done, false)
  ensureNoDuplicates(results1.items, results2.items, results3.items, results4.items)

  const results5 = await testSource.fetcher.execute(query, results4.pagination)
  assertEquals(results5.items.length, 5)
  assertEquals(results5.done, true)
  ensureNoDuplicates(results1.items, results2.items, results3.items, results4.items, results5.items)
})