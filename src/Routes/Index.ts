import { BaseRoute } from './BaseRoute.ts'
import routes from './routes.ts'
import { Marked } from 'https://deno.land/x/markdown@v2.0.0/mod.ts'

export class IndexRoute extends BaseRoute {

  static path = '/'

  static description = `A index containing all the routes this API offers`

  handle (): any {
    return routes
  }

  /**
   * The template for the HyperMedia response
   */
  async template (_variables: { [key: string]: any }): Promise<string> { 
    const markdown = Deno.readTextFileSync('./README.md')
    const markup = Marked.parse(markdown)

    return await `
      <div class="">
        <h2>API endpoints with visual controls</h2>
        <p>Every URL can be requested and returned as JSON. When you visit it in a browser it shows controls so you can play with it.</p>
        <p>For now the <strong>/search</strong> endpoint is the most interesting.</p>

        <ul class="list-group">
        ${routes.filter(route => route.description).map((route) => route.path !== '/' ? `
          <li class="list-group-item">
            <a href="${route.path}">${route.path}</a>
            <br>
            <small>${route.description}</small>
          </li>
        ` : '').join('')}
        </ul>

        <br><br>

        <div style="max-width: 900px">
        ${markup.content}
        </div>
      </div>
    `
  }
}