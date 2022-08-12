import { Thing } from '../../schema.org.ts';
import { BaseDataSourceOptions } from '../../Types/BaseDataSourceOptions.ts'

type VoiceOfTheMartyrsImage = { url: string, width: number, height: number }

export type VoiceOfTheMartyrsRawItem = {
  title: string,
  id: string,
  description: string,
  url: Array<string>,
  thumbnail: string,
  langCode: string
}

export type VoiceOfTheMartyrsOptions = BaseDataSourceOptions & {
}
