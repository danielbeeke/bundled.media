/* esm.sh - esbuild bundle(rxjs@7.5.7/internal/operators/takeLast) deno production */
import{EMPTY as n}from"/v115/rxjs@7.5.7/deno/internal/observable/empty.js";import{operate as p}from"/v115/rxjs@7.5.7/deno/internal/util/lift.js";import{createOperatorSubscriber as m}from"/v115/rxjs@7.5.7/deno/internal/operators/OperatorSubscriber.js";function u(o){return o<=0?()=>n:p((f,t)=>{let e=[];f.subscribe(m(t,r=>{e.push(r),o<e.length&&e.shift()},()=>{for(let r of e)t.next(r);t.complete()},void 0,()=>{e=null}))})}export{u as takeLast};
//# sourceMappingURL=takeLast.js.map