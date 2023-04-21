/* esm.sh - esbuild bundle(flexsearch@0.7.31/dist/module/cache) deno production */
import"/v117/flexsearch@0.7.31/deno/dist/module/type.js";import{create_object as s,is_object as u}from"/v117/flexsearch@0.7.31/deno/dist/module/common.js";function c(e){this.limit=e!==!0&&e,this.cache=s(),this.queue=[]}var l=c;function q(e,h,t){u(e)&&(e=e.query);let i=this.cache.get(e);return i||(i=this.search(e,h,t),this.cache.set(e,i)),i}c.prototype.set=function(e,h){if(!this.cache[e]){let t=this.queue.length;t===this.limit?delete this.cache[this.queue[t-1]]:t++;for(let i=t-1;0<i;i--)this.queue[i]=this.queue[i-1];this.queue[0]=e}this.cache[e]=h},c.prototype.get=function(e){let h=this.cache[e];if(this.limit&&h){let t=this.queue.indexOf(e);if(t){let i=this.queue[t-1];this.queue[t-1]=this.queue[t],this.queue[t]=i}}return h},c.prototype.del=function(e){for(let h,t,i=0;i<this.queue.length;i++)t=this.queue[i],h=this.cache[t],h.includes(e)&&(this.queue.splice(i--,1),delete this.cache[t])};export{l as default,q as searchCache};
//# sourceMappingURL=cache.js.map