/* esm.sh - esbuild bundle(rxjs@7.5.7/internal/operators/takeUntil) deno production */
import{operate as e}from"/v115/rxjs@7.5.7/deno/internal/util/lift.js";import{createOperatorSubscriber as m}from"/v115/rxjs@7.5.7/deno/internal/operators/OperatorSubscriber.js";import{innerFrom as p}from"/v115/rxjs@7.5.7/deno/internal/observable/innerFrom.js";import{noop as i}from"/v115/rxjs@7.5.7/deno/internal/util/noop.js";function l(r){return e((t,o)=>{p(r).subscribe(m(o,()=>o.complete(),i)),!o.closed&&t.subscribe(o)})}export{l as takeUntil};
//# sourceMappingURL=takeUntil.js.map