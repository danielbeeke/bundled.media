import { html } from "https://esm.sh/uhtml/async"
import { JSONLD } from 'https://taisukef.github.io/jsonld-es/JSONLD.js'
import './misc/json-viewer.ts'
import Hls from "https://esm.sh/hls.js"

const schema = (suffix: string = '') => 'http://schema.org/' + suffix

const widgets = [
  {
    applies: (url: string) => {
      return url.match(/.png$|.jpg$|.jpeg$/gi)
    },
    template (url: string) {
      return html`<img src=${`//images.mediaworks.global/?url=${url}&w=1200`} />`
    }
  },
  {
    applies: (url: string) => {
      return url.match(/.mp4/gi)
    },
    template (url: string) {
      return html`<video controls autoplay src=${url} />`
    }
  },
  {
    applies: (url: string) => {
      return url.includes('vimeo.com/')
    },
    template (url: string) {
      const id = url.split('/').pop()
      return html`<iframe src=${`https://player.vimeo.com/video/${id}`} frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`
    }
  },
  {
    applies: (url: string) => {
      return url.includes('youtube.com/')
    },
    template (url: string) {
      const id = url.split('v=').pop()
      return html`<iframe src=${`https://www.youtube.com/embed/${id}?si=WMmJvpTJVDHtp3I9`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
    }
  },
  {
    applies: (url: string) => {
      return url.endsWith('.pdf') || 
      url.includes('https://bibles.org/bible/') ||
      url.startsWith('https://arc.gt/') && url.endsWith('#viewer') ||
      url.includes('/videos/watch/')
    },
    template (url: string) {
      return html`<iframe class="viewer" src=${url}></iframe>`
    }
  },
  {
    applies: (url: string) => {
      return url.includes('m3u8')
    },
    template (url: string) {
      return html`<video ref=${(video: HTMLVideoElement) => {
        console.log(Hls.isSupported())
        if (Hls.isSupported()) {
          const hls = new Hls()
          hls.loadSource(url)
          hls.attachMedia(video)
        }
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url
        }
      }} controls autoplay />`
    }
  }
]

export const model = async (selectedCardExpanded: any, closeCallback: any) => {
    const selectedCardCompacted = await JSONLD.compact(selectedCardExpanded, {
        "@vocab": "http://schema.org/"
    })

    const urls = selectedCardExpanded[schema('url')].map((item: any) => item['@value'])

    let output = ''

    for (const url of urls) {
      for (const widget of widgets) {
        if (widget.applies(url)) {
          output = widget.template(url)
        }
      }  
    }

    return html`
    <div class="modal-backdrop fade show" onClick=${closeCallback}></div>
    <div class="modal fade show" style="display: block;">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          ${selectedCardCompacted ? html`
          <div class="modal-header">
            <h5 class="modal-title">${selectedCardExpanded['http://schema.org/name']?.[0]['@value'] ?? ''}</h5>
            <button type="button" class="btn-close" onClick=${closeCallback}></button>
          </div>
          <div class="modal-body">
            ${output}
            <details open=${!output ? true : null}>
              <summary>Inspect data</summary>
              <json-viewer data=${JSON.stringify(selectedCardCompacted)}></json-viewer>
            </details>
          </div>
          ` : null}
        </div>
      </div>
    </div>
    `
}