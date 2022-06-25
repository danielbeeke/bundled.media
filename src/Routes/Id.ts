import { BaseRoute } from './BaseRoute.ts'
import { dataSources as createDataSources } from '../../.env.ts'
import { BaseDataSource } from '../DataSources/BaseDataSource.ts'

export class IdRoute extends BaseRoute {

  static path = '/id/:*id'

  static description = `Resolves an object by ID`
  #sources: Array<BaseDataSource> = []

  async handle () {
    this.#sources = createDataSources()
    let object

    for (const source of this.#sources) {
      if (object) continue
      const rawObject = await source.resolveId(this.params.id)
      if (rawObject) object = source.normalize(rawObject)
    }

    return object
  }

  /**
   * The template for the HyperMedia response
   */
   async template (_variables: { [key: string]: any }): Promise<string> { 
    const data = await this.handle()
    return `
    <pre>${JSON.stringify(data, null, 2)}</pre>
    `
  }
}