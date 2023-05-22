/* esm.sh - esbuild bundle(rxjs@7.5.7/internal/Observable) deno production */
import{SafeSubscriber as b,Subscriber as h}from"/v115/rxjs@7.5.7/deno/internal/Subscriber.js";import{isSubscription as a}from"/v115/rxjs@7.5.7/deno/internal/Subscription.js";import{observable as p}from"/v115/rxjs@7.5.7/deno/internal/symbol/observable.js";import{pipeFromArray as l}from"/v115/rxjs@7.5.7/deno/internal/util/pipe.js";import{config as S}from"/v115/rxjs@7.5.7/deno/internal/config.js";import{isFunction as u}from"/v115/rxjs@7.5.7/deno/internal/util/isFunction.js";import{errorContext as _}from"/v115/rxjs@7.5.7/deno/internal/util/errorContext.js";var o=class{constructor(r){r&&(this._subscribe=r)}lift(r){let t=new o;return t.source=this,t.operator=r,t}subscribe(r,t,n){let s=w(r)?r:new b(r,t,n);return _(()=>{let{operator:e,source:c}=this;s.add(e?e.call(s,c):c?this._subscribe(s):this._trySubscribe(s))}),s}_trySubscribe(r){try{return this._subscribe(r)}catch(t){r.error(t)}}forEach(r,t){return t=f(t),new t((n,s)=>{let e=new b({next:c=>{try{r(c)}catch(m){s(m),e.unsubscribe()}},error:s,complete:n});this.subscribe(e)})}_subscribe(r){var t;return(t=this.source)===null||t===void 0?void 0:t.subscribe(r)}[p](){return this}pipe(...r){return l(r)(this)}toPromise(r){return r=f(r),new r((t,n)=>{let s;this.subscribe(e=>s=e,e=>n(e),()=>t(s))})}};o.create=i=>new o(i);function f(i){var r;return(r=i??S.Promise)!==null&&r!==void 0?r:Promise}function d(i){return i&&u(i.next)&&u(i.error)&&u(i.complete)}function w(i){return i&&i instanceof h||d(i)&&a(i)}export{o as Observable};
//# sourceMappingURL=Observable.js.map