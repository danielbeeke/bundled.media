/* esm.sh - esbuild bundle(rxjs@7.5.7/internal/scheduled/scheduleArray) deno production */
import{Observable as o}from"/v115/rxjs@7.5.7/deno/internal/Observable.js";function c(t,n){return new o(e=>{let l=0;return n.schedule(function(){l===t.length?e.complete():(e.next(t[l++]),e.closed||this.schedule())})})}export{c as scheduleArray};
//# sourceMappingURL=scheduleArray.js.map