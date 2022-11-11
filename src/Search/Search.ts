import { tryToExtractLanguage } from '../Helpers/tryToExtractLanguage.ts'
import { baseUrl } from '../../.env.ts'
import { lastPart } from '../Helpers/lastPart.ts';
import JSONLD from 'npm:jsonld'
import { AbstractQuery } from '../types.ts'

/**
 * A route with a sync response. 
 * It searches through multiple APIs at once.
 * We try to spread out items from all the different APIs.
 */
export class Search {

  #query: AbstractQuery

  constructor (query: AbstractQuery) {
    this.#query = query
  }

  /**
   * The route handler. 
   * We create a fresh set of dataSources and then fetch results.
   */
  async handle () {

    console.log(this.#query)

    return {
    }
  }
  
}