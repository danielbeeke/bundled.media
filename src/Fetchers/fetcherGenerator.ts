import { AbstractQuery, SourceInterface } from '../types.ts'

const wait = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

export async function * fetcherGenerator (source: SourceInterface<any>, query: AbstractQuery, pagination: any) {
  try {
    while (true) {
      const { items, done, pagination: newPagination } = await source.fetcher.execute(query, pagination)
      pagination = newPagination
      if (!done) {
        console.log(pagination, source.identifier, items.length)
      }
      for (const item of items) {
        yield item
        await wait(10)
      }
      if (done) {
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