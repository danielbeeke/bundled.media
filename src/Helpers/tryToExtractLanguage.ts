import { iso6393 } from 'https://esm.sh/iso-639-3@3'
import { bcp47Normalize } from './bcp47Normalize.ts'

const languageNames: { [key: string]: string } = {}
for (const language of iso6393) {
  for (const name of language.name.toLowerCase().replace(' Sign Language', '').split(' ')) {
    languageNames[name] = language.iso6391 ?? language.iso6392T ?? language.iso6393
  }
}

export const tryToExtractLanguage = (text: string) => {
  const parts = text.split(' - ').pop()!.split(' ')
  let langCode = 'und'
  for (const part of parts) {
    if (langCode === 'und' && languageNames[part.toLowerCase()]) {
      langCode = languageNames[part.toLowerCase()]
    }
  }

  if (langCode === 'und') {
    const regex = /\(([A-Z]{2,3})\)/g
    langCode = regex.exec(text)?.[1] ?? 'und'
  }

  return bcp47Normalize(langCode)

}