/* esm.sh - esbuild bundle(rxjs@7.5.7/internal/operators/bufferWhen) deno production */
import{operate as f}from"/v115/rxjs@7.5.7/deno/internal/util/lift.js";import{noop as p}from"/v115/rxjs@7.5.7/deno/internal/util/noop.js";import{createOperatorSubscriber as l}from"/v115/rxjs@7.5.7/deno/internal/operators/OperatorSubscriber.js";import{innerFrom as m}from"/v115/rxjs@7.5.7/deno/internal/observable/innerFrom.js";function v(u){return f((i,e)=>{let o=null,n=null,t=()=>{n?.unsubscribe();let r=o;o=[],r&&e.next(r),m(u()).subscribe(n=l(e,t,p))};t(),i.subscribe(l(e,r=>o?.push(r),()=>{o&&e.next(o),e.complete()},void 0,()=>o=n=null))})}export{v as bufferWhen};
//# sourceMappingURL=bufferWhen.js.map