import { LightNetDataSource } from './src/DataSources/LightNet/LightNetDataSource.ts'
import { ApiBibleDataSource } from './src/DataSources/ApiBible/ApiBibleDataSource.ts'
import { YouTubeDataSource } from './src/DataSources/YouTube/YouTubeDataSource.ts'

const languageMapping: { [key: string]: string } = {
  'rajasthani': 'raj',
  'soninke': 'snk',
  'dungan': 'dgn'
}

const youtubeKey = 'your-key'

export const dataSources = [
  new LightNetDataSource({
    url: 'https://data.mediaworks.global',
    channel: 'library',
    types: ['ebook', 'video'],
    limit: 40
  }),
  new YouTubeDataSource({
    langCode: 'nl',
    key: youtubeKey,
    channel: 'UCGZPnVu9fDGY8I7NWN7gLXQ'
  }),
  new ApiBibleDataSource({
    key: 'your-bible-api-key'
  }),
  new YouTubeDataSource({
    langCode: (item: any) => {
      const parts = item.name.split(' ')
      let langCode = 'und'
      for (const part of parts) {
        if (part.toLowerCase() in languageMapping) {
          langCode = languageMapping[part.toLowerCase()]
          break
        }
      }

      return langCode
    },
    key: youtubeKey,
    channel: 'UCHOHz6sE4ljyb07Gn2oIOjQ'
  })
]