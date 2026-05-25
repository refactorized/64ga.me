import { currentProfile } from '../state/profiles'
import { goTo } from '../state/screen'
import { startSession } from '../state/session'
import { answerLayout, setAnswerLayout, type AnswerLayout } from '../state/settings'
import { formatMs } from '../lib/format'

const LAYOUTS: { value: AnswerLayout; label: string }[] = [
  { value: 'diamond', label: 'diamond' },
  { value: 'inverted-t', label: 'T' },
  { value: 'square', label: '2×2' },
]

export function ReadyScreen() {
  const p = currentProfile()
  if (!p) {
    goTo('home')
    return null
  }
  const start = () => {
    startSession()
    goTo('gameplay')
  }
  return (
    <div class="screen screen--ready">
      <h1 class="title">{p.name}</h1>
      <div class="best">
        {p.bestMs ? <>best {formatMs(p.bestMs)}</> : <em>no best time yet</em>}
      </div>

      <div class="layout-picker">
        <div class="layout-picker__label">layout</div>
        <div class="layout-picker__buttons">
          {LAYOUTS.map((l) => (
            <button
              key={l.value}
              class={`layout-pick ${answerLayout.value === l.value ? 'layout-pick--active' : ''}`}
              onClick={() => setAnswerLayout(l.value)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <button class="primary" onClick={start}>
        start
      </button>
      <button class="link" onClick={() => goTo('home')}>
        back
      </button>
    </div>
  )
}
