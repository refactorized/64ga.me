import { signal } from '@preact/signals'

export type Profile = { name: string; bestMs?: number }

const KEY_PROFILES = 'factor64_profiles'
const KEY_CURRENT = 'factor64_currentProfile'

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    return v ? (JSON.parse(v) as T) : fallback
  } catch {
    return fallback
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error(`failed to save ${key}`, e)
  }
}

export const profiles = signal<Profile[]>(load(KEY_PROFILES, []))
export const currentProfileName = signal<string | null>(load(KEY_CURRENT, null))

export function addProfile(name: string) {
  const trimmed = name.trim()
  if (!trimmed) return
  if (profiles.value.some((p) => p.name === trimmed)) return
  profiles.value = [...profiles.value, { name: trimmed }]
  save(KEY_PROFILES, profiles.value)
}

export function removeProfile(name: string) {
  profiles.value = profiles.value.filter((p) => p.name !== name)
  save(KEY_PROFILES, profiles.value)
  if (currentProfileName.value === name) {
    currentProfileName.value = null
    save(KEY_CURRENT, null)
  }
}

export function selectProfile(name: string) {
  currentProfileName.value = name
  save(KEY_CURRENT, name)
}

export function updateBest(name: string, ms: number) {
  const next = profiles.value.map((p) =>
    p.name === name && (!p.bestMs || ms < p.bestMs) ? { ...p, bestMs: ms } : p,
  )
  profiles.value = next
  save(KEY_PROFILES, next)
}

export function currentProfile(): Profile | undefined {
  const name = currentProfileName.value
  if (!name) return undefined
  return profiles.value.find((p) => p.name === name)
}
