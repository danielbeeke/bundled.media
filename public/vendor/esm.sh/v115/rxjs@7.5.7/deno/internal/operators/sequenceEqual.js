/* esm.sh - esbuild bundle(rxjs@7.5.7/internal/operators/sequenceEqual) deno production */
import{operate as q}from"/v115/rxjs@7.5.7/deno/internal/util/lift.js";import{createOperatorSubscriber as S}from"/v115/rxjs@7.5.7/deno/internal/operators/OperatorSubscriber.js";function g(a,p=(n,e)=>n===e){return q((n,e)=>{let s=i(),f=i(),u=t=>{e.next(t),e.complete()},l=(t,b)=>{let r=S(e,c=>{let{buffer:o,complete:m}=b;o.length===0?m?u(!1):t.buffer.push(c):!p(c,o.shift())&&u(!1)},()=>{t.complete=!0;let{complete:c,buffer:o}=b;c&&u(o.length===0),r?.unsubscribe()});return r};n.subscribe(l(s,f)),a.subscribe(l(f,s))})}function i(){return{buffer:[],complete:!1}}export{g as sequenceEqual};
//# sourceMappingURL=sequenceEqual.js.map