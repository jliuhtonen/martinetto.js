export function flatten<A>(arr: Array<Array<A>>): Array<A> {
  return arr.reduce((flattened, item) => flattened.concat(item), [])
}

export function zip<A,B>(a1: Array<A>, a2: Array<B>): Array<[A, B]> {
  const times = a1.length >= a2.length ? a1.length : a2.length
  const zipped: Array<[A, B]> = []

  for (let i = 0; i < times; ++i) {
    zipped.push([a1[i], a2[i]])
  }

  return zipped
}

export function intersperse<A>(arr: Array<A>, elem: A): Array<A> {
  return arr.reduce((interspersed, item, index) => {
    const newItems = index === arr.length - 1 ? [item] : [item, elem]
    return interspersed.concat(newItems)
  }, [])
}

export function notEmpty<A>(enumerable: Array<A> | string): boolean {
  return enumerable.length > 0
}

export function pathWithoutPrefix(path: string, prefix: string): string {
  const pathHasPrefix = path.indexOf(prefix) === 0
  return pathHasPrefix ? path.substring(prefix.length) : path
}

export function splitAtFirst(strToSplit: string, splitter: string): string[] {
  const splitStrIdx = strToSplit.indexOf(splitter)

  if (splitStrIdx === -1) {
    return [strToSplit]
  } else {
    return [strToSplit.substring(0, splitStrIdx), strToSplit.substring(splitStrIdx + 1)]
  }

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
