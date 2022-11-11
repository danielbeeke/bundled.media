import { assertEquals } from 'https://deno.land/std@0.161.0/testing/asserts.ts'
import { AbstractQuery, FetcherInterface, Thing } from '../types.ts'
import { ensureNoDuplicates } from './ensureNoDuplicates.ts'

export const doMultipleRequests = async (query: AbstractQuery, fetcher: FetcherInterface, numberOfRequests: number, expectedResultsForLastRequest: number | undefined) => {
  if (expectedResultsForLastRequest === undefined) expectedResultsForLastRequest = query.limit

  const results: Array<{
    items: Thing[];
    done: boolean;
    pagination: any;
  }> = []

  for (let i = 1; i <= numberOfRequests; i++) {
    const previousRequest: {
        items: Thing[];
        done: boolean;
        pagination: any;
    } | undefined = results.at(-1)

    const expectedReturn = i === numberOfRequests ? expectedResultsForLastRequest : query.limit
    const currentResults = await fetcher.execute(query, previousRequest ? previousRequest.pagination : undefined)
    assertEquals(currentResults.items.length, expectedReturn)
    assertEquals(currentResults.done, expectedReturn !== query.limit)
    results.push(currentResults)
    ensureNoDuplicates(...results.map(result => result.items))
  }

  return results
}