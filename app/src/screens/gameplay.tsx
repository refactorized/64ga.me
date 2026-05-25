import { useEffect } from 'preact/hooks'
import { BackgroundGrid } from '../components/grid'
import {
  elapsedMs,
  startedAtMs,
  currentQuestion,
  correction,
  isDone,
  submitAnswer,
  finishSession,
} from '../state/session'
import { answerLayout, keyboardEnabledFor } from '../state/settings'
import { goTo } from '../state/screen'
import { formatMs } from '../lib/format'

// choices[0] = N (top), [1] = E (right), [2] = S (bottom), [3] = W (left)
// In layouts without N/E/S/W positions (square), keyboard input is disabled
// but the same index → button mapping is used for click handlers.
const KEY_TO_INDEX: Record<string, number> = {
  ArrowUp: 0,
  w: 0,
  W: 0,
  ArrowRight: 1,
  d: 1,
  D: 1,
  ArrowDown: 2,
  s: 2,
  S: 2,
  ArrowLeft: 3,
  a: 3,
  A: 3,
}

export function GameplayScreen() {
  useEffect(() => {
    if (!startedAtMs.value) {
      goTo('home')
      return
    }
    const tickId = window.setInterval(() => {
      if (startedAtMs.value) elapsedMs.value = Date.now() - startedAtMs.value
    }, 33)
    const onKey = (e: KeyboardEvent) => {
      if (!keyboardEnabledFor(answerLayout.value)) return
      const idx = KEY_TO_INDEX[e.key]
      if (idx === undefined) return
      const cur = currentQuestion.value
      if (!cur) return
      e.preventDefault()
      submitAnswer(cur.choices[idx])
    }
    window.addEventListener('keydown', onKey)
    return () => {
      clearInterval(tickId)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  useEffect(() => {
    if (isDone.value) {
      finishSession()
      goTo('finished')
    }
  }, [isDone.value])

  const cur = currentQuestion.value
  const isLocked = correction.value !== null
  const correctIdx = cur ? cur.choices.indexOf(cur.fact.product) : -1
  const layout = answerLayout.value

  return (
    <div class="screen screen--gameplay">
      <BackgroundGrid />

      <div class="play">
        {cur ? (
          <>
            <div class="prompt-large">
              <span>
                {cur.fact.a} × {cur.fact.b} ={' '}
                {isLocked ? (
                  <strong>{cur.fact.product}</strong>
                ) : (
                  <em>?</em>
                )}
              </span>
            </div>

            <div class={`answers answers--${layout} ${isLocked ? 'answers--locked' : ''}`}>
              {cur.choices.map((choice, i) => {
                const isCorrectFlash = isLocked && i === correctIdx
                return (
                  <button
                    key={`${cur.fact.a}-${cur.fact.b}-${i}`}
                    data-pos={i}
                    class={`answer ${isCorrectFlash ? 'answer--correct-flash' : ''}`}
                    disabled={isLocked}
                    onClick={() => submitAnswer(choice)}
                  >
                    {choice}
                  </button>
                )
              })}
            </div>
          </>
        ) : null}

        <div class="timer">{formatMs(elapsedMs.value)}</div>
      </div>
    </div>
  )
}
