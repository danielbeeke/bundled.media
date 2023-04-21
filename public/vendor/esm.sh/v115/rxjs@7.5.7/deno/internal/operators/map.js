/* esm.sh - esbuild bundle(rxjs@7.5.7/internal/operators/map) deno production */
import{operate as i}from"/v115/rxjs@7.5.7/deno/internal/util/lift.js";import{createOperatorSubscriber as m}from"/v115/rxjs@7.5.7/deno/internal/operators/OperatorSubscriber.js";function f(e,t){return i((o,r)=>{let p=0;o.subscribe(m(r,a=>{r.next(e.call(t,a,p++))}))})}export{f as map};
//# sourceMappingURL=map.js.map