import { currentProfile } from '../state/profiles'
import { elapsedMs, lastWasBest } from '../state/session'
import { goTo } from '../state/screen'
import { formatMs } from '../lib/format'

export function FinishedScreen() {
  const p = currentProfile()
  const ms = elapsedMs.value
  return (
    <div class="screen screen--finished">
      <h1 class="title">done!</h1>
      <div class="final-time">{formatMs(ms)}</div>
      {lastWasBest.value && <div class="best-banner">new personal best</div>}
      {p?.bestMs && !lastWasBest.value && (
        <div class="best-context">best is {formatMs(p.bestMs)}</div>
      )}
      <button class="primary" onClick={() => goTo('ready')}>
        play again
      </button>
      <button class="link" onClick={() => goTo('home')}>
        home
      </button>
    </div>
  )
}
