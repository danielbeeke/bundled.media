import { SparqlRoute } from './Sparql.ts'
import { assertEquals, assertExists } from 'https://deno.land/std@0.152.0/testing/asserts.ts'
import { beforeAll, afterAll, it, describe } from 'https://deno.land/std@0.152.0/testing/bdd.ts'

const route = new SparqlRoute(new Request('https://example.com/test'), {})

const testQuery = `
  PREFIX bm: <https://bundled.media#>
  PREFIX schema: <https://schema.org/>
  PREFIX cgt: <http://taxonomy.mediaworks.global/>

  SELECT * WHERE {
    ?s bm:text "David" .
    ?s bm:types schema:Book .
    ?s bm:langCode "az" .
    ?s bm:categories cgt:biographies-and-memoirs .
  } LIMIT 10
`

describe('parse query', () => {
  it('parses the filters out of a SPARQL query', async () => {
    const results = await route.execute(testQuery)
    console.log(results)
    // assertEquals(quads.length, 14)
  })

})

