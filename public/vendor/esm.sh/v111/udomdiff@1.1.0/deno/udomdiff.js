/* esm.sh - esbuild bundle(udomdiff@1.1.0) deno production */
var u=(o,i,n,s,S)=>{let x=n.length,h=i.length,f=x,e=0,l=0,r=null;for(;e<h||l<f;)if(h===e){let t=f<x?l?s(n[l-1],-0).nextSibling:s(n[f-l],0):S;for(;l<f;)o.insertBefore(s(n[l++],1),t)}else if(f===l)for(;e<h;)(!r||!r.has(i[e]))&&o.removeChild(s(i[e],-1)),e++;else if(i[e]===n[l])e++,l++;else if(i[h-1]===n[f-1])h--,f--;else if(i[e]===n[f-1]&&n[l]===i[h-1]){let t=s(i[--h],-1).nextSibling;o.insertBefore(s(n[l++],1),s(i[e++],-1).nextSibling),o.insertBefore(s(n[--f],1),t),i[h]=n[f]}else{if(!r){r=new Map;let t=l;for(;t<f;)r.set(n[t],t++)}if(r.has(i[e])){let t=r.get(i[e]);if(l<t&&t<f){let c=e,w=1;for(;++c<h&&c<f&&r.get(i[c])===t+w;)w++;if(w>t-l){let d=s(i[e],0);for(;l<t;)o.insertBefore(s(n[l++],1),d)}else o.replaceChild(s(n[l++],1),s(i[e++],-1))}else e++}else o.removeChild(s(i[e++],-1))}return n};export{u as default};
//# sourceMappingURL=udomdiff.js.map