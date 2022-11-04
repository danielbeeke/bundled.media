import { iso6393 } from 'https://esm.sh/iso-639-3@3.0.1'

export const ISO639_1_to_ISO639_3 = (ISO639_1: string) => {
  let matchedLanguage

  if (ISO639_1.length === 2) {
    matchedLanguage = iso6393.find(item => item.iso6391 === ISO639_1)
    if (matchedLanguage) {
      return matchedLanguage.iso6393
    }  
  }

  return ISO639_1
}