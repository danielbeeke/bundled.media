/* esm.sh - esbuild bundle(rxjs@7.5.7/internal/operators/publishReplay) deno production */
import{ReplaySubject as u}from"/v115/rxjs@7.5.7/deno/internal/ReplaySubject.js";import{multicast as a}from"/v115/rxjs@7.5.7/deno/internal/operators/multicast.js";import{isFunction as f}from"/v115/rxjs@7.5.7/deno/internal/util/isFunction.js";function j(o,p,n,i){n&&!f(n)&&(i=n);let t=f(n)?n:void 0;return m=>a(new u(o,p,i),t)(m)}export{j as publishReplay};
//# sourceMappingURL=publishReplay.js.map