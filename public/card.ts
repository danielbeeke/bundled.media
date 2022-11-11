import { html } from 'https://esm.sh/uhtml'
import { getIcon } from './getIcon.ts'
const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });
import { parse } from 'https://cdn.skypack.dev/bcp-47@2?dts'

const url = new URL(location.toString())

export const card = (item: any) => {
  const type: string = item['@type'][0].split(/\/|:|#/g).pop().toLowerCase()
  const urls = item['http://schema.org/url']?.map((item: any) => item?.['@value'])
  const names = item['http://schema.org/name']?.map((item: any) => item?.['@value'])
  const descriptions = item['http://schema.org/description']?.map((item: any) => item?.['@value']) ?? []
  const authors = item['http://schema.org/author']?.flatMap((item: any) => item['http://schema.org/name']?.map((item: any) => item?.['@value']))

  const thumbnail = item['http://schema.org/thumbnail']?.[0]?.['http://schema.org/url']?.[0]?.['@value']
  let image = thumbnail

  if (!image && type === 'book') {
    image = 'https://images.unsplash.com/photo-1499652848871-1527a310b13a'
  }

  let video = ''
  if (!image) {
    video = urls.find((url: string) => url.endsWith('.mp4'))
    image = `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}/thumb/${video}`
  }

  const mediaIcon = html`<div class="type-icon" ref=${getIcon(`/images/${type}.svg`)}></div>`

  const shouldShowMultiLingual = !url.searchParams.get('langCode') && item['http://bundled.media/multilingualItems']?.[0]?.['@value']

  const langCodes: Set<string> = new Set(item['http://schema.org/inLanguage']?.[0]?.['@value'].split('-x-mltlngl-'))
    
  const bcp47Picker = document.createElement('bcp47-picker')

  const languageLabels = [...langCodes].map((langCode: string) => { 
    /** @ts-ignore */
    const label = bcp47Picker?.label(parse(langCode)) 
    return label ? label : langCode
  })
    .filter(Boolean)

  const languageLabel = html`
    <span class="badge rounded-pill text-bg-light language-label">
      ${shouldShowMultiLingual ? 
        html`<div class="icon"  data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="This item is available in a lot of languages. Please filter to a language to see if this item is available." ref=${getIcon(`/images/translate.svg`)}></div>` : 
        languageLabels.join(' & ')
      }
    </span>
  `

  const imageFooter = html`${mediaIcon}${languageLabel}`

  return html`<div onclick=${async () => {
  }} data-bs-toggle="modal" data-bs-target="#infoModal" 
    class=${`card ${type} ${!thumbnail && type === 'book' ? 'bible' : ''}`}>
    ${image ? html`
      <div class="image-wrapper">
        ${imageFooter}
        <img loading="lazy" ref=${(element: HTMLImageElement) => {
          const url = ['localhost'].some(noImage => image.includes(noImage)) ? image : `//images.mediaworks.global/?url=${image}&h=200${type === 'videoobject' ? '' : ''}`
          element.classList.add('loading')

          element.src = ''
          requestAnimationFrame(() => {
            element.onload = () => {
              element.classList.remove('loading')
            }
            element.src = url
          })
        }} class=${`image loading`} alt=${item.name}>            
      </div>
    ` : null}

    ${!image && video ? html`
        <div class="image-wrapper">
        ${imageFooter}

          <video class="image">
            <source src=${`${video}#t=10`}>
          </video>
        </div>
    ` : null}
    <div class="card-body">
      <h5 class="card-title">${names[0]}</h5>
      ${authors?.length ? html`
        <small class="card-sub-title d-block mb-2">${formatter.format(authors.map((author: string) => author))}</small>            
      ` : null}
      <p class="card-text">${descriptions[0]}</p>
    </div>
  </div>`
}