import { LightNet } from './src/Sources/LightNet/LightNet.ts'
import { ApiBible } from './src/Sources/ApiBible/ApiBible.ts'
import { YouTube } from './src/Sources/YouTube/YouTube.ts'
import { Vimeo } from './src/Sources/Vimeo/Vimeo.ts'
import { VoiceOfTheMartyrs } from './src/Sources/VoiceOfTheMartyrs/VoiceOfTheMartyrs.ts'
import { JesusFilm } from './src/Sources/JesusFilm/JesusFilm.ts'
import { Excel } from './src/Sources/Excel/Excel.ts'
import { GsunGrab } from './src/Sources/GsunGrab/GsunGrab.ts'
import { PeerTube } from './src/Sources/PeerTube/PeerTube.ts'
import { FunkWhale } from './src/Sources/FunkWhale/FunkWhale.ts'
import { AngelStudios } from "./src/Sources/AngelStudios/AngelStudios.ts"
import { JsonLdSchema } from "./src/Sources/JsonLdSchema/JsonLdSchema.ts"

export const sources = [
  new LightNet({
    label: 'MediaWorks Library',
    url: 'https://data.mediaworks.global',
    channel: 'library',
    types: ['ebook', 'video'],
    limit: 40,
    augmentedDataFiles: ['./data/mediaworks.ttl']
  }),
  new VoiceOfTheMartyrs({}),
  new JesusFilm({
    key: ''
  }),
  new ApiBible({
    key: apiBibleKey
  }),
  new YouTube({
    channel: 'BibleProjectNederlands',
    langCode: 'nl',
    key: youtubeKey,
  }),
  new YouTube({
    channel: 'indigitous',
    // langCode: 'en',
    key: youtubeKey
  }),
  new Vimeo({
    channel: '37stories',
    clientId: vimeoClientId,
    clientSecret: vimeoClientSecret,
  }),
  new Vimeo({
    langCode: 'en',
    channel: 'thebibleproject',
    clientId: vimeoClientId,
    clientSecret: vimeoClientSecret,
  }),
  new Excel({
    label: '449 Bible Images',
    file: '449.xlsx',
    url: 'https://www.eem.org/envisioning-truth-499',
    mapping: {
      name: [
        { column: 'title', langCode: 'en'},
      ],
      description: [
        { column: 'text', langCode: 'en' },
      ],
      url: [
        { column: 'url' },
      ],
      thumbnail: [
        { column: 'url' },
      ],
      license: { value: 'CC-BY-NC' },
      inLanguage: { value: 'en' },
    },
    types: ['ImageObject']
  }), 
  new Vimeo({
    langCode: 'en',
    channel: 'biblica',
    clientId: vimeoClientId,
    clientSecret: vimeoClientSecret,
  }),
  new JsonLdSchema({
    label: 'Global Christian Taxonomy',
    url: 'https://taxonomy.mediaworks.global',
    rdfClass: 'https://taxonomy.mediaworks.global/Category'
  }),
  new YouTube({
    channel: 'ScriptureEarth',
    // langCode: 'en',
    key: youtubeKey
  }),
  new Excel({
    label: 'IndigiTube',
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
  }), 
  new GsunGrab({}),
  new PeerTube({
    label: 'Jesus of Nazareth 1977 TV Mini-Series',
    url: 'https://video.ploud.jp',
    playlist: 'd44d698f-2330-4d2c-8dac-bcb5af054512'
  }),
  new PeerTube({
    label: 'The Bible Series: Jesus the Christ 1950\'s TV Series',
    url: 'https://video.ploud.jp',
    playlist: '3c195348-8757-45b1-ac62-f4a806aab768'
  }),
  new PeerTube({
    label: 'Stories of Faith: The Life of Jesus 1950\'s TV Series',
    url: 'https://video.ploud.jp',
    playlist: '93a10db1-6c62-438e-846d-cd92dd26e4ba'
  }),
  new FunkWhale({
    label: 'Freie Kirchen Musik',
    url: 'https://evangelisches.online',
    channel: '4a1deaa1-c54a-4252-a0ae-7691ab269cec'
  }),
  new AngelStudios({
  }),
  new Vimeo({
    langCode: 'en',
    clientId: vimeoClientId,
    clientSecret: vimeoClientSecret,
    channel: 'scottishbiblesociety',
    label: 'Scottish Bible Society'
  }),
    new YouTube({
    label: 'Create International',
    channel: 'CreateInternational',
    key: youtubeKey,
  }),
]

export const baseUrl = new URL('http://localhost:8080')


