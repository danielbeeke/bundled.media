/* esm.sh - esbuild bundle(rxjs@7.5.7/internal/util/lift) deno production */
import{isFunction as e}from"/v115/rxjs@7.5.7/deno/internal/util/isFunction.js";function o(t){return e(t?.lift)}function l(t){return r=>{if(o(r))return r.lift(function(n){try{return t(n,this)}catch(i){this.error(i)}});throw new TypeError("Unable to lift unknown Observable type")}}export{o as hasLift,l as operate};
//# sourceMappingURL=lift.js.map