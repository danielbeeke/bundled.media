function isAlphabetical(character) {
  const code = typeof character === "string" ? character.charCodeAt(0) : character;
  return code >= 97 && code <= 122 || code >= 65 && code <= 90;
}
export {isAlphabetical};
export default null;
