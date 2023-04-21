/* esm.sh - esbuild bundle(rxjs@7.5.7/internal/util/UnsubscriptionError) deno production */
import{createErrorClass as t}from"/v115/rxjs@7.5.7/deno/internal/util/createErrorClass.js";var p=t(i=>function(r){i(this),this.message=r?`${r.length} errors occurred during unsubscription:
${r.map((n,s)=>`${s+1}) ${n.toString()}`).join(`
  `)}`:"",this.name="UnsubscriptionError",this.errors=r});export{p as UnsubscriptionError};
//# sourceMappingURL=UnsubscriptionError.js.map