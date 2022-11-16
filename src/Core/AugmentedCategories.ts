import { SourceInterface } from '../types.ts'
import { Parser, Quad } from 'https://cdn.skypack.dev/n3'

class AugmentedCategoriesClass {

  public categoryMap: {
    [key: string]: Array<string>
  } = {}

  async index (sources: Array<SourceInterface<any>>) {
    const sourcesWithCategories = sources.filter(source => source.options?.augmentedCategoryFiles)
    const promises: Array<Promise<any>> = []
    for (const source of sourcesWithCategories) {
      const sourcePromises = source.options.augmentedCategoryFiles.map(async (file: string) => {
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

      promises.push(...sourcePromises)
    }

    await Promise.all(promises)
  }

  get (id: string) {
    if (this.categoryMap[id]) {
      return this.categoryMap[id]
    }

    const idSplit = id.split('/')
    idSplit.pop()
    const shortenedId = idSplit.join('/')
    if (this.categoryMap[shortenedId]) {
      return this.categoryMap[shortenedId]
    }
  }
}

export const AugmentedCategories = new AugmentedCategoriesClass()