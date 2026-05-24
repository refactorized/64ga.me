import { currentProfile } from '../state/profiles'
import { goTo } from '../state/screen'
import { startSession } from '../state/session'
import { formatMs } from '../lib/format'

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
      <button class="primary" onClick={start}>
        start
      </button>
      <button class="link" onClick={() => goTo('home')}>
        back
      </button>
    </div>
  )
}
