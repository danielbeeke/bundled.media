/* esm.sh - esbuild bundle(rxjs@7.5.7/internal/observable/empty) deno production */
import{Observable as t}from"/v115/rxjs@7.5.7/deno/internal/Observable.js";var o=new t(e=>e.complete());function c(e){return e?r(e):o}function r(e){return new t(n=>e.schedule(()=>n.complete()))}export{o as EMPTY,c as empty};
//# sourceMappingURL=empty.js.map