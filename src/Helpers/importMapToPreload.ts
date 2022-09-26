export const importMapToPreload = () => {
  const importMap: {
    imports: { [key: string]: string }
    scopes: { [key: string]: { [key: string]: string } }
  } = JSON.parse(Deno.readTextFileSync('./public/vendor/import_map.json'))
  
  const prefixes: { [key: string]: string } = {}
  
  for (const [href, alias] of Object.entries(importMap.imports)) {
    prefixes[alias] = href
  }
  
  const rawHrefs: Array<string> = [
    ...Object.values(importMap.imports)
  ]
  
  for (const [alias, children] of Object.entries(importMap.scopes)) {
    for (const child of Object.values(children)) {
      rawHrefs.push(child)
    }
  }
  
  
  const hrefs = []
  
  for (let alias of rawHrefs) {
    for (const [prefix, replacement] of Object.entries(prefixes)) {
      if (alias.includes(prefix)) {
        alias = alias.replace(prefix, replacement)
      }
    }
  
    if (alias.endsWith('.js') || alias.includes('?module'))
      hrefs.push(alias)
  }
  
  return hrefs
}