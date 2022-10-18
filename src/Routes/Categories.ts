import { BaseRoute } from './BaseRoute.ts'
import { queryEngine } from '../Core/QueryEngine.ts'
import { rdfToStore } from '../Helpers/rdfToStore.ts'
import { lastPart } from '../Helpers/lastPart.ts' 

export class CategoriesRoute extends BaseRoute {

  static path = '/categories'

  static description = `A list of categories`

  async handle () {
    const taxonomy = Deno.readTextFileSync('./data/taxonomy.ttl')
    const { store, prefixes } = await rdfToStore(taxonomy)

    const bindingStream = await queryEngine.queryBindings(`
      SELECT ?uri ?label {
        ?uri rdfs:label ?label
        FILTER langMatches( lang(?label), "EN" )
      }
    `, {
      sources: [ store ],
      prefixes
    })

    const bindings = await bindingStream.toArray()

    const output = []
    for (const binding of bindings) {
      const uri = binding.get('uri').value
      output.push({
        uri,
        label: binding.get('label').value,
        slug: 'http://taxonomy.mediaworks.global/' + lastPart(uri) // TODO cleanup, use a context to compact the URI.
      })
    }

    return output
  }

  /**
   * The template for the HyperMedia response
   */
  async template (_variables: { [key: string]: any }): Promise<string> { 
    const categories = await this.handle()

    return `
      <ul class="list-group">
      ${categories.map(({ uri, label }) => `
        <li class="list-group-item">
          <h3>${label}</h3>
          <strong>${uri}</strong><br>
        </li>
      `).join('')}
      </ul>
    `
  }
}