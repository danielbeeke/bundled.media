import { assertEquals } from 'https://deno.land/std@0.161.0/testing/asserts.ts'

export const ensureNoDuplicates = (...items: Array<Array<any>>) => {
  const all = items.flatMap(nestedItems => nestedItems.map(item => item['@id']))
  const ids = new Set(all)
  assertEquals(all.length, ids.size)
}