const nonProcessedLinkAttr = 'data-no-routing'

export function linkClickListener (handler: (path: string) => void) {
  window.onclick = (e) => {
    if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey || e.button && e.button !== 0) {
      return
    }

    const htmlElement = e.target as HTMLElement

    const link = traverseWhile(shouldTraverseUp, n => n.parentNode as HTMLElement, htmlElement) as HTMLAnchorElement
    if (typeof link === 'undefined') {
      return
    }

    if (link.getAttribute(nonProcessedLinkAttr)) {
      return
    }

    e.preventDefault()
    handler(link.href)
    window.history.pushState({}, null, link.href)
  }
}

function shouldTraverseUp(elem: HTMLElement | undefined): boolean {
  if (!elem) {
    return false
  } else if (elem.localName !== 'a') {
    return true
  } else {
    const anchorElem = elem as HTMLAnchorElement
    return typeof anchorElem.href === 'undefined' || window.location.host !== elementHost(anchorElem)
  }
}

function elementHost(elem: HTMLAnchorElement): string | undefined {
  return elem.host || hrefHost(elem.href) || undefined
}

function hrefHost(href: string | undefined): string | undefined {
  if (typeof href === 'undefined') return undefined
  const matches = href.match(/^https?:\/\/(.*?)\//i)
  return matches.length > 1 ? matches[1] : undefined
}

function traverseWhile<A>(condition: (v: A) => boolean, next: (v: A) => A, initialValue: A): A | undefined {
  let value = initialValue

  while(condition(value)) {
    value = next(value)
  }

  return value
}