/* esm.sh - esbuild bundle(rxjs@7.5.7/internal/util/executeSchedule) deno production */
function l(e,d,i,u=0,s=!1){let c=d.schedule(function(){i(),s?e.add(this.schedule(null,u)):this.unsubscribe()},u);if(e.add(c),!s)return c}export{l as executeSchedule};
//# sourceMappingURL=executeSchedule.js.map