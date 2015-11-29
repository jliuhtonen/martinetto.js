export function and(arr) {
  return arr.reduce((r, x) => r && x, true)
}

export function zip(a1, a2) {
  const times = a1.length >= a2.length ? a1.length : a2.length
  const zipped = []

  for (let i = 0; i < times; ++i) {
    zipped.push([a1[i], a2[i]])
  }

  return zipped
}
