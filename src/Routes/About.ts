import { BaseRoute } from './BaseRoute.ts'
import { Marked } from 'https://deno.land/x/markdown@v2.0.0/mod.ts'

export class AboutRoute extends BaseRoute {

  static path = '/about'

  static description = `Why bundled.media?`

  handle () {
    const markdown = Deno.readTextFileSync('./README.md')
    return Marked.parse(markdown)

  }

  /**
   * The template for the HyperMedia response
   */
  async template (_variables: { [key: string]: any }): Promise<string> { 
    const markup = await this.handle()

    return `
      <div style="max-width: 700px;">
        ${markup.content.replace('<p>See a demo at', '<p hidden>')}
      </div>
    `
  }
}