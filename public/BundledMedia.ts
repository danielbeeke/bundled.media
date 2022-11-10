import { Observable, bufferCount } from 'https://esm.sh/rxjs@7.5.7'
import { stream } from 'https://esm.sh/ndjson-rxjs';

export class BundledMedia {

  #host: string

  constructor (host: string) {
    this.#host = host    
  }

  search (filters: {}) {
    console.log(filters)
    return stream(this.#host)
  }
}