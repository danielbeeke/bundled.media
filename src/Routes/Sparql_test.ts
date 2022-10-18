import { SparqlRoute } from './Sparql.ts'
import { assertEquals, assertExists } from 'https://deno.land/std@0.152.0/testing/asserts.ts'
import { beforeAll, afterAll, it, describe } from 'https://deno.land/std@0.152.0/testing/bdd.ts'

const route = new SparqlRoute(new Request('https://example.com/test'), {})

const testQuery = `
  PREFIX bm: <https://bundled.media#>
  PREFIX schema: <http://schema.org/>
  PREFIX http://taxonomy.mediaworks.global/ <http://taxonomy.mediaworks.global/>

  SELECT * WHERE {
    ?s bm:text "David" .
    ?s a schema:Book .
    FILTER(langMatches(?language, "az"))
    ?s bm:category http://taxonomy.mediaworks.global/biographies-and-memoirs .
  } LIMIT 10
`

describe('parse query', () => {
  it('parses the filters out of a SPARQL query', () => {
    const query = route.parseQuery(testQuery)
    assertEquals(query.types, [ "http://schema.org/Book" ])
    assertEquals(query.text, 'david')
    assertEquals(query.langCode, 'az')
    assertEquals(query.categories, ['http://taxonomy.mediaworks.global/biographies-and-memoirs'])
  })

})

