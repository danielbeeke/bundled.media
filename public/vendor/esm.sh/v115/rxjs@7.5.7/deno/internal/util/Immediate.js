/* esm.sh - esbuild bundle(rxjs@7.5.7/internal/util/Immediate) deno production */
var s=1,r,t={};function l(e){return e in t?(delete t[e],!0):!1}var o={setImmediate(e){let n=s++;return t[n]=!0,r||(r=Promise.resolve()),r.then(()=>l(n)&&e()),n},clearImmediate(e){l(e)}},d={pending(){return Object.keys(t).length}};export{o as Immediate,d as TestTools};
//# sourceMappingURL=Immediate.js.map