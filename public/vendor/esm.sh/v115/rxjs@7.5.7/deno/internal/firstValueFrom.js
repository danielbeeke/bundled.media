/* esm.sh - esbuild bundle(rxjs@7.5.7/internal/firstValueFrom) deno production */
import{EmptyError as u}from"/v115/rxjs@7.5.7/deno/internal/util/EmptyError.js";import{SafeSubscriber as b}from"/v115/rxjs@7.5.7/deno/internal/Subscriber.js";function c(s,r){let i=typeof r=="object";return new Promise((e,o)=>{let t=new b({next:n=>{e(n),t.unsubscribe()},error:o,complete:()=>{i?e(r.defaultValue):o(new u)}});s.subscribe(t)})}export{c as firstValueFrom};
//# sourceMappingURL=firstValueFrom.js.map