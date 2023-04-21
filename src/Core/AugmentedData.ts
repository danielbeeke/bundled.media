import { SourceInterface } from '../types.ts'
import { Parser, Store, Quad, NamedNode } from "npm:n3"

class AugmentedDataClass {

  public store: Store = new Store()

  async index (sources: Array<SourceInterface<any>>) {
    const sourcesWithAugmentationFiles = sources.filter(source => source.options?.augmentedDataFiles)
    const parser = new Parser()
    const promises: Array<Promise<any>> = []

    for (const source of sourcesWithAugmentationFiles) {
      const sourcePromises = source.options.augmentedDataFiles.map(async (file: string) => {
        const dataFile = await Deno.readTextFile(file)
        const quads = await parser.parse(dataFile)
        this.store.addQuads(quads)
      })

      promises.push(...sourcePromises)
    }

    await Promise.all(promises)
  }

  get (id: string) {
    // The extra ID is soley for the mediaWorks data where the last url part is the language 
    // and we have created the data language independant.
    // TODO make a formal way of doing this. This itself may be fine by source may need a way too hook into this.
    const idSplit = id.split('/')
    idSplit.pop()
    const shortenedId = idSplit.join('/')
    const ids = [id, shortenedId]

    const extraData: { [key: string]: any } = {}

    for (const id of ids) {
      const matchedQuads: Array<Quad> = this.store.getQuads(new NamedNode(id), null, null, null)

      if (matchedQuads.length) {
        for (const quad of matchedQuads) {
          extraData[quad.predicate.value] = quad.object.value
        }
      }
    }

    if (Object.keys(extraData).length) {
      return extraData
    }
  }
}

export const AugmentedData = new AugmentedDataClass()