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

  if (query.bcp47 && languageFilter) {
    filteredItems = filteredItems.filter(item => 
      item['http://schema.org/inLanguage']?.some((value: any) => value['@value'].includes(query.bcp47))
    )
  }

  if (query.type) {
    filteredItems = filteredItems.filter(item => item['@type']?.includes(query.type))
  }


  if (query.category) {
    filteredItems = filteredItems.filter(item => 
      item['http://schema.org/genre']?.some((value: any) => value['@value'] === query.category) ||
      item['http://taxonomy.mediaworks.global/category']?.some((value: any) => value['@value'] === query.category)
    )
  }
  
  return filteredItems
}