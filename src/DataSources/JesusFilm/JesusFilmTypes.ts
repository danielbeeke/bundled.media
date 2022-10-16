import { Publisher } from '../../Publishers/Publisher.ts'
import { BaseDataSourceOptions } from '../../Types/BaseDataSourceOptions.ts'

type Image = {
  height: string,
  width: string,
  url: string
}

export type JesusFilmRawItem = {
  mediaComponentId: string,
  componentType: string,
  subType: string,
  contentType: string,
  imageUrls: {
    thumbnail: string,
    videoStill: string,
    mobileCinematicHigh: string,
    mobileCinematicLow: string,
    mobileCinematicVeryLow: string
  },
  urls: Array<string>,
  streamingUrls: {
    m3u8: Array<{ url: string }>
  },
  id: string, // Added bu us.
  bcp47: string, // Added by us.
  lengthInMilliseconds: number,
  containsCount: number,
  isDownloadable: boolean,
  downloadSizes: Array<any>,
  bibleCitations: Array<any>,
  primaryLanguageId: number,
  title: string,
  shortDescription: string,
  longDescription: string,
  studyQuestions: Array<any>,
  metadataLanguageTag: string
}

export type JesusFilmOptions = BaseDataSourceOptions & {
  key: string,
}
