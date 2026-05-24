import { signal, computed } from '@preact/signals'
import type { Fact } from '../data/facts'
import { allFacts, factKey } from '../data/facts'
import { getDistractorPool } from '../data/distractors'
import { shuffle, pickN } from '../lib/shuffle'
import { currentProfile, updateBest } from './profiles'

export const CORRECTION_MS = 3000

// Timing
export const startedAtMs = signal<number | null>(null)
export const elapsedMs = signal<number>(0)

// Deck / progress
export const deck = signal<Fact[]>([])
export const completed = signal<Set<string>>(new Set())

// Active question + correction window
export const currentQuestion = signal<{ fact: Fact; choices: number[] } | null>(null)
export const correction = signal<{ fact: Fact } | null>(null)

// Finish state
export const lastWasBest = signal<boolean>(false)

export const isDone = computed(
  () => deck.value.length === 0 && currentQuestion.value === null && correction.value === null,
)

let correctionTimeoutId: number | null = null

function clearCorrectionTimer() {
  if (correctionTimeoutId !== null) {
    clearTimeout(correctionTimeoutId)
    correctionTimeoutId = null
  }
}

function buildChoices(fact: Fact): number[] {
  const pool = getDistractorPool(fact.a, fact.b).filter((n) => n !== fact.product)
  const distractors = pickN(pool, 3)
  // Choice order is shuffled per round so the correct slot varies.
  return shuffle([fact.product, ...distractors])
}

function markCompleted(a: number, b: number) {
  const next = new Set(completed.value)
  next.add(factKey(a, b))
  completed.value = next
}

function loadNextQuestion() {
  if (deck.value.length === 0) {
    currentQuestion.value = null
    return
  }
  const [fact, ...rest] = deck.value
  deck.value = rest
  currentQuestion.value = { fact, choices: buildChoices(fact) }
}

export function startSession() {
  clearCorrectionTimer()
  deck.value = shuffle(allFacts())
  completed.value = new Set()
  correction.value = null
  currentQuestion.value = null
  startedAtMs.value = Date.now()
  elapsedMs.value = 0
  lastWasBest.value = false
  loadNextQuestion()
}

export function submitAnswer(choice: number): 'correct' | 'wrong' | 'locked' {
  if (correction.value !== null) return 'locked'
  const cur = currentQuestion.value
  if (!cur) return 'locked'

  if (choice === cur.fact.product) {
    markCompleted(cur.fact.a, cur.fact.b)
    loadNextQuestion()
    return 'correct'
  }

  // Wrong: lock input, surface correction, reshuffle missed fact into back half,
  // advance after CORRECTION_MS.
  correction.value = { fact: cur.fact }
  reinsertIntoBackHalf(cur.fact)
  correctionTimeoutId = window.setTimeout(() => {
    correctionTimeoutId = null
    correction.value = null
    loadNextQuestion()
  }, CORRECTION_MS)
  return 'wrong'
}

function reinsertIntoBackHalf(fact: Fact) {
  const remaining = deck.value
  const backHalfStart = Math.floor(remaining.length / 2)
  const insertAt =
    backHalfStart + Math.floor(Math.random() * (remaining.length - backHalfStart + 1))
  deck.value = [...remaining.slice(0, insertAt), fact, ...remaining.slice(insertAt)]
}

export function finishSession(): number {
  clearCorrectionTimer()
  startedAtMs.value = null
  currentQuestion.value = null
  correction.value = null
  const ms = elapsedMs.value
  const p = currentProfile()
  if (p) {
    const isBest = !p.bestMs || ms < p.bestMs
    lastWasBest.value = isBest
    if (isBest) updateBest(p.name, ms)
  } else {
    lastWasBest.value = false
  }
  return ms
}
