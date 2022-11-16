import { fetched } from './fetched.ts'

export const abortableFetched = () => {
  const controller = new AbortController()
  const signal = controller.signal

  controller.signal.addEventListener('abort', () => {
    console.log('aborted')
  })

  const augmentedFetched = (url: any, options?: RequestInit) => {
    if (!options) options = {}
    options.signal = signal
    return fetched(url, options)
  }

  return {
    fetched: augmentedFetched,
    abort: () => controller.abort()
  }
}