/* esm.sh - esbuild bundle(rxjs@7.5.7/internal/Subscription) deno production */
import{isFunction as n}from"/v115/rxjs@7.5.7/deno/internal/util/isFunction.js";import{UnsubscriptionError as a}from"/v115/rxjs@7.5.7/deno/internal/util/UnsubscriptionError.js";import{arrRemove as l}from"/v115/rxjs@7.5.7/deno/internal/util/arrRemove.js";var e=class{constructor(i){this.initialTeardown=i,this.closed=!1,this._parentage=null,this._finalizers=null}unsubscribe(){let i;if(!this.closed){this.closed=!0;let{_parentage:s}=this;if(s)if(this._parentage=null,Array.isArray(s))for(let t of s)t.remove(this);else s.remove(this);let{initialTeardown:c}=this;if(n(c))try{c()}catch(t){i=t instanceof a?t.errors:[t]}let{_finalizers:f}=this;if(f){this._finalizers=null;for(let t of f)try{h(t)}catch(o){i=i??[],o instanceof a?i=[...i,...o.errors]:i.push(o)}}if(i)throw new a(i)}}add(i){var s;if(i&&i!==this)if(this.closed)h(i);else{if(i instanceof e){if(i.closed||i._hasParent(this))return;i._addParent(this)}(this._finalizers=(s=this._finalizers)!==null&&s!==void 0?s:[]).push(i)}}_hasParent(i){let{_parentage:s}=this;return s===i||Array.isArray(s)&&s.includes(i)}_addParent(i){let{_parentage:s}=this;this._parentage=Array.isArray(s)?(s.push(i),s):s?[s,i]:i}_removeParent(i){let{_parentage:s}=this;s===i?this._parentage=null:Array.isArray(s)&&l(s,i)}remove(i){let{_finalizers:s}=this;s&&l(s,i),i instanceof e&&i._removeParent(this)}};e.EMPTY=(()=>{let r=new e;return r.closed=!0,r})();var p=e.EMPTY;function d(r){return r instanceof e||r&&"closed"in r&&n(r.remove)&&n(r.add)&&n(r.unsubscribe)}function h(r){n(r)?r():r.unsubscribe()}export{p as EMPTY_SUBSCRIPTION,e as Subscription,d as isSubscription};
//# sourceMappingURL=Subscription.js.map