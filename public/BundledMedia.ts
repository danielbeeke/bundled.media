import { Observable, bufferCount } from 'https://esm.sh/rxjs@7.5.7'
import ndjsonStream from 'https://esm.sh/can-ndjson-stream'

export class BundledMedia {

  #host: URL

  constructor (host: URL) {
    this.#host = host    
  }

  async search (filters: {}) {
    const response = await fetch(this.#host)
    const stream = await ndjsonStream(response.body)
    const reader = stream.getReader()
    
    const observable = new Observable((subscriber) => {
      const processChunk = ({ value, done }: { value: any, done: boolean }) => {
        if (value) subscriber.next(value)
        if (done) subscriber.complete()
        else reader.read().then(processChunk)
      }
      
      reader.read().then(processChunk)
    })
    
    return observable.pipe(bufferCount(20))
  }
}