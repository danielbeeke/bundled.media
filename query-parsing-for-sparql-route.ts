import { Parser as SparqlParser } from 'https://esm.sh/sparqljs@3.5.2'
import { walker } from './src/Helpers/walker.ts'

const query = `
PREFIX schema: <http://schema.org/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT * WHERE {
  ?s schema:name ?name .
  ?s schema:description ?description .
  ?s schema:author ?author .
  ?author schema:name ?authorName .
  FILTER(contains(?name, "Luke") || contains(?description, "Luke"))
  FILTER(contains(?unfoldingWord, "unfolding"))
} 
LIMIT 100
`

const parser = new SparqlParser()
const parsedQuery = parser.parse(query) as any
const filters: any = {}

if (parsedQuery.limit) filters.limit = parsedQuery.limit

const predicatesToMatch = [
  'http://schema.org/name',
  'http://schema.org/description',
]

let mainSubject: string | undefined = undefined
const fulltextSearches: Set<string> = new Set()

// Grabs the first variable of the query
walker(parsedQuery.where, (key: string, value: any, _parent: any) => {
  if (!mainSubject && value.termType === 'Variable') {
    mainSubject = value.value
    return 'BREAK'
  }
})

const variables: any = {}

walker(parsedQuery.where, (key: string, value: any, _parent: any) => {
  if (value.type === 'bgp') {
    for (const triple of value.triples) {
      if (triple.object.termType === 'Variable') {
        const matched = triple.subject.value === mainSubject && predicatesToMatch.includes(triple.predicate.value)
        if (matched) {
          variables[triple.object.value] = triple.predicate.value
        }
      }
    }
  }
})

walker(parsedQuery.where, (key: string, value: any, _parent: any) => {
  if (value.type && value.type === 'operation' && value.operator === 'contains') {
    if (value.args[0].value in variables) {
      const predicate = variables[value.args[0].value]
      if (predicate) fulltextSearches.add(value.args[1].value)
    }
  }
})

console.log(fulltextSearches)

console.log('='.repeat(30))
// console.log(filters)
