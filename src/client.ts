const nonProcessedLinkAttr = 'data-no-routing'

export function historyListener<T>(onHistoryChange: (href: string, state: T | undefined) => void) {
  window.onpopstate = (event: PopStateEvent) => {
    onHistoryChange(document.location.href, event.state)
  }
}

export function linkClickListener (onClick: (href: string) => void) {
  window.onclick = (e) => {
    const link = linkToProcess(e)
    if (!link) {
      return
    }

    e.preventDefault()
    onClick(link.href)
  }
}

export function linkToProcess(e: MouseEvent): HTMLAnchorElement | undefined {
    if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey || e.button && e.button !== 0) {
      return undefined
    }

    const htmlElement = e.target as HTMLElement

    const link = traverseWhile(shouldTraverseUp, n => n && n.parentNode as HTMLElement, htmlElement) as HTMLAnchorElement
    if (typeof link === 'undefined' || link === null) {
      return undefined
    }

    if (link.getAttribute(nonProcessedLinkAttr)) {
      return undefined
    }

    return link
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
  return matches && matches.length > 1 ? matches[1] : undefined
}

function traverseWhile<A>(condition: (v: A) => boolean, next: (v: A) => A, initialValue: A): A | undefined {
  let value = initialValue

  while(condition(value)) {
    value = next(value)
  }

  return value
}
