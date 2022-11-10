import { BundledMedia } from './BundledMedia.js'
import { html, render } from 'https://esm.sh/uhtml'

const createSelectStream = async (url) => {
  const wrapper = document.createElement('div')
  
  const items = await fetch(url)
} 

// const bundledMedia = new BundledMedia('http://localhost:8080')

// const results = await bundledMedia.search({
//   text: '',
//   types: [],
//   categories: [],
//   sources: [],
//   langCode: ''
// })

// results.subscribe(console.log)

const types = createSelectStream('https://bundled.media/types')