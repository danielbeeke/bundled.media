const icons: Map<string, string | Promise<string>> = new Map()
export const getIcon = (path: string) => {

  if (!icons.has(path)) {
    const promise = fetch(path).then(response => response.text()).then(svgData => {
      icons.set(path, svgData)
      return svgData
    })

    icons.set(path, promise)
  }

  return (element: HTMLElement) => {
    const icon = icons.get(path)
    if (icon instanceof Promise) {
      icon.then((resolvedIcon: string) => {
        element.innerHTML = resolvedIcon
      })
    }
    else if (typeof icon === 'string') {
      element.innerHTML = icon
    }
  }
}