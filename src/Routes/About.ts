import { BaseRoute } from './BaseRoute.ts'

export class AboutRoute extends BaseRoute {

  static path = '/about'

  static description = `Why bundled.media?`

  async handle (): Promise<any> {
    return await {
      'why': `The Christian media landscape has a lot of media to offer, but how to find specific media for your audience?`,
      'what': `bundled.media is a software product that ministries or software providers can install. 
      They can connect to multiple sources, a lot of them are free to use, some might require credentials to get access to.
      The bigger picture idea is to provide one piece of software that will be maintained by a working group of Christian media publishers.`,
      'developer': `Are you a software / web developer and interested in the project and product? Please get in touch: daniel.beeke@om.org`
    }
  }

  /**
   * The template for the HyperMedia response
   */
  async template (_variables: { [key: string]: any }): Promise<string> { 
    const { why, what, developer } = await this.handle()

    return await `
      <p>${why}</p>
      <p>${what.replace('\n', '<br>')}</p>
      <p>${developer}</p>
    `
  }
}