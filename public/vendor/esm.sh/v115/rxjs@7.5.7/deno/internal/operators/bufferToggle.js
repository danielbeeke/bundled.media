/* esm.sh - esbuild bundle(rxjs@7.5.7/internal/operators/bufferToggle) deno production */
import{Subscription as b}from"/v115/rxjs@7.5.7/deno/internal/Subscription.js";import{operate as a}from"/v115/rxjs@7.5.7/deno/internal/util/lift.js";import{innerFrom as i}from"/v115/rxjs@7.5.7/deno/internal/observable/innerFrom.js";import{createOperatorSubscriber as f}from"/v115/rxjs@7.5.7/deno/internal/operators/OperatorSubscriber.js";import{noop as m}from"/v115/rxjs@7.5.7/deno/internal/util/noop.js";import{arrRemove as h}from"/v115/rxjs@7.5.7/deno/internal/util/arrRemove.js";function v(p,u){return a((c,o)=>{let r=[];i(p).subscribe(f(o,e=>{let t=[];r.push(t);let n=new b,s=()=>{h(r,t),o.next(t),n.unsubscribe()};n.add(i(u(e)).subscribe(f(o,s,m)))},m)),c.subscribe(f(o,e=>{for(let t of r)t.push(e)},()=>{for(;r.length>0;)o.next(r.shift());o.complete()}))})}export{v as bufferToggle};
//# sourceMappingURL=bufferToggle.js.map