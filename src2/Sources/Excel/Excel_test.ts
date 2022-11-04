import { assertEquals } from 'https://deno.land/std@0.161.0/testing/asserts.ts'
import { AbstractQuery } from '../../types.ts'
import { Excel } from './Excel.ts'
import { ensureNoDuplicates } from '../../Helpers/ensureNoDuplicates.ts'

const testSource = new Excel({
  file: 'indigitube.xlsx',
  url: 'https://indigitube.com',
  sheet: 'App Information',
  mapping: {
    name: [
      { column: 'Indigenous Title', langCodeColumn: 'Ethno code' },
      { column: 'English Title', langCode: 'en'},
    ],
    description: [
      { column: 'Indigenous Title', langCodeColumn: 'Ethno code' },
      { column: 'English Title', langCode: 'en'},
    ],
    author: [ { column: 'Produced by' } ],
    url: [
      { column: 'Hyper-links for playable mp4 files' },
    ],
    inLanguage: { column: 'Ethno code' },
  },
  types: ['VideoObject']
})



Deno.test('Fetching data', async () => {
  const itemsPerRequest = 20

  const query: AbstractQuery = {
    limit: itemsPerRequest,
    fulltextSearch: 'Word'
  }

  const results1 = await testSource.fetcher.execute(query)
  assertEquals(results1.items.length, itemsPerRequest)
  assertEquals(results1.done, false)
  ensureNoDuplicates(results1.items)

  const results2 = await testSource.fetcher.execute(query, results1.pagination)
  assertEquals(results2.items.length, 4)
  assertEquals(results2.done, true)
  ensureNoDuplicates(results1.items, results2.items)
})