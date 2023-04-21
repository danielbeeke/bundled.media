/* esm.sh - esbuild bundle(rxjs@7.5.7/internal/util/pipe) deno production */
import{identity as n}from"/v115/rxjs@7.5.7/deno/internal/util/identity.js";function c(...r){return p(r)}function p(r){return r.length===0?n:r.length===1?r[0]:function(e){return r.reduce((t,i)=>i(t),e)}}export{c as pipe,p as pipeFromArray};
//# sourceMappingURL=pipe.js.map