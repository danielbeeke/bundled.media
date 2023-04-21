import {isAlphanumerical} from "/-/is-alphanumerical@v2.0.1-POnlLHwy2MN422axvZUe/dist=es2019,mode=imports/optimized/is-alphanumerical.js";
import {isAlphabetical} from "/-/is-alphabetical@v2.0.1-KhltkX6ngd09T0jrUFMY/dist=es2019,mode=imports/optimized/is-alphabetical.js";
import {isDecimal} from "/-/is-decimal@v2.0.1-x2tLBSLSYx8zfLIoqHGP/dist=es2019,mode=imports/optimized/is-decimal.js";
const regular = [
  "art-lojban",
  "cel-gaulish",
  "no-bok",
  "no-nyn",
  "zh-guoyu",
  "zh-hakka",
  "zh-min",
  "zh-min-nan",
  "zh-xiang"
];
const normal = {
  "en-gb-oed": "en-GB-oxendict",
  "i-ami": "ami",
  "i-bnn": "bnn",
  "i-default": null,
  "i-enochian": null,
  "i-hak": "hak",
  "i-klingon": "tlh",
  "i-lux": "lb",
  "i-mingo": null,
  "i-navajo": "nv",
  "i-pwn": "pwn",
  "i-tao": "tao",
  "i-tay": "tay",
  "i-tsu": "tsu",
  "sgn-be-fr": "sfb",
  "sgn-be-nl": "vgt",
  "sgn-ch-de": "sgg",
  "art-lojban": "jbo",
  "cel-gaulish": null,
  "no-bok": "nb",
  "no-nyn": "nn",
  "zh-guoyu": "cmn",
  "zh-hakka": "hak",
  "zh-min": null,
  "zh-min-nan": "nan",
  "zh-xiang": "hsn"
};
const own = {}.hasOwnProperty;
function parse(tag, options = {}) {
  const result = empty();
  const source = String(tag);
  const value = source.toLowerCase();
  let index = 0;
  if (tag === null || tag === void 0) {
    throw new Error("Expected string, got `" + tag + "`");
  }
  if (own.call(normal, value)) {
    const replacement = normal[value];
    if ((options.normalize === void 0 || options.normalize === null || options.normalize) && typeof replacement === "string") {
      return parse(replacement);
    }
    result[regular.includes(value) ? "regular" : "irregular"] = source;
    return result;
  }
  while (isAlphabetical(value.charCodeAt(index)) && index < 9)
    index++;
  if (index > 1 && index < 9) {
    result.language = source.slice(0, index);
    if (index < 4) {
      let groups = 0;
      while (value.charCodeAt(index) === 45 && isAlphabetical(value.charCodeAt(index + 1)) && isAlphabetical(value.charCodeAt(index + 2)) && isAlphabetical(value.charCodeAt(index + 3)) && !isAlphabetical(value.charCodeAt(index + 4))) {
        if (groups > 2) {
          return fail(index, 3, "Too many extended language subtags, expected at most 3 subtags");
        }
        result.extendedLanguageSubtags.push(source.slice(index + 1, index + 4));
        index += 4;
        groups++;
      }
    }
    if (value.charCodeAt(index) === 45 && isAlphabetical(value.charCodeAt(index + 1)) && isAlphabetical(value.charCodeAt(index + 2)) && isAlphabetical(value.charCodeAt(index + 3)) && isAlphabetical(value.charCodeAt(index + 4)) && !isAlphabetical(value.charCodeAt(index + 5))) {
      result.script = source.slice(index + 1, index + 5);
      index += 5;
    }
    if (value.charCodeAt(index) === 45) {
      if (isAlphabetical(value.charCodeAt(index + 1)) && isAlphabetical(value.charCodeAt(index + 2)) && !isAlphabetical(value.charCodeAt(index + 3))) {
        result.region = source.slice(index + 1, index + 3);
        index += 3;
      } else if (isDecimal(value.charCodeAt(index + 1)) && isDecimal(value.charCodeAt(index + 2)) && isDecimal(value.charCodeAt(index + 3)) && !isDecimal(value.charCodeAt(index + 4))) {
        result.region = source.slice(index + 1, index + 4);
        index += 4;
      }
    }
    while (value.charCodeAt(index) === 45) {
      const start = index + 1;
      let offset = start;
      while (isAlphanumerical(value.charCodeAt(offset))) {
        if (offset - start > 7) {
          return fail(offset, 1, "Too long variant, expected at most 8 characters");
        }
        offset++;
      }
      if (offset - start > 4 || offset - start > 3 && isDecimal(value.charCodeAt(start))) {
        result.variants.push(source.slice(start, offset));
        index = offset;
      } else {
        break;
      }
    }
    while (value.charCodeAt(index) === 45) {
      if (value.charCodeAt(index + 1) === 120 || !isAlphanumerical(value.charCodeAt(index + 1)) || value.charCodeAt(index + 2) !== 45 || !isAlphanumerical(value.charCodeAt(index + 3))) {
        break;
      }
      let offset = index + 2;
      let groups = 0;
      while (value.charCodeAt(offset) === 45 && isAlphanumerical(value.charCodeAt(offset + 1)) && isAlphanumerical(value.charCodeAt(offset + 2))) {
        const start = offset + 1;
        offset = start + 2;
        groups++;
        while (isAlphanumerical(value.charCodeAt(offset))) {
          if (offset - start > 7) {
            return fail(offset, 2, "Too long extension, expected at most 8 characters");
          }
          offset++;
        }
      }
      if (!groups) {
        return fail(offset, 4, "Empty extension, extensions must have at least 2 characters of content");
      }
      result.extensions.push({
        singleton: source.charAt(index + 1),
        extensions: source.slice(index + 3, offset).split("-")
      });
      index = offset;
    }
  } else {
    index = 0;
  }
  if (index === 0 && value.charCodeAt(index) === 120 || value.charCodeAt(index) === 45 && value.charCodeAt(index + 1) === 120) {
    index = index ? index + 2 : 1;
    let offset = index;
    while (value.charCodeAt(offset) === 45 && isAlphanumerical(value.charCodeAt(offset + 1))) {
      const start = index + 1;
      offset = start;
      while (isAlphanumerical(value.charCodeAt(offset))) {
        if (offset - start > 7) {
          return fail(offset, 5, "Too long private-use area, expected at most 8 characters");
        }
        offset++;
      }
      result.privateuse.push(source.slice(index + 1, offset));
      index = offset;
    }
  }
  if (index !== source.length) {
    return fail(index, 6, "Found superfluous content after tag");
  }
  return result;
  function fail(offset, code, reason) {
    if (options.warning)
      options.warning(reason, code, offset);
    return options.forgiving ? result : empty();
  }
}
function empty() {
  return {
    language: null,
    extendedLanguageSubtags: [],
    script: null,
    region: null,
    variants: [],
    extensions: [],
    privateuse: [],
    irregular: null,
    regular: null
  };
}
function stringify(schema = {}) {
  let result = [];
  if (schema.irregular) {
    return schema.irregular;
  }
  if (schema.regular) {
    return schema.regular;
  }
  if (schema.language) {
    result = result.concat(schema.language, schema.extendedLanguageSubtags || [], schema.script || [], schema.region || [], schema.variants || []);
    const values = schema.extensions || [];
    let index = -1;
    while (++index < values.length) {
      const value = values[index];
      if (value.singleton && value.extensions && value.extensions.length > 0) {
        result.push(value.singleton, ...value.extensions);
      }
    }
  }
  if (schema.privateuse && schema.privateuse.length > 0) {
    result.push("x", ...schema.privateuse);
  }
  return result.join("-");
}
export {parse, stringify};
export default null;
