/* esm.sh - esbuild bundle(bcp47-picker@1.0.14/init) deno production */
import{Hole as K,render as U,html as c}from"/v117/uhtml@3.1.0/deno/uhtml.mjs";import G from"/v117/flexsearch@0.7.31/deno/dist/module/index.js";import{encode as J}from"/v117/flexsearch@0.7.31/deno/dist/module/lang/latin/simple.js";import{parse as y,stringify as x}from"/v117/bcp-47@2.1.0/deno/bcp-47.mjs";import{iso15924 as Q}from"/v117/iso-15924@3.1.0/deno/iso-15924.mjs";import{iso31661 as X}from"/v117/iso-3166@4.2.0/deno/iso-3166.mjs";import{iso6393 as Y}from"/v117/iso-639-3@3.0.1/deno/iso-639-3.mjs";import{unM49 as Z}from"/v117/un-m49@2.1.0/deno/un-m49.mjs";import{bcp47Normalize as f}from"/v117/bcp-47-normalize@2.2.0/deno/bcp-47-normalize.mjs";import{shouldPolyfill as _}from"/v117/@formatjs/intl-listformat@7.2.1/deno/should-polyfill.js";function R(){return R=Object.assign?Object.assign.bind():function(i){for(var h=1;h<arguments.length;h++){var l=arguments[h];for(var p in l)Object.prototype.hasOwnProperty.call(l,p)&&(i[p]=l[p])}return i},R.apply(this,arguments)}var ee={x:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>',gearFill:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear-fill" viewBox="0 0 16 16"><path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/></svg>',chevronExpand:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"/></svg>',chevronContract:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-contract" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 13.854a.5.5 0 0 0 .708 0L8 10.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708zm0-11.708a.5.5 0 0 1 .708 0L8 5.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708z"/></svg>',plus:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>'},C=i=>new K("html",[ee[i].replace('class="','class="icon ')],[]),I=(i,h)=>{var l;return(l=i.find(p=>p[0]===h))==null?void 0:l[1]},te={sources:["https://bcp47.danielbeeke.nl/data/lmt.json","https://bcp47.danielbeeke.nl/data/iso-639-3.json","https://bcp47.danielbeeke.nl/data/rolv2.json"],alternativeHtmlName:"bcp47-picker",theme:{valueInput:"form-control",valueContainer:"input-group",base:"bootstrap",valueContainerAdvanced:"form-floating mb-3",showPartsButton:"btn btn-outline-secondary",showSearchButton:"btn btn-outline-secondary",backButton:"btn btn-outline-secondary",results:"list-group",resultItem:"list-group-item list-group-item-action d-flex gap-2",code:"badge rounded-pill bg-light text-dark",resultCount:"input-group-text",collapseButton:"btn btn-outline-secondary",expandButton:"btn btn-outline-secondary",loading:"loading",advanced:"mt-4",advancedTitle:"mb-2",valueItem:"item",addItemButton:"btn btn-outline-secondary",alternativeNames:"text-truncate text-muted fst-italic fw-light pe-1",name:"flex-nowrap bcp47-name-span"},forceCanonical:!0},k,A,L,V,E,M,j,B,S,O,z,P,D,H,q,u=i=>i,T=[...X.map(i=>[i.alpha2,`${i.name} (ISO 31661)`]),...Z.map(i=>[i.code,`${i.name} (unM49)`])],F=Y.map(i=>{var h;return[(h=i.iso6391)!=null?h:i.iso6393,i.name]}),N=Q.map(i=>[i.code,i.name]),de=async(i={})=>{var h;await async function(v){let t=_("en");t&&(await import("/v117/@formatjs/intl-listformat@7.2.1/deno/polyfill-force.js"),await import(`@formatjs/intl-listformat/locale-data/${t}`))}();let l=R({},te);for(let[v,t]of Object.entries(i))l[v]=t;let p=Object.fromEntries(await Promise.all(l.sources.map(async v=>[v,await fetch(v).then(t=>t.json()).then(t=>new Map(t))]))),$=new G({preset:"match",tokenize:"forward",cache:!0,encode:J});setTimeout(async()=>{for(let[v,t]of Object.entries(p))for(let[e,[a,s]]of t.entries()){let n=0;if($.add([v,e,n++],a),$.add([v,e,n++],e),s)for(let o of s)$.add([v,e,n++],o)}},100);class W extends HTMLElement{constructor(...t){super(...t),this.searchResults=[],this.searchIndex=void 0,this.selectedValue=void 0,this.values=[],this.value=void 0,this.showIndividualComponents=!1,this.showAdvanced=!1,this.isEditing=!1,this.maxItems=20,this.observer=!1,this.defaultMaxItems=20,this.bcp47Index=new Map,this.focusedResult=0}async connectedCallback(){var t,e,a,s;this.values=(t=(e=this.getAttribute("value"))==null?void 0:e.split(/,| /g))!=null?t:[],this.selectedValue=(a=(s=this.values)==null?void 0:s[0])!=null?a:"",this.classList.add("bcp47-picker"),this.bcp47Index.size||(l.theme.base&&this.classList.add(l.theme.base),await this.render())}async render(t=""){return U(this,this.template(t))}async search(t){return(await $.search(t)).map(([e,a])=>[a,p[e].get(a.toString())]).filter(((e="")=>(a,s,n)=>{if(e){let o=n.find(m=>m[e]===a[e]);return n.indexOf(o)===s&&a}return n.indexOf(a)===s&&a})("0")).sort((e,a)=>{let s=f(e[0]),n=f(a[0]);return s.length!==n.length?s.length-n.length:s.localeCompare(n)}).slice(0,this.maxItems)}template(t=""){let e=this.selectedValue?y(this.selectedValue):{language:null,extendedLanguageSubtags:[],script:null,region:null,variants:[],extensions:[],privateuse:[],irregular:null,regular:null};return c(k||(k=u`
        <div class=${0}>
          ${0}

          ${0}
        </div>

        ${0}

        ${0}
      `),`bcp47-value ${l.theme.valueContainer}`,this.selectedValue?this.valuesDisplay():this.emptyDisplay(),this.buttons(e),this.individualComponentsForm(e),this.resultsWrapper(t))}focus(){var t;(t=this.querySelector(".bcp47-search"))==null||t.focus()}label(t){let e;if(t){for(let s of Object.keys(p)){var a;e||(e=(a=p[s].get(x(t)))==null?void 0:a[0])}e||(e=this.getLabel(t))}return e}emptyDisplay(t=!1){var e=this;return c(A||(A=u`
        <input 
          placeholder=${0} 
          class=${0} 
          type='search' 
          onchange=${0}
          onkeydown=${0}
          onblur=${0} 
          />
      `),this.values.length===0?"Search for a language, region or dialect":"",`${t?"hide-borders":""} bcp47-search ${l.theme.valueInput}`,a=>{a.stopPropagation(),a.stopImmediatePropagation(),a.preventDefault()},async function(a){var s,n,o;let m=a.key.length===1&&a.key.match(/[a-z]/g)&&!a.ctrlKey,g=a.target.value+(m?a.key:"");e.searchResults=await e.search(g),a.key==="Backspace"&&g.length===0&&(e.values.pop(),e.selectedValue=e.values[0],e.value=e.values.join(","),e.dispatchEvent(new CustomEvent("change"))),a.key==="Escape"&&await e.setValue(null),a.key==="ArrowDown"&&(e.focusedResult++,e.focusedResult>e.maxItems&&e.focusedResult<e.searchResults.length&&await e.increaseVisibleResults()),a.key==="ArrowUp"&&e.focusedResult--,a.key==="Enter"&&(s=e.searchResults)!=null&&(n=s[e.focusedResult])!=null&&n[0]&&await e.setValue(e.searchResults[e.focusedResult][0]),e.focusedResult<0&&(e.focusedResult=0),e.focusedResult>=e.searchResults.length&&(e.focusedResult=e.searchResults.length-1),await e.render(g);let d=document.querySelector(".bcp47-results");if(d)if(m)d.scrollTop=0;else{var r;let b=Math.floor(d.clientHeight/d.children[0].clientHeight),w=Math.floor(e.focusedResult/b);(r=d.children[w*b])==null||r.scrollIntoView({behavior:"smooth"})}(o=e.querySelector(".bcp47-search"))==null||o.focus()},async function(a){var s;((s=a.relatedTarget)==null?void 0:s.closest(".bcp47-picker"))!==e&&(await e.setValue(null),await e.render())})}valuesDisplay(){var t=this;return c(L||(L=u`
        <div class=${0}>
          ${0}

          ${0}
        </div>


        ${0}
      `),`bcp47-value-wrapper ${l.theme.valueInput}`,this.values.map(e=>{let a=y(e);return c(V||(V=u`
            <div class=${0}>
              <span onclick=${0} class=${0}>
                ${0}
              </span>

              <span class=${0}>
                ${0}
              </span>
              
              <span class="bcp47-remove-value" onclick=${0}>${0}</span>
            </div>`),`bcp47-value-item ${l.theme.valueItem}`,()=>{this.selectedValue=e,this.render()},"bcp47-value-label "+(e===this.selectedValue?"active":""),this.label(a),`bcp47-value-bcp47 ${l.theme.code}`,e,async function(){var s;let n=t.values.find(o=>o===e);if(n){let o=t.values.indexOf(n);o!==-1&&t.values.splice(o,1)}t.selectedValue=t.values[0],t.value=(s=t.values.join(","))!=null?s:"",t.dispatchEvent(new CustomEvent("change")),await t.render(),t.querySelector(".bcp47-search").focus()},C("x"))}),this.hasAttribute("multiple")?this.emptyDisplay(!0):c(E||(E=u``)),this.searchResults.length?c(M||(M=u`
        <span class=${0}>
          ${0}
        </span>
        `),`search-results-count ${l.theme.resultCount}`,this.searchResults.length):null)}buttons(t){var e=this;return c(j||(j=u`

      ${0}

      <button type="button" class=${0} onclick=${0}>${0}</button>
      `),this.showIndividualComponents?c(B||(B=u`
      <button type="button" class=${0} onclick=${0}>${0}</button>
      `),`${this.showAdvanced?"active":""} ${this.showAdvanced?l.theme.collapseButton:l.theme.expandButton}`,async function(){e.showAdvanced=!e.showAdvanced,await e.render()},C(this.showAdvanced?"chevronContract":"chevronExpand")):null,`button ${this.showIndividualComponents?"active":""} ${l.theme.showPartsButton}`,async function(){e.showIndividualComponents=!e.showIndividualComponents,e.showIndividualComponents&&(t.privateuse.length||t.extensions.length)&&(e.showAdvanced=!0),await e.render()},C("gearFill"))}individualComponentsForm(t){var e,a,s;return this.showIndividualComponents&&!this.searchResults.length?c(S||(S=u`
      <div class=${0}>
        <h6 class=${0}>Manual configuration</h6>

        <div class=${0}>
          ${0}
        </div>

        ${0}

        <div class=${0}>
          ${0}
        </div>

        <div class=${0}>
          ${0}
        </div>

        ${0}
        
      </div>
      `),`bcp47-advanced ${l.theme.advanced}`,`bcp47-advanced-title ${l.theme.advancedTitle}`,`bcp47-language bcp47-current-value-part ${l.theme.valueContainerAdvanced}`,this.autoComplete("Language",F,t,"language"),this.showAdvanced?c(O||(O=u`
        <div class=${0}>
          <input disabled=${0} placeholder="." class=${0} type="text" .value=${0} maxlength="3" />
          <label>Extended language subtags</label>
        </div>
        `),`bcp47-region bcp47-current-value-part ${l.theme.valueContainerAdvanced}`,!t.language||null,l.theme.valueInput,(e=t.extendedLanguageSubtags[0])!=null?e:""):null,`bcp47-script bcp47-current-value-part ${l.theme.valueContainerAdvanced}`,this.autoComplete("Script",N,t,"script",!t.language),`bcp47-region bcp47-current-value-part ${l.theme.valueContainerAdvanced}`,this.autoComplete("Region",T,t,"region",!t.language),this.showAdvanced?c(z||(z=u`
        <div class=${0}>
            <input disabled=${0} placeholder="." type="text" class=${0} .value=${0} />
            <label>Extension subtags</label>
        </div>

        <div class=${0}>
          <input disabled=${0} type="text" placeholder="." class=${0} .value=${0} />
          <label>Private use subtags</label>
        </div>
      `),`bcp47-region bcp47-current-value-part-normal ${l.theme.valueContainerAdvanced}`,!t.language||null,l.theme.valueInput,(a=t.extensions[0])!=null?a:"",`bcp47-region bcp47-current-value-part-normal ${l.theme.valueContainerAdvanced}`,!t.language||null,l.theme.valueInput,(s=t.privateuse[0])!=null?s:""):null):null}getLabel(t){typeof t=="string"&&(t=y(t));let e="",a=t.language?I(F,t.language):null,s=t.region?I(T,t.region):null,n=t.script?I(N,t.script):null;return a&&s?e=`${a} as spoken in ${s}`:a&&n?e=`${a} written with ${n}`:a&&(e=a),e}observerCallback(t){var e=this;t.forEach(async function(a){if(a.intersectionRatio){let s=document.querySelector(".bcp47-results");s.clientHeight<s.scrollHeight&&e.maxItems<e.searchResults.length&&await e.increaseVisibleResults()}})}async increaseVisibleResults(){this.maxItems=this.maxItems+this.defaultMaxItems,await this.render()}autoComplete(t,e,a,s,n=!1){var o,m,g,d;return c(P||(P=u`
        <input disabled=${0} placeholder="." class=${0} onchange=${0} list=${0} autocomplete="off" .value=${0}>
        <label>${0}</label>
        <datalist id=${0}>
          ${0}
        </datalist>
        <span class=${0}>
          ${0}
          <span class=${0}>${0}</span>
        </span>
      `),!!n||null,l.theme.valueInput,r=>{r.stopPropagation(),r.stopImmediatePropagation(),r.preventDefault();let b=x(a);a[s]=r.target.value,this.values=this.values.filter(w=>w!==b),this.setValue(x(a))},s,(o=a[s])!=null?o:"",t,s,e.map(([r,b])=>c(D||(D=u`<option value=${0} ?selected=${0}>${0}</option>`),r,r===a[s],b)),`bcp47-current-value-part-value ${l.theme.partValue}`,a[s]?(m=e.find(r=>r[0]===a[s]))==null||(g=m[1])==null||(d=g.split(" ("))==null?void 0:d[0]:null,l.theme.code,a[s])}resultsWrapper(t=""){return this.searchResults.length?c(H||(H=u`
      <div class=${0}>
      ${0}
        <div ref=${0} class="bcp47-observer"></div>
        <div class="bcp47-observer-spacer" style=${0}></div>
      </div>
    `),`bcp47-results ${l.theme.results}`,this.searchResults.map((e,a)=>this.resultItem(e,a,t)),e=>{this.observer=new IntersectionObserver(this.observerCallback.bind(this),{root:document.querySelector(".bcp47-results"),rootMargin:"0px",threshold:1}),this.observer.observe(e)},`--items: ${41*(this.searchResults.length-this.maxItems)}px`):null}resultItem([t,[e,a]],s,n=""){var o=this;a||(a=[]);let m=a.filter(r=>r.toLocaleLowerCase().includes(n.toLocaleLowerCase())),g=a.filter(r=>!m.includes(r)),d=new Intl.ListFormat("en",{style:"long",type:"conjunction"}).format([...m,...g]);return l.forceCanonical&&(t=f(t,{forgiving:!0})),c(q||(q=u`
      <button type="button" class=${0} onclick=${0}>
        <span class=${0}>${0}</span>
        <span class=${0}>${0}</span>
        <span class=${0} title=${0}>${0}</span>
      </button>`),`bcp47-result ${l.theme.resultItem} ${s===this.focusedResult?"active":""}`,async function(){o.setValue(t)},`bcp47-name ${l.theme.name}`,e,`bcp47-code ${l.theme.code}`,t,`bcp47-alternative-names ${l.theme.alternativeNames}`,d,d)}async setValue(t){l.forceCanonical&&t&&(t=f(t,{forgiving:!0})),t&&(this.selectedValue=t,this.values.push(t)),this.value=this.values.join(","),this.isEditing=!1,this.searchResults=[],this.maxItems=this.defaultMaxItems,this.dispatchEvent(new CustomEvent("change")),await this.render();let e=this.querySelector(".bcp47-search");e&&(e.value="",e.focus())}}customElements.define((h=l.alternativeHtmlName)!=null?h:"bcp47-picker",W)};export{de as init};
//# sourceMappingURL=init.js.map