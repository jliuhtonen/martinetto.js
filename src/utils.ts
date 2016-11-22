export function collectFirst<A, B>(transformation: (a: A) => B, condition: (b: B) => boolean, xs: A[]): B | undefined {
  for (let i = 0; i < xs.length; ++i) {
    const transformed = transformation(xs[i])
    if(condition(transformed) === true) {
      return transformed
    }
  }

  return undefined
}

export function removeTrailingSlash(str: string): string {
  return str.replace(/(^.+)\/$/, '$1')
}
