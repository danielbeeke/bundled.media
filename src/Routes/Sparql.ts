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
    const response = await queryEngine.query(query, { sources: [store] })
    const { data } = await queryEngine.resultToString(response, 'application/sparql-results+json')
    const output = await streamToString(data)

    return JSON.parse(output)
  }

  parseQuery (query: string): AbstractQuery {
    const parser = new SparqlParser()
    const parsedQuery = parser.parse(query) as any
    const filters: AbstractQuery = { limit: 1 }

    if (parsedQuery.limit) {
      filters.limit = parsedQuery.limit
    }

    const mainSubject = this.parseMainsubject(parsedQuery)
    if (!mainSubject) throw new Error('Missing subject')
    const variables = this.parseVariables(parsedQuery)
    const fulltextSearch = this.parseFulltextSearch(parsedQuery, mainSubject, variables)
    if (fulltextSearch) filters.fulltextSearch = fulltextSearch

    return filters
  }

  parseMainsubject (parsedQuery: any) {
    let mainSubject: string | undefined = undefined

    walker(parsedQuery.where, (_key: string, value: any, _parent: any) => {
      if (!mainSubject && value.termType === 'Variable') {
        mainSubject = value.value
        return 'BREAK'
      }
    })

    return mainSubject
  }

  parseVariables (parsedQuery: any) {
    const variables: any = {}
    
    walker(parsedQuery.where, (_key: string, value: any, _parent: any) => {
      if (value.type === 'bgp') {
        for (const triple of value.triples) {
          if (triple.object.termType === 'Variable') {
            if (!variables[triple.subject.value]) variables[triple.subject.value] = {}
            variables[triple.subject.value][triple.object.value] = triple.predicate.value
          }
        }
      }
    })

    return variables
  }

  parseFulltextSearch (parsedQuery: any, mainSubject: string, variables: any) {
    const predicatesToMatch = [
      'http://schema.org/name',
      'http://schema.org/description',
    ]
    
    const fulltextSearches: Set<string> = new Set()
    walker(parsedQuery.where, (_key: string, value: any, _parent: any) => {
      if (value.type && value.type === 'operation' && value.operator === 'contains') {
        if (value.args[0].value in variables[mainSubject]) {
          const predicate = variables[mainSubject][value.args[0].value]
          if (predicate && predicatesToMatch.includes(predicate)) fulltextSearches.add(value.args[1].value)
        }
      }
    })
    
    return [...fulltextSearches.values()].pop()
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