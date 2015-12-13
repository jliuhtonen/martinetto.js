export function flatten(arr) {
  return arr.reduce((flattened, item) => flattened.concat(item), [])
}

export function zip(a1, a2) {
  const times = a1.length >= a2.length ? a1.length : a2.length
  const zipped = []

  for (let i = 0; i < times; ++i) {
    zipped.push([a1[i], a2[i]])
  }

  return zipped
}

export function intersperse(arr, elem) {
  return arr.reduce((interspersed, item, index) => {
    const newItems = index === arr.length - 1 ? [item] : [item, elem]
    return interspersed.concat(newItems)
  }, [])
}

export function notEmpty(enumerable) {
  return enumerable.length > 0
}

export function pathWithoutPrefix(path, prefix) {
  const pathHasPrefix = path.startsWith(prefix)
  return pathHasPrefix ? path.substring(prefix.length) : path
}
