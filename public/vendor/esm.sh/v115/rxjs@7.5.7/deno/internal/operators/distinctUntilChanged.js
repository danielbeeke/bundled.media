/* esm.sh - esbuild bundle(rxjs@7.5.7/internal/operators/distinctUntilChanged) deno production */
import{identity as l}from"/v115/rxjs@7.5.7/deno/internal/util/identity.js";import{operate as s}from"/v115/rxjs@7.5.7/deno/internal/util/lift.js";import{createOperatorSubscriber as d}from"/v115/rxjs@7.5.7/deno/internal/operators/OperatorSubscriber.js";function b(e,t=l){return e=e??p,s((o,i)=>{let n,r=!0;o.subscribe(d(i,f=>{let u=t(f);(r||!e(n,u))&&(r=!1,n=u,i.next(f))}))})}function p(e,t){return e===t}export{b as distinctUntilChanged};
//# sourceMappingURL=distinctUntilChanged.js.map