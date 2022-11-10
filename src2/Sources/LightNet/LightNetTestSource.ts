import { LightNet } from './LightNet.ts'
export const lightNetSource = new LightNet({ 
  url: 'https://data.mediaworks.global',
  channel: 'library',
  types: ['ebook', 'video'],
  limit: 40,
})
