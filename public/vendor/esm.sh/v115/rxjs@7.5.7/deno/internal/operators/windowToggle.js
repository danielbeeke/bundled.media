/* esm.sh - esbuild bundle(rxjs@7.5.7/internal/operators/windowToggle) deno production */
import{Subject as a}from"/v115/rxjs@7.5.7/deno/internal/Subject.js";import{Subscription as d}from"/v115/rxjs@7.5.7/deno/internal/Subscription.js";import{operate as b}from"/v115/rxjs@7.5.7/deno/internal/util/lift.js";import{innerFrom as m}from"/v115/rxjs@7.5.7/deno/internal/observable/innerFrom.js";import{createOperatorSubscriber as c}from"/v115/rxjs@7.5.7/deno/internal/operators/OperatorSubscriber.js";import{noop as p}from"/v115/rxjs@7.5.7/deno/internal/util/noop.js";import{arrRemove as g}from"/v115/rxjs@7.5.7/deno/internal/util/arrRemove.js";function E(l,w){return b((f,e)=>{let o=[],i=r=>{for(;0<o.length;)o.shift().error(r);e.error(r)};m(l).subscribe(c(e,r=>{let t=new a;o.push(t);let n=new d,h=()=>{g(o,t),t.complete(),n.unsubscribe()},s;try{s=m(w(r))}catch(u){i(u);return}e.next(t.asObservable()),n.add(s.subscribe(c(e,h,p,i)))},p)),f.subscribe(c(e,r=>{let t=o.slice();for(let n of t)n.next(r)},()=>{for(;0<o.length;)o.shift().complete();e.complete()},i,()=>{for(;0<o.length;)o.shift().unsubscribe()}))})}export{E as windowToggle};
//# sourceMappingURL=windowToggle.js.map