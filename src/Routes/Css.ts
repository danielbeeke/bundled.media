import { BaseRoute } from './BaseRoute.ts'
import sass from 'https://deno.land/x/denosass@1.0.4/mod.ts'

export class CssRoute extends BaseRoute {

  static path = '/styles.css'
  static mime = 'text/css'

  handle (): string {
    const compile = sass('./scss/styles.scss')
    const output = compile.to_string()
    if (typeof output === 'string') return output
    else return ''
  }

}