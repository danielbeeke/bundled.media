import { BaseRoute } from './BaseRoute.ts'
import { Store } from "npm:n3"
import { Parser as SparqlParser } from 'https://esm.sh/sparqljs@3.5.2'
import { walker } from '../Helpers/walker.ts'
import { Search } from '../Search/Search.ts'
import JSONLD from 'npm:jsonld'
import { queryEngine } from '../Core/QueryEngine.ts'
import { streamToString } from '../Helpers/streamToString.ts'
import { AbstractQuery } from '../types.ts'

const filtersToUri = {
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': 'type',
  'http://bundled.media#text': 'fulltextSearch',
  'http://schema.org/inLanguage': 'bcp47',
  'http://taxonomy.mediaworks.global/category' : 'category',
} as const

export class SparqlRoute extends BaseRoute {

  static path = '/sparql'

  static description = `A SPARQL endpoint, useful for queries on multiple sources at once.`

  public async handle() {
    const formData = await this.request.formData()
    const query = formData.get('query')
    if (query) {
      return this.execute(query.toString())
    }
  }

  async execute (query: string) {
    const abstractQuery = this.parseQuery(query)
    const searcher = new Search(abstractQuery, 3)
    const { items } = await searcher.handle()
    const quads = await JSONLD.toRDF({
      '@graph': items,
      '@context': {
        '@vocab': 'http://schema.org/',
        'schema': 'http://schema.org/',
      }
    })

    const store = new Store()
    store.addQuads(quads)

    const cleanedQuery = this.cleanQuery(query)

    const response = await queryEngine.query(cleanedQuery, { sources: [store] })
    const { data } = await queryEngine.resultToString(response, 'application/sparql-results+json')
    const output = await streamToString(data)

    return JSON.parse(output)
  }

  /**
   * TODO For production things we might need a better clean up.
   */
  cleanQuery (query: string) {
    return query
      .split('\n')
      .filter(line => !line.includes('<http://bundled.media#text>'))
      .join('\n')
  }

  parseQuery (query: string): AbstractQuery {
    const parser = new SparqlParser()
    const parsedQuery = parser.parse(query)

    const filters: AbstractQuery = {
      limit: 100
    }

    walker(parsedQuery, (key: string, value: any, _parent: any) => {
      if (key === 'expression' && value.operator === 'langmatches') {
        if (value.args[1].value)
          filters.bcp47 = value.args[1].value
      }

      if (key === 'limit') {
        filters.limit = value
      }
      
      if (value.predicate && value.predicate.value in filtersToUri && value.object.termType === 'Literal') {
        const predicate = value.predicate.value as keyof typeof filtersToUri
        const filter = filtersToUri[predicate]
        filters[filter] = value.object.value
      }
    })

    return filters
  }

  /**
   * The template for the HyperMedia response
   */
  async template () {
    return await `
    <link href="https://unpkg.com/@triply/yasgui/build/yasgui.min.css" rel="stylesheet" type="text/css" />
    <script src="https://unpkg.com/@triply/yasgui/build/yasgui.min.js"></script>
    <style>.yasgui .autocompleteWrapper { display: none !important; } </style>
    <div id="yasgui"></div>
    <script>
      const url = new URL(location.toString())

      const yasgui = new Yasgui(document.getElementById("yasgui"), {
        requestConfig: { endpoint: url.toString() },
        copyEndpointOnNewTab: false,
      });
    </script>
  
    `
  }
}