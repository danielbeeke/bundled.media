/* esm.sh - esbuild bundle(rxjs@7.5.7/internal/observable/throwError) deno production */
import{Observable as m}from"/v115/rxjs@7.5.7/deno/internal/Observable.js";import{isFunction as s}from"/v115/rxjs@7.5.7/deno/internal/util/isFunction.js";function p(n,o){let e=s(n)?n:()=>n,i=t=>t.error(e());return new m(o?t=>o.schedule(i,0,t):i)}export{p as throwError};
//# sourceMappingURL=throwError.js.map