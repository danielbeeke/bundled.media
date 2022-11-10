import { Excel } from './Excel.ts'

export const excelSource = new Excel({
  file: 'indigitube.xlsx',
  url: 'https://indigitube.com',
  sheet: 'App Information',
  mapping: {
    name: [
      { column: 'Indigenous Title', langCodeColumn: 'Ethno code' },
      { column: 'English Title', langCode: 'en'},
    ],
    description: [
      { column: 'Indigenous Title', langCodeColumn: 'Ethno code' },
      { column: 'English Title', langCode: 'en'},
    ],
    author: [ { column: 'Produced by' } ],
    url: [
      { column: 'Hyper-links for playable mp4 files' },
    ],
  
    inLanguage: { column: 'Ethno code' },
  },
  types: ['VideoObject']
})