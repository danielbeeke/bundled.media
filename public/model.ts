import { html } from "https://esm.sh/uhtml@3.1.0"
import { JSONLD } from 'https://taisukef.github.io/jsonld-es/JSONLD.js'
import './misc/json-viewer.ts'

export const model = async (selectedCardExpanded: any, closeCallback: any) => {
    const selectedCardCompacted = await JSONLD.compact(selectedCardExpanded, {
        "@vocab": "http://schema.org/"
    })

    return html`
    <div class="modal-backdrop fade show" onClick=${closeCallback}></div>
    <div class="modal fade show" style="display: block;">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          ${selectedCardCompacted ? html`
          <div class="modal-header">
            <h5 class="modal-title">${selectedCardExpanded['http://schema.org/name'][0]['@value']}</h5>
            <button type="button" class="btn-close" onClick=${closeCallback}></button>
          </div>
          <div class="modal-body">
            <json-viewer data=${JSON.stringify(selectedCardCompacted)}></json-viewer>
          </div>
          ` : null}
        </div>
      </div>
    </div>
    `
}