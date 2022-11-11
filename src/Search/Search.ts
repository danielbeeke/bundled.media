import { AbstractQuery } from '../types.ts'
import { sources } from '../../.env.ts';

/**
 * A route with a sync response. 
 * It searches through multiple APIs at once.
 * We try to spread out items from all the different APIs.
 */
export class Search {

  #query: AbstractQuery
  #chunkSize: number

  constructor (query: AbstractQuery, chunkSize: number) {
    this.#query = query
    this.#chunkSize = chunkSize
  }

  /**
   * The route handler. 
   * We create a fresh set of dataSources and then fetch results.
   */
  async handle () {

    console.log(sources)

    return {
    }
  }
  
}