/* esm.sh - esbuild bundle(rxjs@7.5.7/internal/operators/merge) deno production */
import{operate as p}from"/v115/rxjs@7.5.7/deno/internal/util/lift.js";import{argsOrArgArray as i}from"/v115/rxjs@7.5.7/deno/internal/util/argsOrArgArray.js";import{mergeAll as n}from"/v115/rxjs@7.5.7/deno/internal/operators/mergeAll.js";import{popNumber as c,popScheduler as f}from"/v115/rxjs@7.5.7/deno/internal/util/args.js";import{from as u}from"/v115/rxjs@7.5.7/deno/internal/observable/from.js";function s(...r){let o=f(r),e=c(r,1/0);return r=i(r),p((m,t)=>{n(e)(u([m,...r],o)).subscribe(t)})}export{s as merge};
//# sourceMappingURL=merge.js.map