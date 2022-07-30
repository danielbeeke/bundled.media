import { Parser, Quad, Store } from 'https://cdn.skypack.dev/n3'

export const rdfToStore = (text: string): Promise<{ store: Store, prefixes: any }> => {
  const parser = new Parser()
  const store = new Store()

  return new Promise((resolve, reject) => {
    parser.parse(text, (error: Error, quad: Quad, prefixes: any) => {
      if (error) reject(error)
      if (quad) store.addQuad(quad)
      else resolve({ store, prefixes })
    });  
  })
}
