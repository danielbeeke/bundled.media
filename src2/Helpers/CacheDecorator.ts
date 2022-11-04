export function cache (_target: any, _methodName: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value
  const cache: Map<string, any> = new Map()

  descriptor.value = function (...args: Array<any>) {
    const key = JSON.stringify(args)
    if (!cache.has(key)) {
      const originalMethodResults = originalMethod.apply(this, args)
      cache.set(key, originalMethodResults)
    }

    return cache.get(key)
  }
}