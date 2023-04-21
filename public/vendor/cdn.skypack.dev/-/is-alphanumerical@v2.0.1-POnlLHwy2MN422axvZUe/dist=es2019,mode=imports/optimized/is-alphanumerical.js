import {isAlphabetical} from "/-/is-alphabetical@v2.0.1-KhltkX6ngd09T0jrUFMY/dist=es2019,mode=imports/optimized/is-alphabetical.js";
import {isDecimal} from "/-/is-decimal@v2.0.1-x2tLBSLSYx8zfLIoqHGP/dist=es2019,mode=imports/optimized/is-decimal.js";
function isAlphanumerical(character) {
  return isAlphabetical(character) || isDecimal(character);
}
export {isAlphanumerical};
export default null;
