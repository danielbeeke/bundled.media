import { BaseRoute } from './BaseRoute.ts'
import { dataSources } from '../../.env.ts'

export class SearchRoute extends BaseRoute {

  static path = '/search'

  async handle () {
    for (const dataSource of dataSources) {
      console.log(dataSource)
    }
    
    return new Response('test')
  }

}