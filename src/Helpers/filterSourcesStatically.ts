import { AbstractQuery, SourceInterface } from '../types.ts'

/**
* We need a deterministic process which will filter sources on static properties 
* that may or may not apply to the current query.
*/
export const filterSourcesStatically = (sources: Array<SourceInterface<any>>, query: AbstractQuery) => {
 return sources
 // Static filter on media types.
 .filter(source => !query.types?.length || query.types.some(type => source.types().includes(type)))
 // Source filter
 .filter(source => query.sources?.length ? query.sources.includes(source.identifier) : true)
}