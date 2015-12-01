export function and(arr) {
  return arr.reduce((r, x) => r && x, true)
}

export function flatten(arr) {
  return arr.reduce((flattened, item) => flattened.concat(item), [])
}

export function flatMap(f, arr) {
  return flatten(arr.map(f))
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
