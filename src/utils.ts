export function pathWithoutPrefix(path: string, prefix: string): string {
  const pathHasPrefix = path.indexOf(prefix) === 0
  return pathHasPrefix ? path.substring(prefix.length) : path
}

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
