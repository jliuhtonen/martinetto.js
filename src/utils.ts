export function findFirstTruthy<A, B>(items: Array<A>, fn: (a: A) => B): B {
  for(let i = 0; i < items.length; ++i) {
    const item = items[i]
    const fnVal = fn(item)

    if(fnVal) {
      return fnVal
    }
  }

  return null
}

export function removeTrailingSlash(str: string): string {
  return str.replace(/(^.+)\/$/, '$1')
}
