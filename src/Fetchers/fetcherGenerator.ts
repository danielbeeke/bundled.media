import { AbstractQuery, SourceInterface } from '../types.ts'

const wait = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

export async function * fetcherGenerator (source: SourceInterface<any>, query: AbstractQuery, pagination: any, fetched: typeof fetch) {
  try {
    while (true) {
      const { items, done, pagination: newPagination } = await source.fetcher.execute(query, pagination)
      pagination = newPagination
      for (const item of items) {
        yield item
        await wait(0)
      }
      if (done) {
        yield { '@type': 'http://bundled.media/StreamStatus', done, source: source.identifier }
        console.log(`Done with ${source.identifier}`)
        break
      }
    }  
  }
  catch (exception) {
    console.log(exception)
  }

  return true
}