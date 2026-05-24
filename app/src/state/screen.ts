import { signal } from '@preact/signals'

export type Screen = 'home' | 'ready' | 'gameplay' | 'finished'

export const currentScreen = signal<Screen>('home')

export function goTo(screen: Screen) {
  currentScreen.value = screen
}
