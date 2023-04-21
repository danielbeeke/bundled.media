function isDecimal(character) {
  const code = typeof character === "string" ? character.charCodeAt(0) : character;
  return code >= 48 && code <= 57;
}
export {isDecimal};
export default null;
