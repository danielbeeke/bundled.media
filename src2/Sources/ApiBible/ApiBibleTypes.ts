export type RawApiBibleItem = {
  id: string,
  dblId: string,
  relatedDbl: string,
  name: string,
  nameLocal: string,
  abbreviation: string,
  abbreviationLocal: string,
  description: string,
  descriptionLocal: string,
  language: {
    id: string,
    name: string,
    nameLocal: string,
    script: string,
    scriptDirection: string
  },
  countries: Array<any>,
  type: string,
  updatedAt: string,
  audioBibles: Array<any>
}

export type ApiBibleOptions = {
  key: string,
}
