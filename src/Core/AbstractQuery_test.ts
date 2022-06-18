import { assertEquals } from 'https://deno.land/std@0.142.0/testing/asserts.ts';
import { AbstractQuery } from './AbstractQuery.ts'

Deno.test('AbstractQuery', () => {
  const url = new URL('https://example-api.org/search?lorem=a&text=lorem')
  const query = new AbstractQuery(url, '0-4')
  assertEquals(query.text, 'lorem')
})

Deno.test('AbstractQueryRange', () => {
  const url = new URL('https://example-api.org/search?lorem=a&text=lorem&range=0-4')
  const query = new AbstractQuery(url, '0-4')
  assertEquals(query.range, [0, 1, 2, 3, 4])
})

Deno.test('AbstractQueryRangeNotZero', () => {
  const url = new URL('https://example-api.org/search?lorem=a&text=lorem&range=6-10')
  const query = new AbstractQuery(url, '0-4')
  assertEquals(query.range, [6, 7, 8, 9, 10])
})

Deno.test('AbstractQueryRangeNotZero', () => {
  const url = new URL('https://example-api.org/search?lorem=a&text=lorem')
  const query = new AbstractQuery(url, '0-4')
  assertEquals(query.range, [0, 1, 2, 3, 4])
})
