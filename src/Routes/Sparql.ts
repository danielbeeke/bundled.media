import { BaseRoute } from './BaseRoute.ts'
import { Store } from 'https://esm.sh/n3@1.16.2'
import { Parser as SparqlParser, Generator as SparqlGenerator } from 'https://esm.sh/sparqljs@3.5.2'
import { walker } from '../Helpers/walker.ts'
import { AbstractQuery } from '../Core/AbstractQuery.ts'
import { Search } from '../Search/Search.ts'

export class SparqlRoute extends BaseRoute {

  static path = '/sparql'

  static description = `A SPARQL endpoint, useful for queries on multiple sources at once.`

  public async handle() {
  }

  async execute (query: string) {
    const abstractQuery = this.parseQuery(query)
    const searcher = new Search(abstractQuery, '')
    const response = await searcher.handle()
    console.log(response)
  }

  parseQuery (query: string) {
    const parser = new SparqlParser()
    const parsedQuery = parser.parse(query)

    const filters: {[key: string]: string} = {}

    walker(parsedQuery, (key: string, value: any, _parent: any) => {
      if (value.predicate && value.predicate.value?.startsWith('https://bundled.media#')) {
        const filterName = value.predicate.value.split('#').pop()
        filters[filterName] = value.object.value
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
      requestConfig: { 
        endpoint: url.toString(),
      },
      copyEndpointOnNewTab: false,
    });
    </script>
  
    `
  }
}