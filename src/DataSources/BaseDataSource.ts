import { AbstractQuery } from '../Core/AbstractQuery.ts'
import { Thing } from '../schema.org.ts';
import { Publisher } from '../Publishers/Publisher.ts'
import { BaseDataSourceOptions } from '../Types/BaseDataSourceOptions.ts'
import { Parser, Quad } from 'https://cdn.skypack.dev/n3'

export abstract class BaseDataSource<Options extends BaseDataSourceOptions = BaseDataSourceOptions, RawItem = any, NormalizedItem = Thing> {

  public paginationType = 'offset'

  public publisher: Publisher | undefined
  public label: string | undefined

  public booted = false
  public done = false
  public url: URL = new URL('https://example.com')
  public options: Options = {} as Options
  public tokens = new Map()
  public categoryMap: {
    [key: string]: Array<string>
  } = {}

  public nativelySupports = {
    text: false,
    langCode: false,
    types: false,
    multilingualItems: false
  }
  
  constructor (options: Options) {
    this.options = options
    this.publisher = options.publisher
    this.label = options.label

    /** @ts-ignore */
    if (options.augmentedCategoryFiles?.length) {
      this.indexCategories()
    }
  }

  async indexCategories () {
    /** @ts-ignore */
    const promises = this.options.augmentedCategoryFiles.map(async (file: string) => {
      const categories = await Deno.readTextFile(file)
      const parser = new Parser()
      return new Promise((resolve) => {
        parser.parse(categories, (error: Error, quad: Quad, prefixes: any) => {
          if (quad) {
            const uri = quad.subject.value
            const category = quad.object.value

            if (!this.categoryMap[uri]) this.categoryMap[uri] = []
            this.categoryMap[uri].push(category)
          }
          else {
            resolve(null)
          }
        })  
      })
    })

    await Promise.all(promises)
  }

  // TODO cache time to live.

  abstract normalize(item: RawItem): NormalizedItem

  abstract fetch(query: AbstractQuery, page: number, offset: number | string | undefined): Promise<Array<any>>

  abstract types(): Array<string>

  identifier () {
    return this.url.toString()
  }

  getLastToken () {
    return [...this.tokens.values()].pop()
  }

  boot () {
    this.booted = true
  }

  abstract resolveId (id: string): boolean | any
}