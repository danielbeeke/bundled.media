import { assertEquals } from 'https://deno.land/std@0.142.0/testing/asserts.ts';
import { AbstractQuery } from './AbstractQuery.ts'

Deno.test('AbstractQuery', () => {
  const url = new URL('https://example-api.org/search?lorem=a&text=lorem')
  const query = new AbstractQuery(url)
  assertEquals(query.text, 'lorem')
})