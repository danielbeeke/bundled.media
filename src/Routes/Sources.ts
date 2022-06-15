import { BaseRoute } from './BaseRoute.ts'
import { dataSources as createDataSources } from '../../.env.ts'
import { BaseDataSource } from '../DataSources/BaseDataSource.ts'

export class SourcesRoute extends BaseRoute {

  static path = '/sources'

  static description = `A list of all enabled sources`

  async handle () {
    const sources = await createDataSources()

    return sources.map((source: BaseDataSource) => ({
      uri: source.identifier(),
      label: source.identifier(),
      types: source.types()
    }))
  }

  /**
   * The template for the HyperMedia response
   */
  async template (_variables: { [key: string]: any }): Promise<string> { 
    const sources = await this.handle()

    return `
      <ul class="list-group">
      ${sources.map((source) => `
        <li class="list-group-item">
          <strong>${source.uri}</strong><br>
          <ul>
            ${source.types.map(type => `
            <li><a href="${type}">${type}</a></li>
            `).join('')}
          </ul>
        </li>
      `).join('')}
      </ul>
    `
  }
}