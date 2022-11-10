import { bcp47Normalize as uncachedBcp47Normalize } from 'https://esm.sh/bcp-47-normalize@2.1.0'

const cache = new Map()
export const bcp47Normalize = (input: string) => {
  if (!cache.has(input))
    cache.set(input, uncachedBcp47Normalize(input))

  return cache.get(input)
}