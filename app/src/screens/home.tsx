import { useState } from 'preact/hooks'
import { profiles, addProfile, removeProfile, selectProfile } from '../state/profiles'
import { goTo } from '../state/screen'
import { formatMs } from '../lib/format'

export function HomeScreen() {
  const [name, setName] = useState('')

  const submit = (e: Event) => {
    e.preventDefault()
    if (!name.trim()) return
    addProfile(name)
    setName('')
  }

  const onSelect = (n: string) => {
    selectProfile(n)
    goTo('ready')
  }

  return (
    <div class="screen screen--home">
      <h1 class="title">64ga.me</h1>
      <form class="add-profile" onSubmit={submit}>
        <input
          type="text"
          placeholder="add a name"
          value={name}
          onInput={(e) => setName((e.target as HTMLInputElement).value)}
          maxLength={20}
        />
        <button type="submit" disabled={!name.trim()}>
          add
        </button>
      </form>
      {profiles.value.length === 0 ? (
        <p class="empty">no profiles yet — add one above</p>
      ) : (
        <ul class="profile-list">
          {profiles.value.map((p) => (
            <li key={p.name} class="profile-row">
              <button class="profile-name" onClick={() => onSelect(p.name)}>
                {p.name}
              </button>
              {p.bestMs && <span class="profile-best">best {formatMs(p.bestMs)}</span>}
              <button
                class="profile-remove"
                aria-label={`remove ${p.name}`}
                onClick={() => removeProfile(p.name)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
