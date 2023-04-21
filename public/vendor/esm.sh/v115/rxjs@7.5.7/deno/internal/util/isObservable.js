/* esm.sh - esbuild bundle(rxjs@7.5.7/internal/util/isObservable) deno production */
import{Observable as e}from"/v115/rxjs@7.5.7/deno/internal/Observable.js";import{isFunction as i}from"/v115/rxjs@7.5.7/deno/internal/util/isFunction.js";function s(r){return!!r&&(r instanceof e||i(r.lift)&&i(r.subscribe))}export{s as isObservable};
//# sourceMappingURL=isObservable.js.map