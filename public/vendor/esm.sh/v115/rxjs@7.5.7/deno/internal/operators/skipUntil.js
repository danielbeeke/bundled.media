/* esm.sh - esbuild bundle(rxjs@7.5.7/internal/operators/skipUntil) deno production */
import{operate as m}from"/v115/rxjs@7.5.7/deno/internal/util/lift.js";import{createOperatorSubscriber as e}from"/v115/rxjs@7.5.7/deno/internal/operators/OperatorSubscriber.js";import{innerFrom as s}from"/v115/rxjs@7.5.7/deno/internal/observable/innerFrom.js";import{noop as u}from"/v115/rxjs@7.5.7/deno/internal/util/noop.js";function l(i){return m((n,o)=>{let t=!1,r=e(o,()=>{r?.unsubscribe(),t=!0},u);s(i).subscribe(r),n.subscribe(e(o,p=>t&&o.next(p)))})}export{l as skipUntil};
//# sourceMappingURL=skipUntil.js.map