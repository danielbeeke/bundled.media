import { Publisher } from '../Publishers/Publisher.ts'

export type BaseDataSourceOptions = {
  augmentedCategoryFiles?: Array<string>
  langCode?: string | Function
  publisher?: Publisher
  label?: string
}