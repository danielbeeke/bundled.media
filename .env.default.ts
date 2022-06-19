import { LightNetDataSource } from './src/DataSources/LightNet/LightNetDataSource.ts'
import { ApiBibleDataSource } from './src/DataSources/ApiBible/ApiBibleDataSource.ts'
import { YouTubeDataSource } from './src/DataSources/YouTube/YouTubeDataSource.ts'
import { VimeoDataSource } from './src/DataSources/Vimeo/VimeoDataSource.ts'
import { MediaWorks } from './src/Publishers/MediaWorks.ts'
import { BibleProject } from './src/Publishers/BibleProject.ts'
import { CreateInternational } from './src/Publishers/CreateInternational.ts'
import { _37Stories } from './src/Publishers/37stories.ts'

const youtubeKey = ''
const vimeoClientId = ''
const vimeoClientSecret = ''
const apiBibleKey = ''

export const dataSources = () => [
  new LightNetDataSource({
    label: 'MediaWorks Library',
    url: 'https://data.mediaworks.global',
    channel: 'library',
    types: ['ebook', 'video'],
    limit: 40,
    publisher: MediaWorks
  }),
  new ApiBibleDataSource({
    key: apiBibleKey
  }),
  new YouTubeDataSource({
    label: 'BibleProject Dutch',
    channel: 'BibleProjectDutch',
    langCode: 'nl',
    key: youtubeKey,
    publisher: BibleProject
  }),
  new YouTubeDataSource({
    label: 'Create International',
    channel: 'CreateInternational',
    key: youtubeKey,
    publisher: CreateInternational
  }),
  new VimeoDataSource({
    label: '37 Stories',
    channel: '37stories',
    clientId: vimeoClientId,
    clientSecret: vimeoClientSecret,
    publisher: _37Stories
  }),
  new VimeoDataSource({
    langCode: 'en',
    label: 'BibleProject',
    channel: 'thebibleproject',
    clientId: vimeoClientId,
    clientSecret: vimeoClientSecret,
    publisher: BibleProject
  })
]

export const baseUrl = new URL('https://bundled.media')