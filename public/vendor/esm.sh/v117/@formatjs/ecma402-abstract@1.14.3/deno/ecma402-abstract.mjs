/* esm.sh - esbuild bundle(@formatjs/ecma402-abstract@1.14.3) deno production */
function se(e){return Intl.getCanonicalLocales(e)}function vr(e,r){var t=r.tzData,n=r.uppercaseLinks,i=e.toUpperCase(),u=Object.keys(t).reduce(function(o,l){return o[l.toUpperCase()]=l,o},{}),a=n[i]||u[i];return a==="Etc/UTC"||a==="Etc/GMT"?"UTC":a}function G(e){if(typeof e=="symbol")throw TypeError("Cannot convert a Symbol value to a string");return String(e)}function _e(e){if(e===void 0)return NaN;if(e===null)return 0;if(typeof e=="boolean")return e?1:0;if(typeof e=="number")return e;if(typeof e=="symbol"||typeof e=="bigint")throw new TypeError("Cannot convert symbol/bigint to number");return Number(e)}function Ye(e){var r=_e(e);if(isNaN(r)||A(r,-0))return 0;if(isFinite(r))return r;var t=Math.floor(Math.abs(r));return r<0&&(t=-t),A(t,-0)?0:t}function yr(e){return isFinite(e)?Math.abs(e)>8.64*1e15?NaN:Ye(e):NaN}function _(e){if(e==null)throw new TypeError("undefined/null cannot be converted to object");return Object(e)}function A(e,r){return Object.is?Object.is(e,r):e===r?e!==0||1/e===1/r:e!==e&&r!==r}function pe(e){return new Array(e)}function ge(e,r){return Object.prototype.hasOwnProperty.call(e,r)}function Fr(e){if(e===null)return"Null";if(typeof e>"u")return"Undefined";if(typeof e=="function"||typeof e=="object")return"Object";if(typeof e=="number")return"Number";if(typeof e=="boolean")return"Boolean";if(typeof e=="string")return"String";if(typeof e=="symbol")return"Symbol";if(typeof e=="bigint")return"BigInt"}var De=864e5;function U(e,r){return e-Math.floor(e/r)*r}function ve(e){return Math.floor(e/De)}function hr(e){return U(ve(e)+4,7)}function Ze(e){return Date.UTC(e,0)/De}function Er(e){return Date.UTC(e,0)}function de(e){return new Date(e).getUTCFullYear()}function Ve(e){return e%4!==0?365:e%100!==0?366:e%400!==0?365:366}function ye(e){return ve(e)-Ze(de(e))}function Fe(e){return Ve(de(e))===365?0:1}function He(e){var r=ye(e),t=Fe(e);if(r>=0&&r<31)return 0;if(r<59+t)return 1;if(r<90+t)return 2;if(r<120+t)return 3;if(r<151+t)return 4;if(r<181+t)return 5;if(r<212+t)return 6;if(r<243+t)return 7;if(r<273+t)return 8;if(r<304+t)return 9;if(r<334+t)return 10;if(r<365+t)return 11;throw new Error("Invalid time")}function br(e){var r=ye(e),t=He(e),n=Fe(e);if(t===0)return r+1;if(t===1)return r-30;if(t===2)return r-58-n;if(t===3)return r-89-n;if(t===4)return r-119-n;if(t===5)return r-150-n;if(t===6)return r-180-n;if(t===7)return r-211-n;if(t===8)return r-242-n;if(t===9)return r-272-n;if(t===10)return r-303-n;if(t===11)return r-333-n;throw new Error("Invalid time")}var Xe=24,he=60,Ee=60,K=1e3,be=K*Ee,We=be*he;function Cr(e){return U(Math.floor(e/We),Xe)}function xr(e){return U(Math.floor(e/be),he)}function Sr(e){return U(Math.floor(e/K),Ee)}function $e(e){return typeof e=="function"}function Ir(e,r,t){if(!$e(e))return!1;if(t?.boundTargetFunction){var n=t?.boundTargetFunction;return r instanceof n}if(typeof r!="object")return!1;var i=e.prototype;if(typeof i!="object")throw new TypeError("OrdinaryHasInstance called on an object with an invalid prototype property.");return Object.prototype.isPrototypeOf.call(i,r)}function wr(e){return U(e,K)}function Ce(e){return typeof e>"u"?Object.create(null):_(e)}function T(e,r,t,n){if(e!==void 0){if(e=Number(e),isNaN(e)||e<r||e>t)throw new RangeError("".concat(e," is outside of range [").concat(r,", ").concat(t,"]"));return Math.floor(e)}return n}function Y(e,r,t,n,i){var u=e[r];return T(u,t,n,i)}function d(e,r,t,n,i){if(typeof e!="object")throw new TypeError("Options must be an object");var u=e[r];if(u!==void 0){if(t!=="boolean"&&t!=="string")throw new TypeError("invalid type");if(t==="boolean"&&(u=!!u),t==="string"&&(u=G(u)),n!==void 0&&!n.filter(function(a){return a==u}).length)throw new RangeError("".concat(u," is not within ").concat(n.join(", ")));return u}return i}function Ur(e){if(typeof e>"u")return Object.create(null);if(typeof e=="object")return e;throw new TypeError("Options must be an object")}function xe(e,r,t,n,i,u){var a=e[r];if(a===void 0)return u;if(a===!0)return n;var o=!!a;if(o===!1)return i;if(a=G(a),a==="true"||a==="false")return u;if((t||[]).indexOf(a)===-1)throw new RangeError("Invalid value ".concat(a));return a}var qe=["angle-degree","area-acre","area-hectare","concentr-percent","digital-bit","digital-byte","digital-gigabit","digital-gigabyte","digital-kilobit","digital-kilobyte","digital-megabit","digital-megabyte","digital-petabyte","digital-terabit","digital-terabyte","duration-day","duration-hour","duration-millisecond","duration-minute","duration-month","duration-second","duration-week","duration-year","length-centimeter","length-foot","length-inch","length-kilometer","length-meter","length-mile-scandinavian","length-mile","length-millimeter","length-yard","mass-gram","mass-kilogram","mass-ounce","mass-pound","mass-stone","temperature-celsius","temperature-fahrenheit","volume-fluid-ounce","volume-gallon","volume-liter","volume-milliliter"];function Qe(e){return e.slice(e.indexOf("-")+1)}var Je=qe.map(Qe);function Z(e){return Je.indexOf(e)>-1}function Gr(e,r){var t=r.tzData,n=r.uppercaseLinks,i=e.toUpperCase(),u=new Set,a=new Set;return Object.keys(t).map(function(o){return o.toUpperCase()}).forEach(function(o){return u.add(o)}),Object.keys(n).forEach(function(o){a.add(o.toUpperCase()),u.add(n[o].toUpperCase())}),u.has(i)||a.has(i)}function Ke(e){return e.replace(/([a-z])/g,function(r,t){return t.toUpperCase()})}var er=/[^A-Z]/;function Se(e){return e=Ke(e),!(e.length!==3||er.test(e))}function rr(e){return e.replace(/([A-Z])/g,function(r,t){return t.toLowerCase()})}function Ie(e){if(e=rr(e),Z(e))return!0;var r=e.split("-per-");if(r.length!==2)return!1;var t=r[0],n=r[1];return!(!Z(t)||!Z(n))}function Hr(e,r,t,n){if(e===r)return r;if(n===void 0)throw new Error("unsignedRoundingMode is mandatory");if(n==="zero")return r;if(n==="infinity")return t;var i=e-r,u=t-e;if(i<u)return r;if(u<i)return t;if(i!==u)throw new Error("Unexpected error");if(n==="half-zero")return r;if(n==="half-infinity")return t;if(n!=="half-even")throw new Error("Unexpected value for unsignedRoundingMode: ".concat(n));var a=r/(t-r)%2;return a===0?r:t}function Wr(e){return e}function O(e){return Math.floor(Math.log(e)*Math.LOG10E)}function w(e,r){if(typeof e.repeat=="function")return e.repeat(r);for(var t=new Array(r),n=0;n<t.length;n++)t[n]=e;return t.join("")}function we(e,r,t,n){e.get(r)||e.set(r,Object.create(null));var i=e.get(r);i[t]=n}function tr(e,r,t){for(var n=0,i=Object.keys(t);n<i.length;n++){var u=i[n];we(e,r,u,t[u])}}function nr(e,r,t){return Ne(e,r,t)[t]}function Ne(e,r){for(var t=[],n=2;n<arguments.length;n++)t[n-2]=arguments[n];var i=e.get(r);if(!i)throw new TypeError("".concat(r," InternalSlot has not been initialized"));return t.reduce(function(u,a){return u[a]=i[a],u},Object.create(null))}function ir(e){return e.type==="literal"}function ur(e,r,t){var n=t.value;Object.defineProperty(e,r,{configurable:!0,enumerable:!1,writable:!0,value:n})}function R(e,r,t){if(t===void 0&&(t=Error),!e)throw new t(r)}function ee(e,r,t){var n=t.getInternalSlots,i=n(e),u=i.notation,a=i.dataLocaleData,o=i.numberingSystem;switch(u){case"standard":return 0;case"scientific":return r;case"engineering":return Math.floor(r/3)*3;default:{var l=i.compactDisplay,s=i.style,v=i.currencyDisplay,c=void 0;if(s==="currency"&&v!=="name"){var m=a.numbers.currency[o]||a.numbers.currency[a.numbers.nu[0]];c=m.short}else{var g=a.numbers.decimal[o]||a.numbers.decimal[a.numbers.nu[0]];c=l==="long"?g.long:g.short}if(!c)return 0;var f=String(Math.pow(10,r)),D=Object.keys(c);if(f<D[0])return 0;if(f>D[D.length-1])return D[D.length-1].length-1;var y=D.indexOf(f);if(y===-1)return 0;var p=D[y],h=c[p].other;return h==="0"?0:p.length-c[p].other.match(/0+/)[0].length}}}function re(e,r,t){var n=t,i,u,a;if(e===0)i=w("0",n),u=0,a=0;else{var o=e.toString(),l=o.indexOf("e"),s=o.split("e"),v=s[0],c=s[1],m=v.replace(".","");if(l>=0&&m.length<=n)u=+c,i=m+w("0",n-m.length),a=e;else{u=O(e);var g=u-n+1,f=Math.round(p(e,g));p(f,n-1)>=10&&(u=u+1,f=Math.floor(f/10)),i=f.toString(),a=p(f,n-1-u)}}var D;if(u>=n-1?(i=i+w("0",u-n+1),D=u+1):u>=0?(i="".concat(i.slice(0,u+1),".").concat(i.slice(u+1)),D=u+1):(i="0.".concat(w("0",-u-1)).concat(i),D=1),i.indexOf(".")>=0&&t>r){for(var y=t-r;y>0&&i[i.length-1]==="0";)i=i.slice(0,-1),y--;i[i.length-1]==="."&&(i=i.slice(0,-1))}return{formattedString:i,roundedNumber:a,integerDigitsCount:D};function p(h,E){return E<0?h*Math.pow(10,-E):h/Math.pow(10,E)}}function k(e,r,t){var n=t,i=Math.round(e*Math.pow(10,n)),u=i/Math.pow(10,n),a;if(i<1e21)a=i.toString();else{a=i.toString();var o=a.split("e"),l=o[0],s=o[1];a=l.replace(".",""),a=a+w("0",Math.max(+s-a.length+1,0))}var v;if(n!==0){var c=a.length;if(c<=n){var m=w("0",n+1-c);a=m+a,c=n+1}var g=a.slice(0,c-n),f=a.slice(c-n);a="".concat(g,".").concat(f),v=g.length}else v=a.length;for(var D=t-r;D>0&&a[a.length-1]==="0";)a=a.slice(0,-1),D--;return a[a.length-1]==="."&&(a=a.slice(0,-1)),{formattedString:a,roundedNumber:u,integerDigitsCount:v}}function V(e,r){var t=r<0||A(r,-0);t&&(r=-r);var n,i=e.roundingType;switch(i){case"significantDigits":n=re(r,e.minimumSignificantDigits,e.maximumSignificantDigits);break;case"fractionDigits":n=k(r,e.minimumFractionDigits,e.maximumFractionDigits);break;default:n=re(r,1,2),n.integerDigitsCount>1&&(n=k(r,0,0));break}r=n.roundedNumber;var u=n.formattedString,a=n.integerDigitsCount,o=e.minimumIntegerDigits;if(a<o){var l=w("0",o-a);u=l+u}return t&&(r=-r),{roundedNumber:r,formattedString:u}}function Ae(e,r,t){var n=t.getInternalSlots;if(r===0)return[0,0];r<0&&(r=-r);var i=O(r),u=ee(e,i,{getInternalSlots:n});r=u<0?r*Math.pow(10,-u):r/Math.pow(10,u);var a=V(n(e),r);if(a.roundedNumber===0)return[u,i];var o=O(a.roundedNumber);return o===i-u?[u,i]:[ee(e,i+1,{getInternalSlots:n}),i+1]}function Te(e,r){var t=r.currencyDigitsData;return ge(t,e)?t[e]:2}function Oe(e,r,t){var n=t.getInternalSlots,i=n(e),u=i.dataLocaleData.numbers.symbols[i.numberingSystem],a=u.approximatelySign;return r.push({type:"approximatelySign",value:a}),r}var Be={adlm:["\u{1E950}","\u{1E951}","\u{1E952}","\u{1E953}","\u{1E954}","\u{1E955}","\u{1E956}","\u{1E957}","\u{1E958}","\u{1E959}"],ahom:["\u{11730}","\u{11731}","\u{11732}","\u{11733}","\u{11734}","\u{11735}","\u{11736}","\u{11737}","\u{11738}","\u{11739}"],arab:["\u0660","\u0661","\u0662","\u0663","\u0664","\u0665","\u0666","\u0667","\u0668","\u0669"],arabext:["\u06F0","\u06F1","\u06F2","\u06F3","\u06F4","\u06F5","\u06F6","\u06F7","\u06F8","\u06F9"],bali:["\u1B50","\u1B51","\u1B52","\u1B53","\u1B54","\u1B55","\u1B56","\u1B57","\u1B58","\u1B59"],beng:["\u09E6","\u09E7","\u09E8","\u09E9","\u09EA","\u09EB","\u09EC","\u09ED","\u09EE","\u09EF"],bhks:["\u{11C50}","\u{11C51}","\u{11C52}","\u{11C53}","\u{11C54}","\u{11C55}","\u{11C56}","\u{11C57}","\u{11C58}","\u{11C59}"],brah:["\u{11066}","\u{11067}","\u{11068}","\u{11069}","\u{1106A}","\u{1106B}","\u{1106C}","\u{1106D}","\u{1106E}","\u{1106F}"],cakm:["\u{11136}","\u{11137}","\u{11138}","\u{11139}","\u{1113A}","\u{1113B}","\u{1113C}","\u{1113D}","\u{1113E}","\u{1113F}"],cham:["\uAA50","\uAA51","\uAA52","\uAA53","\uAA54","\uAA55","\uAA56","\uAA57","\uAA58","\uAA59"],deva:["\u0966","\u0967","\u0968","\u0969","\u096A","\u096B","\u096C","\u096D","\u096E","\u096F"],diak:["\u{11950}","\u{11951}","\u{11952}","\u{11953}","\u{11954}","\u{11955}","\u{11956}","\u{11957}","\u{11958}","\u{11959}"],fullwide:["\uFF10","\uFF11","\uFF12","\uFF13","\uFF14","\uFF15","\uFF16","\uFF17","\uFF18","\uFF19"],gong:["\u{11DA0}","\u{11DA1}","\u{11DA2}","\u{11DA3}","\u{11DA4}","\u{11DA5}","\u{11DA6}","\u{11DA7}","\u{11DA8}","\u{11DA9}"],gonm:["\u{11D50}","\u{11D51}","\u{11D52}","\u{11D53}","\u{11D54}","\u{11D55}","\u{11D56}","\u{11D57}","\u{11D58}","\u{11D59}"],gujr:["\u0AE6","\u0AE7","\u0AE8","\u0AE9","\u0AEA","\u0AEB","\u0AEC","\u0AED","\u0AEE","\u0AEF"],guru:["\u0A66","\u0A67","\u0A68","\u0A69","\u0A6A","\u0A6B","\u0A6C","\u0A6D","\u0A6E","\u0A6F"],hanidec:["\u3007","\u4E00","\u4E8C","\u4E09","\u56DB","\u4E94","\u516D","\u4E03","\u516B","\u4E5D"],hmng:["\u{16B50}","\u{16B51}","\u{16B52}","\u{16B53}","\u{16B54}","\u{16B55}","\u{16B56}","\u{16B57}","\u{16B58}","\u{16B59}"],hmnp:["\u{1E140}","\u{1E141}","\u{1E142}","\u{1E143}","\u{1E144}","\u{1E145}","\u{1E146}","\u{1E147}","\u{1E148}","\u{1E149}"],java:["\uA9D0","\uA9D1","\uA9D2","\uA9D3","\uA9D4","\uA9D5","\uA9D6","\uA9D7","\uA9D8","\uA9D9"],kali:["\uA900","\uA901","\uA902","\uA903","\uA904","\uA905","\uA906","\uA907","\uA908","\uA909"],khmr:["\u17E0","\u17E1","\u17E2","\u17E3","\u17E4","\u17E5","\u17E6","\u17E7","\u17E8","\u17E9"],knda:["\u0CE6","\u0CE7","\u0CE8","\u0CE9","\u0CEA","\u0CEB","\u0CEC","\u0CED","\u0CEE","\u0CEF"],lana:["\u1A80","\u1A81","\u1A82","\u1A83","\u1A84","\u1A85","\u1A86","\u1A87","\u1A88","\u1A89"],lanatham:["\u1A90","\u1A91","\u1A92","\u1A93","\u1A94","\u1A95","\u1A96","\u1A97","\u1A98","\u1A99"],laoo:["\u0ED0","\u0ED1","\u0ED2","\u0ED3","\u0ED4","\u0ED5","\u0ED6","\u0ED7","\u0ED8","\u0ED9"],lepc:["\u1A90","\u1A91","\u1A92","\u1A93","\u1A94","\u1A95","\u1A96","\u1A97","\u1A98","\u1A99"],limb:["\u1946","\u1947","\u1948","\u1949","\u194A","\u194B","\u194C","\u194D","\u194E","\u194F"],mathbold:["\u{1D7CE}","\u{1D7CF}","\u{1D7D0}","\u{1D7D1}","\u{1D7D2}","\u{1D7D3}","\u{1D7D4}","\u{1D7D5}","\u{1D7D6}","\u{1D7D7}"],mathdbl:["\u{1D7D8}","\u{1D7D9}","\u{1D7DA}","\u{1D7DB}","\u{1D7DC}","\u{1D7DD}","\u{1D7DE}","\u{1D7DF}","\u{1D7E0}","\u{1D7E1}"],mathmono:["\u{1D7F6}","\u{1D7F7}","\u{1D7F8}","\u{1D7F9}","\u{1D7FA}","\u{1D7FB}","\u{1D7FC}","\u{1D7FD}","\u{1D7FE}","\u{1D7FF}"],mathsanb:["\u{1D7EC}","\u{1D7ED}","\u{1D7EE}","\u{1D7EF}","\u{1D7F0}","\u{1D7F1}","\u{1D7F2}","\u{1D7F3}","\u{1D7F4}","\u{1D7F5}"],mathsans:["\u{1D7E2}","\u{1D7E3}","\u{1D7E4}","\u{1D7E5}","\u{1D7E6}","\u{1D7E7}","\u{1D7E8}","\u{1D7E9}","\u{1D7EA}","\u{1D7EB}"],mlym:["\u0D66","\u0D67","\u0D68","\u0D69","\u0D6A","\u0D6B","\u0D6C","\u0D6D","\u0D6E","\u0D6F"],modi:["\u{11650}","\u{11651}","\u{11652}","\u{11653}","\u{11654}","\u{11655}","\u{11656}","\u{11657}","\u{11658}","\u{11659}"],mong:["\u1810","\u1811","\u1812","\u1813","\u1814","\u1815","\u1816","\u1817","\u1818","\u1819"],mroo:["\u{16A60}","\u{16A61}","\u{16A62}","\u{16A63}","\u{16A64}","\u{16A65}","\u{16A66}","\u{16A67}","\u{16A68}","\u{16A69}"],mtei:["\uABF0","\uABF1","\uABF2","\uABF3","\uABF4","\uABF5","\uABF6","\uABF7","\uABF8","\uABF9"],mymr:["\u1040","\u1041","\u1042","\u1043","\u1044","\u1045","\u1046","\u1047","\u1048","\u1049"],mymrshan:["\u1090","\u1091","\u1092","\u1093","\u1094","\u1095","\u1096","\u1097","\u1098","\u1099"],mymrtlng:["\uA9F0","\uA9F1","\uA9F2","\uA9F3","\uA9F4","\uA9F5","\uA9F6","\uA9F7","\uA9F8","\uA9F9"],newa:["\u{11450}","\u{11451}","\u{11452}","\u{11453}","\u{11454}","\u{11455}","\u{11456}","\u{11457}","\u{11458}","\u{11459}"],nkoo:["\u07C0","\u07C1","\u07C2","\u07C3","\u07C4","\u07C5","\u07C6","\u07C7","\u07C8","\u07C9"],olck:["\u1C50","\u1C51","\u1C52","\u1C53","\u1C54","\u1C55","\u1C56","\u1C57","\u1C58","\u1C59"],orya:["\u0B66","\u0B67","\u0B68","\u0B69","\u0B6A","\u0B6B","\u0B6C","\u0B6D","\u0B6E","\u0B6F"],osma:["\u{104A0}","\u{104A1}","\u{104A2}","\u{104A3}","\u{104A4}","\u{104A5}","\u{104A6}","\u{104A7}","\u{104A8}","\u{104A9}"],rohg:["\u{10D30}","\u{10D31}","\u{10D32}","\u{10D33}","\u{10D34}","\u{10D35}","\u{10D36}","\u{10D37}","\u{10D38}","\u{10D39}"],saur:["\uA8D0","\uA8D1","\uA8D2","\uA8D3","\uA8D4","\uA8D5","\uA8D6","\uA8D7","\uA8D8","\uA8D9"],segment:["\u{1FBF0}","\u{1FBF1}","\u{1FBF2}","\u{1FBF3}","\u{1FBF4}","\u{1FBF5}","\u{1FBF6}","\u{1FBF7}","\u{1FBF8}","\u{1FBF9}"],shrd:["\u{111D0}","\u{111D1}","\u{111D2}","\u{111D3}","\u{111D4}","\u{111D5}","\u{111D6}","\u{111D7}","\u{111D8}","\u{111D9}"],sind:["\u{112F0}","\u{112F1}","\u{112F2}","\u{112F3}","\u{112F4}","\u{112F5}","\u{112F6}","\u{112F7}","\u{112F8}","\u{112F9}"],sinh:["\u0DE6","\u0DE7","\u0DE8","\u0DE9","\u0DEA","\u0DEB","\u0DEC","\u0DED","\u0DEE","\u0DEF"],sora:["\u{110F0}","\u{110F1}","\u{110F2}","\u{110F3}","\u{110F4}","\u{110F5}","\u{110F6}","\u{110F7}","\u{110F8}","\u{110F9}"],sund:["\u1BB0","\u1BB1","\u1BB2","\u1BB3","\u1BB4","\u1BB5","\u1BB6","\u1BB7","\u1BB8","\u1BB9"],takr:["\u{116C0}","\u{116C1}","\u{116C2}","\u{116C3}","\u{116C4}","\u{116C5}","\u{116C6}","\u{116C7}","\u{116C8}","\u{116C9}"],talu:["\u19D0","\u19D1","\u19D2","\u19D3","\u19D4","\u19D5","\u19D6","\u19D7","\u19D8","\u19D9"],tamldec:["\u0BE6","\u0BE7","\u0BE8","\u0BE9","\u0BEA","\u0BEB","\u0BEC","\u0BED","\u0BEE","\u0BEF"],telu:["\u0C66","\u0C67","\u0C68","\u0C69","\u0C6A","\u0C6B","\u0C6C","\u0C6D","\u0C6E","\u0C6F"],thai:["\u0E50","\u0E51","\u0E52","\u0E53","\u0E54","\u0E55","\u0E56","\u0E57","\u0E58","\u0E59"],tibt:["\u0F20","\u0F21","\u0F22","\u0F23","\u0F24","\u0F25","\u0F26","\u0F27","\u0F28","\u0F29"],tirh:["\u{114D0}","\u{114D1}","\u{114D2}","\u{114D3}","\u{114D4}","\u{114D5}","\u{114D6}","\u{114D7}","\u{114D8}","\u{114D9}"],vaii:["\u1620","\u1621","\u1622","\u1623","\u1624","\u1625","\u1626","\u1627","\u1628","\u1629"],wara:["\u{118E0}","\u{118E1}","\u{118E2}","\u{118E3}","\u{118E4}","\u{118E5}","\u{118E6}","\u{118E7}","\u{118E8}","\u{118E9}"],wcho:["\u{1E2F0}","\u{1E2F1}","\u{1E2F2}","\u{1E2F3}","\u{1E2F4}","\u{1E2F5}","\u{1E2F6}","\u{1E2F7}","\u{1E2F8}","\u{1E2F9}"]};var te=/[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20BF\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC1\uFDFC\uFDFD\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDE8\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEE0-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF73\uDF80-\uDFD8\uDFE0-\uDFEB]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDD78\uDD7A-\uDDCB\uDDCD-\uDE53\uDE60-\uDE6D\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6\uDF00-\uDF92\uDF94-\uDFCA]/;var ar=new RegExp("^".concat(te.source)),or=new RegExp("".concat(te.source,"$")),Me=/[#0](?:[\.,][#0]+)*/g;function X(e,r,t,n){var i=e.sign,u=e.exponent,a=e.magnitude,o=n.notation,l=n.style,s=n.numberingSystem,v=r.numbers.nu[0],c=null;o==="compact"&&a&&(c=cr(e,t,r,l,n.compactDisplay,n.currencyDisplay,s));var m;if(l==="currency"&&n.currencyDisplay!=="name"){var g=r.currencies[n.currency];if(g)switch(n.currencyDisplay){case"code":m=n.currency;break;case"symbol":m=g.symbol;break;default:m=g.narrow;break}else m=n.currency}var f;if(c)f=c;else if(l==="decimal"||l==="unit"||l==="currency"&&n.currencyDisplay==="name"){var D=r.numbers.decimal[s]||r.numbers.decimal[v];f=H(D.standard,i)}else if(l==="currency"){var y=r.numbers.currency[s]||r.numbers.currency[v];f=H(y[n.currencySign],i)}else{var p=r.numbers.percent[s]||r.numbers.percent[v];f=H(p,i)}var h=Me.exec(f)[0];if(f=f.replace(Me,"{0}").replace(/'(.)'/g,"$1"),l==="currency"&&n.currencyDisplay!=="name"){var y=r.numbers.currency[s]||r.numbers.currency[v],E=y.currencySpacing.afterInsertBetween;E&&!or.test(m)&&(f=f.replace("\xA4{0}","\xA4".concat(E,"{0}")));var b=y.currencySpacing.beforeInsertBetween;b&&!ar.test(m)&&(f=f.replace("{0}\xA4","{0}".concat(b,"\xA4")))}for(var M=f.split(/({c:[^}]+}|\{0\}|[¤%\-\+])/g),F=[],S=r.numbers.symbols[s]||r.numbers.symbols[v],N=0,z=M;N<z.length;N++){var C=z[N];if(C)switch(C){case"{0}":{F.push.apply(F,fr(S,e,o,u,s,!c&&!!n.useGrouping,h));break}case"-":F.push({type:"minusSign",value:S.minusSign});break;case"+":F.push({type:"plusSign",value:S.plusSign});break;case"%":F.push({type:"percentSign",value:S.percentSign});break;case"\xA4":F.push({type:"currency",value:m});break;default:/^\{c:/.test(C)?F.push({type:"compact",value:C.substring(3,C.length-1)}):F.push({type:"literal",value:C});break}}switch(l){case"currency":if(n.currencyDisplay==="name"){var I=(r.numbers.currency[s]||r.numbers.currency[v]).unitPattern,$=void 0,ne=r.currencies[n.currency];ne?$=B(t,e.roundedNumber*Math.pow(10,u),ne.displayName):$=n.currency;for(var je=I.split(/(\{[01]\})/g),x=[],q=0,ie=je;q<ie.length;q++){var C=ie[q];switch(C){case"{0}":x.push.apply(x,F);break;case"{1}":x.push({type:"currency",value:$});break;default:C&&x.push({type:"literal",value:C});break}}return x}else return F;case"unit":{var Q=n.unit,P=n.unitDisplay,ue=r.units.simple[Q],I=void 0;if(ue)I=B(t,e.roundedNumber*Math.pow(10,u),r.units.simple[Q][P]);else{var ae=Q.split("-per-"),oe=ae[0],fe=ae[1];ue=r.units.simple[oe];var ce=B(t,e.roundedNumber*Math.pow(10,u),r.units.simple[oe][P]),le=r.units.simple[fe].perUnit[P];if(le)I=le.replace("{0}",ce);else{var ze=r.units.compound.per[P],Ge=B(t,1,r.units.simple[fe][P]);I=I=ze.replace("{0}",ce).replace("{1}",Ge.replace("{0}",""))}}for(var x=[],J=0,me=I.split(/(\s*\{0\}\s*)/);J<me.length;J++){var C=me[J],L=/^(\s*)\{0\}(\s*)$/.exec(C);L?(L[1]&&x.push({type:"literal",value:L[1]}),x.push.apply(x,F),L[2]&&x.push({type:"literal",value:L[2]})):C&&x.push({type:"unit",value:C})}return x}default:return F}}function fr(e,r,t,n,i,u,a){var o=[],l=r.formattedString,s=r.roundedNumber;if(isNaN(s))return[{type:"nan",value:l}];if(!isFinite(s))return[{type:"infinity",value:l}];var v=Be[i];v&&(l=l.replace(/\d/g,function(S){return v[+S]||S}));var c=l.indexOf("."),m,g;if(c>0?(m=l.slice(0,c),g=l.slice(c+1)):m=l,u&&(t!=="compact"||s>=1e4)){var f=e.group,D=[],y=a.split(".")[0],p=y.split(","),h=3,E=3;p.length>1&&(h=p[p.length-1].length),p.length>2&&(E=p[p.length-2].length);var b=m.length-h;if(b>0){for(D.push(m.slice(b,b+h)),b-=E;b>0;b-=E)D.push(m.slice(b,b+E));D.push(m.slice(0,b+E))}else D.push(m);for(;D.length>0;){var M=D.pop();o.push({type:"integer",value:M}),D.length>0&&o.push({type:"group",value:f})}}else o.push({type:"integer",value:m});if(g!==void 0&&o.push({type:"decimal",value:e.decimal},{type:"fraction",value:g}),(t==="scientific"||t==="engineering")&&isFinite(s)){o.push({type:"exponentSeparator",value:e.exponential}),n<0&&(o.push({type:"exponentMinusSign",value:e.minusSign}),n=-n);var F=k(n,0,0);o.push({type:"exponentInteger",value:F.formattedString})}return o}function H(e,r){e.indexOf(";")<0&&(e="".concat(e,";-").concat(e));var t=e.split(";"),n=t[0],i=t[1];switch(r){case 0:return n;case-1:return i;default:return i.indexOf("-")>=0?i.replace(/-/g,"+"):"+".concat(n)}}function cr(e,r,t,n,i,u,a){var o,l=e.roundedNumber,s=e.sign,v=e.magnitude,c=String(Math.pow(10,v)),m=t.numbers.nu[0],g;if(n==="currency"&&u!=="name"){var f=t.numbers.currency,D=f[a]||f[m],y=(o=D.short)===null||o===void 0?void 0:o[c];if(!y)return null;g=B(r,l,y)}else{var f=t.numbers.decimal,p=f[a]||f[m],h=p[i][c];if(!h)return null;g=B(r,l,h)}return g==="0"?null:(g=H(g,s).replace(/([^\s;\-\+\d¤]+)/g,"{c:$1}").replace(/0+/,"0"),g)}function B(e,r,t){return t[e.select(r)]||t.other}function j(e,r,t){var n,i=t.getInternalSlots,u=i(e),a=u.pl,o=u.dataLocaleData,l=u.numberingSystem,s=o.numbers.symbols[l]||o.numbers.symbols[o.numbers.nu[0]],v=0,c=0,m;if(isNaN(r))m=s.nan;else if(r==Number.POSITIVE_INFINITY||r==Number.NEGATIVE_INFINITY)m=s.infinity;else{if(!A(r,-0)){if(!isFinite(r))throw new Error("Input must be a mathematical value");u.style=="percent"&&(r*=100),n=Ae(e,r,{getInternalSlots:i}),c=n[0],v=n[1],r=c<0?r*Math.pow(10,-c):r/Math.pow(10,c)}var g=V(u,r);m=g.formattedString,r=g.roundedNumber}var f,D=u.signDisplay;switch(D){case"never":f=0;break;case"auto":A(r,0)||r>0||isNaN(r)?f=0:f=-1;break;case"always":A(r,0)||r>0||isNaN(r)?f=1:f=-1;break;default:r===0||isNaN(r)?f=0:r>0?f=1:f=-1}return X({roundedNumber:r,formattedString:m,exponent:c,magnitude:v,sign:f},u.dataLocaleData,a,u)}function W(e,r,t,n){var i=n.getInternalSlots;if(isNaN(r)||isNaN(t))throw new RangeError("Input must be a number");var u=[],a=j(e,r,{getInternalSlots:i}),o=j(e,t,{getInternalSlots:i});if(a===o)return Oe(e,a,{getInternalSlots:i});for(var l=0,s=a;l<s.length;l++){var v=s[l];v.source="startRange"}u=u.concat(a);var c=i(e),m=c.dataLocaleData.numbers.symbols[c.numberingSystem];u.push({type:"literal",value:m.rangeSign,source:"shared"});for(var g=0,f=o;g<f.length;g++){var v=f[g];v.source="endRange"}return u=u.concat(o),u}function At(e,r,t,n){var i=n.getInternalSlots,u=W(e,r,t,{getInternalSlots:i});return u.map(function(a){return a.value}).join("")}function Bt(e,r,t,n){var i=n.getInternalSlots,u=W(e,r,t,{getInternalSlots:i});return u.map(function(a,o){return{type:a.type,value:a.value,source:a.source,result:o.toString()}})}function Ut(e,r,t){for(var n=j(e,r,t),i=pe(0),u=0,a=n;u<a.length;u++){var o=a[u];i.push({type:o.type,value:o.value})}return i}var lr={ceil:"zero",floor:"infinity",expand:"infinity",trunc:"zero",halfCeil:"half-zero",halfFloor:"half-infinity",halfExpand:"half-infinity",halfTrunc:"half-zero",halfEven:"half-even"},mr={ceil:"infinity",floor:"zero",expand:"infinity",trunc:"zero",halfCeil:"half-infinity",halfFloor:"half-zero",halfExpand:"half-infinity",halfTrunc:"half-zero",halfEven:"half-even"};function kt(e,r){return r?lr[e]:mr[e]}import{ResolveLocale as sr}from"/v117/@formatjs/intl-localematcher@0.2.32/deno/intl-localematcher.mjs";function Pe(e,r,t){r===void 0&&(r=Object.create(null));var n=t.getInternalSlots,i=n(e),u=d(r,"style","string",["decimal","percent","currency","unit"],"decimal");i.style=u;var a=d(r,"currency","string",void 0,void 0);if(a!==void 0&&!Se(a))throw RangeError("Malformed currency code");if(u==="currency"&&a===void 0)throw TypeError("currency cannot be undefined");var o=d(r,"currencyDisplay","string",["code","symbol","narrowSymbol","name"],"symbol"),l=d(r,"currencySign","string",["standard","accounting"],"standard"),s=d(r,"unit","string",void 0,void 0);if(s!==void 0&&!Ie(s))throw RangeError("Invalid unit argument for Intl.NumberFormat()");if(u==="unit"&&s===void 0)throw TypeError("unit cannot be undefined");var v=d(r,"unitDisplay","string",["short","narrow","long"],"short");u==="currency"&&(i.currency=a.toUpperCase(),i.currencyDisplay=o,i.currencySign=l),u==="unit"&&(i.unit=s,i.unitDisplay=v)}function Le(e,r,t,n,i){var u=Y(r,"minimumIntegerDigits",1,21,1),a=r.minimumFractionDigits,o=r.maximumFractionDigits,l=r.minimumSignificantDigits,s=r.maximumSignificantDigits;e.minimumIntegerDigits=u;var v=d(r,"roundingPriority","string",["auto","morePrecision","lessPrecision"],"auto"),c=l!==void 0||s!==void 0,m=a!==void 0||o!==void 0,g=!0,f=!0;if(v==="auto"&&(g=c,(c||!m&&i==="compact")&&(f=!1)),g&&(c?(l=T(l,1,21,1),s=T(s,l,21,21),e.minimumSignificantDigits=l,e.maximumSignificantDigits=s):(e.minimumSignificantDigits=1,e.maximumSignificantDigits=21)),f)if(m){if(a=T(a,0,20,void 0),o=T(o,0,20,void 0),a===void 0)a=Math.min(t,o);else if(o===void 0)o=Math.max(n,a);else if(a>o)throw new RangeError("Invalid range, ".concat(a," > ").concat(o));e.minimumFractionDigits=a,e.maximumFractionDigits=o}else e.minimumFractionDigits=t,e.maximumFractionDigits=n;g||f?v==="morePrecision"?e.roundingType="morePrecision":v==="lessPrecision"?e.roundingType="lessPrecision":c?e.roundingType="significantDigits":e.roundingType="fractionDigits":(e.roundingType="morePrecision",e.minimumFractionDigits=0,e.maximumFractionDigits=0,e.minimumSignificantDigits=1,e.maximumSignificantDigits=2)}var Ue=[1,2,5,10,20,25,50,100,200,250,500,1e3,2e3];function un(e,r,t,n){var i=n.getInternalSlots,u=n.localeData,a=n.availableLocales,o=n.numberingSystemNames,l=n.getDefaultLocale,s=n.currencyDigitsData,v=se(r),c=Ce(t),m=Object.create(null),g=d(c,"localeMatcher","string",["lookup","best fit"],"best fit");m.localeMatcher=g;var f=d(c,"numberingSystem","string",void 0,void 0);if(f!==void 0&&o.indexOf(f)<0)throw RangeError("Invalid numberingSystems: ".concat(f));m.nu=f;var D=sr(a,v,m,["nu"],u,l),y=u[D.dataLocale];R(!!y,"Missing locale data for ".concat(D.dataLocale));var p=i(e);p.locale=D.locale,p.dataLocale=D.dataLocale,p.numberingSystem=D.nu,p.dataLocaleData=y,Pe(e,c,{getInternalSlots:i});var h=p.style,E,b;if(h==="currency"){var M=p.currency,F=Te(M,{currencyDigitsData:s});E=F,b=F}else E=0,b=h==="percent"?0:3;var S=d(c,"notation","string",["standard","scientific","engineering","compact"],"standard");p.notation=S,Le(p,c,E,b,S);var N=Y(c,"roundingIncrement",1,5e3,1);if(Ue.indexOf(N)===-1)throw new RangeError("Invalid rounding increment value: ".concat(N,`.
Valid values are `).concat(Ue,"."));if(N!==1&&p.roundingType!=="fractionDigits")throw new TypeError("For roundingIncrement > 1 only fractionDigits is a valid roundingType");if(N!==1&&p.maximumFractionDigits!==p.minimumFractionDigits)throw new RangeError("With roundingIncrement > 1, maximumFractionDigits and minimumFractionDigits must be equal.");p.roundingIncrement=N;var z=d(c,"trailingZeroDisplay","string",["auto","stripIfInteger"],"auto");p.trailingZeroDisplay=z;var C=d(c,"compactDisplay","string",["short","long"],"short"),I="auto";return S==="compact"&&(p.compactDisplay=C,I="min2"),p.useGrouping=xe(c,"useGrouping",["min2","auto","always"],"always",!1,I),p.signDisplay=d(c,"signDisplay","string",["auto","never","always","exceptZero","negative"],"auto"),p.roundingMode=d(c,"roundingMode","string",["ceil","floor","expand","trunc","halfCeil","halfFloor","halfExpand","halfTrunc","halfEven"],"halfExpand"),e}function fn(e){for(var r=[],t=e.indexOf("{"),n=0,i=0,u=e.length;t<e.length&&t>-1;)n=e.indexOf("}",t),R(n>t,"Invalid pattern ".concat(e)),t>i&&r.push({type:"literal",value:e.substring(i,t)}),r.push({type:e.substring(t+1,n),value:void 0}),i=n+1,t=e.indexOf("{",i);return i<u&&r.push({type:"literal",value:e.substring(i,u)}),r}import{LookupSupportedLocales as Re}from"/v117/@formatjs/intl-localematcher@0.2.32/deno/intl-localematcher.mjs";function pn(e,r,t){var n="best fit";return t!==void 0&&(t=_(t),n=d(t,"localeMatcher","string",["lookup","best fit"],"best fit")),n==="best fit"?Re(e,r):Re(e,r)}import{__extends as pr}from"/v117/tslib@2.5.0/deno/tslib.mjs";var vn=function(e){pr(r,e);function r(){var t=e!==null&&e.apply(this,arguments)||this;return t.type="MISSING_LOCALE_DATA",t}return r}(Error);function gr(e){return e.type==="MISSING_LOCALE_DATA"}var ke;(function(e){e.startRange="startRange",e.shared="shared",e.endRange="endRange"})(ke||(ke={}));export{Hr as ApplyUnsignedRoundingMode,pe as ArrayCreate,se as CanonicalizeLocaleList,vr as CanonicalizeTimeZoneName,Ce as CoerceOptionsToObject,Wr as CollapseNumberRange,Ae as ComputeExponent,ee as ComputeExponentForMagnitude,Te as CurrencyDigits,br as DateFromTime,ve as Day,Ze as DayFromYear,ye as DayWithinYear,Ve as DaysInYear,Oe as FormatApproximately,At as FormatNumericRange,Bt as FormatNumericRangeToParts,Ut as FormatNumericToParts,V as FormatNumericToString,Y as GetNumberOption,d as GetOption,Ur as GetOptionsObject,xe as GetStringOrBooleanOption,kt as GetUnsignedRoundingMode,ge as HasOwnProperty,Cr as HourFromTime,Fe as InLeapYear,un as InitializeNumberFormat,Z as IsSanctionedSimpleUnitIdentifier,Gr as IsValidTimeZoneName,Se as IsWellFormedCurrencyCode,Ie as IsWellFormedUnitIdentifier,xr as MinFromTime,He as MonthFromTime,Ir as OrdinaryHasInstance,j as PartitionNumberPattern,W as PartitionNumberRangePattern,fn as PartitionPattern,ke as RangePatternType,qe as SANCTIONED_UNITS,Je as SIMPLE_UNITS,A as SameValue,Sr as SecFromTime,Le as SetNumberFormatDigitOptions,Pe as SetNumberFormatUnitOptions,pn as SupportedLocales,yr as TimeClip,Er as TimeFromYear,_e as ToNumber,_ as ToObject,k as ToRawFixed,re as ToRawPrecision,G as ToString,Fr as Type,hr as WeekDay,de as YearFromTime,X as _formatToParts,ur as defineProperty,nr as getInternalSlot,O as getMagnitude,Ne as getMultiInternalSlots,R as invariant,ir as isLiteralPart,gr as isMissingLocaleDataError,wr as msFromTime,Qe as removeUnitNamespace,we as setInternalSlot,tr as setMultiInternalSlots};
//# sourceMappingURL=ecma402-abstract.mjs.map