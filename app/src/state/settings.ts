import { signal } from '@preact/signals'

export type AnswerLayout = 'diamond' | 'inverted-t' | 'square'

const KEY_LAYOUT = 'factor64_layout'
const VALID_LAYOUTS: AnswerLayout[] = ['diamond', 'inverted-t', 'square']

function loadLayout(): AnswerLayout {
  try {
    const v = localStorage.getItem(KEY_LAYOUT)
    if (VALID_LAYOUTS.includes(v as AnswerLayout)) return v as AnswerLayout
  } catch {}
  return 'diamond'
}

export const answerLayout = signal<AnswerLayout>(loadLayout())

export function setAnswerLayout(l: AnswerLayout) {
  answerLayout.value = l
  try {
    localStorage.setItem(KEY_LAYOUT, l)
  } catch (e) {
    console.error('failed to persist layout', e)
  }
}

export function keyboardEnabledFor(l: AnswerLayout): boolean {
  return l !== 'square'
}
