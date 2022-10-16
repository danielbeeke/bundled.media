export const walker = (obj: any, callback: (key: string, value: any, parent: any) => any) => {
  Object.keys(obj).forEach(key => {
    const returnValue = callback(key, obj[key], obj)

    if (returnValue) {
      obj[key] = returnValue
    }

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      walker(obj[key], callback)
    }
  })
}