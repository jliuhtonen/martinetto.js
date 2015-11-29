export function and(arr) {
  return arr.reduce((r, x) => r && x, true)
}

export function zip(a1, a2, acc = []) {
  const [a1Head, ...a1Tail] = a1
  const [a2Head, ...a2Tail] = a2

  if(typeof a1Head === 'undefined' && typeof a2Head === 'undefined') {
    return acc
  } else {
    return zip(a1Tail, a2Tail, acc.concat([[a1Head, a2Head]]))
  }
}
