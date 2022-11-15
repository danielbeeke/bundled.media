import { init as initBcp47Picker } from 'https://unpkg.com/bcp47-picker@1.0.9/dist/init.modern.js';

initBcp47Picker({
  get sources () {
    return (async () => {
      return { 
        lmt: await fetch('https://bcp47.danielbeeke.nl/data/lmt.json')
          .then(response => response.json())
          .then((json) => new Map(json)), 
        grn: await fetch('https://bcp47.danielbeeke.nl/data/grn.json')
          .then(response => response.json())
          .then((json) => new Map(json)), 
      }
    })()
  },
  theme: {
    valueInput: 'form-control',
    valueContainer: 'input-group',
    base: 'bootstrap',
    valueContainerAdvanced: 'form-floating mb-3',
    showPartsButton: 'btn btn-outline-secondary hidden',
    showSearchButton: 'btn btn-outline-secondary',
    backButton: 'btn btn-outline-secondary',
    results: 'list-group',
    resultItem: 'list-group-item list-group-item-action',
    code: 'badge rounded-pill bg-light text-dark',
    resultCount: 'input-group-text',
    collapseButton: 'btn btn-outline-secondary',
    expandButton: 'btn btn-outline-secondary',
    loading: 'loading',
    advanced: 'mt-4',
    advancedTitle: 'mb-2'
  }
})
