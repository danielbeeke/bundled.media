export const walker = (obj: any, callback: (key: string, value: any, parent: any) => any) => {
  Object.keys(obj).every(key => {
    const returnValue = callback(key, obj[key], obj)

    if (returnValue === 'break') {
      return false
    }

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      walker(obj[key], callback)
    }

    return true
  })
}