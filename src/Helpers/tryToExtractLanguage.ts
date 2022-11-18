import { iso6393 } from 'https://esm.sh/iso-639-3@3.0.1'
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

/**
 * Convert to a method that receives an array of strings such as keywords, title, category etc.
 * And given that makes a scored array of possible bcp47 tags.
 * The highest score will be for anything prefixed wth "bcp47:"
 * 
 * It would be amazing if organizations that use platforms, use "bcp47:LANGCODE" in on of the keywords / categories or in the title.
 * TODO propagate this idea to the media publishers.
 */
export const tryToExtractLanguage = (texts: Array<string>) => {
  const prefixedBcp47 = texts.find(text => text.startsWith('bcp47:'))

  if (prefixedBcp47) {
    return prefixedBcp47.split(':').pop()
  }

  const parts = [
    ...texts.flatMap(text => text.split(' - ').pop()!.split(' ')),
    ...texts
  ].flatMap(string => string.split('_')).filter(Boolean)

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

  return !langCode || langCode === 'und' ? 'und' : bcp47Normalize(langCode)

}