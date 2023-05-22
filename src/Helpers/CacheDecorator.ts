import { SourceInterface } from "../types.ts"

export function cache (_target: any, _methodName: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value
  const cache: Map<string, any> = new Map()

  descriptor.value = function (this: SourceInterface<any>, ...args: Array<any>) {

    console.log(this.identifier)

    const key = JSON.stringify({ args, id: this.identifier })
    if (!cache.has(key)) {
      const originalMethodResults = originalMethod.apply(this, args)
      cache.set(key, originalMethodResults)
    }

    return cache.get(key)
  }
}