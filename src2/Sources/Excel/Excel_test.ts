import { AbstractQuery } from '../../types.ts'
import { Excel } from './Excel.ts'
import { doMultipleRequests } from '../../Helpers/doMultipleRequests.ts'

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

  await doMultipleRequests(query, testSource.fetcher, 2, 4)
})