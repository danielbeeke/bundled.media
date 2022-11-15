import { AbstractQuery, SourceInterface } from '../types.ts'

/**
* We need a deterministic process which will filter sources on static properties 
* that may or may not apply to the current query.
*/
export const filterSourcesStatically = (sources: Array<SourceInterface<any>>, query: AbstractQuery) => {
 return sources
 // Static filter on media types.
 .filter(source => !query.type || source.types().includes(query.type))
 // Source filter
 .filter(source => query.source ? `http://bundled.media/source/${source.identifier}` === query.source : true)
}