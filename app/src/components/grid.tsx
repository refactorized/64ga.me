import { useEffect, useState } from 'preact/hooks'
import { completed } from '../state/session'
import { allFacts, factKey } from '../data/facts'

const FACTS = allFacts()

export function BackgroundGrid() {
  const [hue, setHue] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => {
      setHue((h) => (h + 3) % (360 * 360))
    }, 500)
    return () => clearInterval(id)
  }, [])
  return (
    <div class="grid" style={`--rot-pal-deg:${hue}`}>
      {FACTS.map((f, i) => {
        const isDone = completed.value.has(factKey(f.a, f.b))
        return (
          <div
            class={`cell ${isDone ? 'cell--done' : ''}`}
            style={`--pal-offset-deg:${(i * 360) / 64}`}
          >
            {isDone ? f.product : ''}
          </div>
        )
      })}
    </div>
  )
}
