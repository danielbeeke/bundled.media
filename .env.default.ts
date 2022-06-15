import { LightNetDataSource } from './src/DataSources/LightNet/LightNetDataSource.ts'
import { ApiBibleDataSource } from './src/DataSources/ApiBible/ApiBibleDataSource.ts'
import { YouTubeDataSource } from './src/DataSources/YouTube/YouTubeDataSource.ts'
import { tryToExtractLanguage } from './src/Helpers/tryToExtractLanguage.ts'

const youtubeKey = 'your-youtube-api-key'

export const dataSources = () => [
  new LightNetDataSource({
    url: 'https://data.mediaworks.global',
    channel: 'library',
    types: ['ebook', 'video'],
    limit: 40
  }),
  new ApiBibleDataSource({
    key: 'your-api.bible-key'
  }),
  new YouTubeDataSource({
    channel: 'BibleProjectDutch',
    langCode: 'nl',
    key: youtubeKey,
  }),
  new YouTubeDataSource({
    channel: 'CreateInternational',
    langCode: (item: any) => tryToExtractLanguage(item.name),
    key: youtubeKey,
  })
]
