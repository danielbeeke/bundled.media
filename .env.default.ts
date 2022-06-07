import { LightNetDataSource } from './src/DataSources/LightNet/LightNetDataSource.ts'

export const dataSources = [
  new LightNetDataSource({
    url: 'https://data.mediaworks.global',
    channel: 'library',
    types: ['ebook', 'video']
  })
]