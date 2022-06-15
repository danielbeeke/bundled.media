import { LightNetDataSource } from './src/DataSources/LightNet/LightNetDataSource.ts'
import { ApiBibleDataSource } from './src/DataSources/ApiBible/ApiBibleDataSource.ts'
import { YouTubeDataSource } from './src/DataSources/YouTube/YouTubeDataSource.ts'
import { VimeoDataSource } from './src/DataSources/Vimeo/VimeoDataSource.ts'

const youtubeKey = 'your-youtube-api-key'
const vimeoClientId = 'vimeo-client-id'
const vimeoClientSecret = 'vimeo-client-secret'

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
    key: youtubeKey,
  }),
  new VimeoDataSource({
    channel: '37stories',
    clientId: vimeoClientId,
    clientSecret: vimeoClientSecret
  })
]
