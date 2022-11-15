import { BaseRoute } from './BaseRoute.ts'
import { sources } from '../../.env.ts'

export class SourcesRoute extends BaseRoute {

  static path = '/sources'

  static description = `A list of all enabled sources`

  handle () {
    return sources.map((source) => ({
      uri: `http://bundled.media/source/${source.identifier}`,
      label: source.label,
      types: source.types()
    }))
  }

  /**
   * The template for the HyperMedia response
   */
  async template (_variables: { [key: string]: any }): Promise<string> { 
    const sources = this.handle()

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