import { Thing, AbstractQuery, LocalMechanismsInterface } from '../types.ts'

export const filterNormalizedItems = (query: AbstractQuery, items: Array<Thing>, localMechanisms: LocalMechanismsInterface) => {
  let filteredItems = items

  const { fulltextSearch, languageFilter } = localMechanisms

  if (query.fulltextSearch && fulltextSearch) {
    const search = query.fulltextSearch.toLocaleLowerCase()

    filteredItems = filteredItems.filter(item => 
      item['http://schema.org/name']?.some((value: any) => value['@value']?.toLocaleLowerCase().includes(search)) ||
      item['http://schema.org/description']?.some((value: any) => value['@value']?.toLocaleLowerCase().includes(search))
    )
  }

  return filteredItems
}