import { JsonViewer } from 'https://unpkg.com/@alenaksu/json-viewer@1.0.1/dist/JsonViewer.js?module'
import { html as litHtml, unsafeCSS } from 'https://unpkg.com/lit@2.2.6/index.js?module';

function isNode(obj: any) {
  return !!obj && !!obj.nodeType;
}

function getType(obj: any) {
  return obj === null ? 'null' : Array.isArray(obj) ? 'array' : typeof obj;
}

JsonViewer.prototype.renderValue = function (node: string, path: string) {
    const highlight = this.state.highlight;

    const isLink = typeof node === 'string' && node.startsWith('http')

    const value = isNode(node)
        ? node
        : litHtml` <span tabindex="0" class=${getType(node)}>${isLink ? litHtml` <a class="link string" target="_blank" href=${node}>${node}</a>` : JSON.stringify(node)}</span> `;

    return highlight !== null && path === highlight ? litHtml`<mark>${value}</mark>` : value;
}

JsonViewer.elementStyles.push(unsafeCSS`
  .key {
    font-weight: bold;
  }

  .collapsable::before {
    margin-right: 5px;
  }
  .link {
    color: var(--link-color);
  }
`)

customElements.define('json-viewer', JsonViewer)

