import { iso6393 } from 'https://esm.sh/iso-639-3@3'
import { bcp47Normalize } from './bcp47Normalize.ts'

const languageNames: { [key: string]: Array<{ code: string, name: string, part: string }> } = {}
for (const language of iso6393) {
  const cleanedName = language.name.toLowerCase().replace(' Sign Language', '')
  for (const namePart of cleanedName.split(' ')) {
    if (!languageNames[namePart]) languageNames[namePart] = []
    languageNames[namePart].push({
      code: language.iso6391 ?? language.iso6392T ?? language.iso6393,
      name: cleanedName,
      part: namePart
    })
  }
}

export const tryToExtractLanguage = (text: string) => {
  const parts = text.split(' - ').pop()!.split(' ')
  let langCode = 'und'

  const matches = new Map()

  for (const part of parts) {
    if (langCode === 'und' && languageNames[part.toLowerCase()]) {
      for (const match of languageNames[part.toLowerCase()]) {
        matches.set(match, 1)
      }
    }
  }

  let highestMatch = null
  let highestMatchScore = 0
  for (let [match, score] of matches.entries()) {
    for (const part of parts) {
      if (languageNames[part.toLowerCase()]) {
        score++
        matches.set(match, score)

        if (score > highestMatchScore) {
          highestMatch = match
          highestMatchScore = score
        }
      }
    }
  }

  if (highestMatchScore > 1) {
    langCode = highestMatch.code
  }

  if (langCode === 'und') {
    const regex = /\(([A-Z]{2,3})\)/g
    langCode = regex.exec(text)?.[1] ?? 'und'
  }

  return bcp47Normalize(langCode)

}