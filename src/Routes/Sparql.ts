import { BaseRoute } from './BaseRoute.ts'
import { Store, Parser } from "npm:n3"
import { Parser as SparqlParser, Generator as SparqlGenerator } from 'https://esm.sh/sparqljs@3.5.2'
import { walker } from '../Helpers/walker.ts'
import { Search } from '../Search/Search.ts'
import JSONLD from 'npm:jsonld'
import { queryEngine } from '../Core/QueryEngine.ts'
import { streamToString } from '../Helpers/streamToString.ts'

const filtersToUri = {
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': 'types',
  'http://bundled.media#text': 'text',
  'http://schema.org/inLanguage': 'langCode',
  'http://taxonomy.mediaworks.global/category' : 'categories',
}

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
    const searcher = new Search(abstractQuery, 'http://localhost/')
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
    const response = await queryEngine.query(query, { sources: [store] })
    const { data } = await queryEngine.resultToString(response, 'application/sparql-results+json')
    const output = await streamToString(data)
    return JSON.parse(output)
  }

  parseQuery (query: string) {
    const parser = new SparqlParser()
    const parsedQuery = parser.parse(query)

    const filters: {[key: string]: string} = {}

    walker(parsedQuery, (key: string, value: any, _parent: any) => {
      if (key === 'expression' && value.operator === 'langmatches') {
        if (value.args[1].value)
          filters.langCode = value.args[1].value
      }

      if (key === 'limit') {
        filters.size = value
      }
      if (value.predicate && value.predicate.value in filtersToUri && value.object.termType === 'NamedNode') {
        filters[filtersToUri[value.predicate.value as keyof typeof filtersToUri]] = value.object.value
      }
    })

    const abstractQuery = new AbstractQuery(new URL('https://example.com'))
    for (const [key, value] of Object.entries(filters)) {
      abstractQuery.params.set(key, value)
    }

    return abstractQuery
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