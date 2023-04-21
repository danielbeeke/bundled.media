/* esm.sh - esbuild bundle(@webreflection/uparser@0.2.4) deno production */
var m=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i,o=/<([a-z]+[a-z0-9:._-]*)([^>]*?)(\/?)>/g,u=/([^\s\\>"'=]+)\s*=\s*(['"]?)\x01/g,g=/[\x01\x02]/g,p=(l,t,n)=>{let r=0;return l.join("").trim().replace(o,(s,e,c,i)=>{let a=e+c.replace(u,"=$2$1").trimEnd();return i.length&&(a+=n||m.test(e)?" /":"></"+e),"<"+a+">"}).replace(g,s=>s===""?"<!--"+t+r+++"-->":t+r++)};export{p as default};
/*! Bundled license information:

@webreflection/uparser/esm/index.js:
  (*! (c) Andrea Giammarchi - ISC *)
*/
//# sourceMappingURL=uparser.mjs.map