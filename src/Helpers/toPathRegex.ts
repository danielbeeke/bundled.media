export const toPathRegex = (path: string) => {
  return path.split('/').map((part: string) => {
    if (part.substring(0, 2) === ':*') return `(?<${part.substring(2)}>[a-z0-9\/:.\_-]+)`
    else if (part[0] === ':') return `(?<${part.substring(1)}>[a-z0-9]+)`
    return part
  }).join('/') + '$'
}
