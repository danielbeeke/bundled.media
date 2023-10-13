import { JsonLdSchemaOptions, JsonLdSchemaRawItem } from './JsonLdSchemaTypes.ts'
import { QueryEngine } from 'npm:@comunica/query-sparql-link-traversal'
import { FetcherInterface, SourceInterface, AbstractQuery } from '../../types.ts'
import { cache } from '../../Helpers/CacheDecorator.ts'
import { FetchAll } from "../../Fetchers/FetchAll.ts";
import JSONLD from 'npm:jsonld'
import datasetFactory from 'npm:@rdfjs/dataset'

export class JsonLdSchema implements SourceInterface<JsonLdSchemaRawItem> {

  public fetcher: FetcherInterface

  options: JsonLdSchemaOptions

  constructor (options: JsonLdSchemaOptions) {
    this.options = options
    this.fetcher = new FetchAll(this.fetch.bind(this), (a: JsonLdSchemaRawItem) => a, {
      fulltextSearch: true,
      languageFilter: true,
      typeFilter: true
    })
  }

  get label () {
    return this.options.label ?? ''
  }

  get identifier () {
    return `JsonLdSchema/${this.options.url.split('://').pop()}`
  }

  @cache
  async fetch (fetched: typeof globalThis.fetch, query: AbstractQuery) {
    const queryEngine = new QueryEngine()
    const response = await queryEngine.queryQuads(`
      PREFIX schema: <http://schema.org/>
      PREFIX sschema: <https://schema.org/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      CONSTRUCT {
        ?s schema:name ?name .
        ?s schema:image ?image .
        ?s schema:inLanguage ?language .
        ?s schema:url ?subject .
        ?s schema:description ?description .
        ?s a <${this.options.rdfClass}> .
      } WHERE { 
        {
          ?s a <${this.options.rdfClass}> .
          BIND( STR(?s) AS ?subject ).
          ?s rdfs:label|schema:name|sschema:name ?name .
          BIND( LANG(?name) AS ?language ).
          OPTIONAL { 
            ?s schema:image|sschema:image ?i .
            BIND( STR(?i) AS ?image ).
          }
          OPTIONAL { ?s rdfs:comment|schema:description|sschema:description ?description }
        }
      }
    `, {
        sources: [this.options.url],
        unionDefaultGraph: true,
        lenient: true,
        fetch: fetched
    })

    const quads = await response.toArray()
    const dedupedQuads = datasetFactory.dataset(quads)
    const items = await JSONLD.fromRDF([...dedupedQuads])
    return { items }
  }

  /**
   * Returns the given type.
   */
  types () {
    return [this.options.rdfClass]
  }
}