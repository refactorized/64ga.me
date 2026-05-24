export type Fact = { a: number; b: number; product: number }

export function allFacts(): Fact[] {
  const out: Fact[] = []
  for (let a = 2; a <= 9; a++) {
    for (let b = 2; b <= 9; b++) {
      out.push({ a, b, product: a * b })
    }
  }
  return out
}

export function factKey(a: number, b: number): string {
  return `${a},${b}`
}
