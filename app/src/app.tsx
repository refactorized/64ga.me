import { currentScreen } from './state/screen'
import { HomeScreen } from './screens/home'
import { ReadyScreen } from './screens/ready'
import { GameplayScreen } from './screens/gameplay'
import { FinishedScreen } from './screens/finished'

export function App() {
  switch (currentScreen.value) {
    case 'home':
      return <HomeScreen />
    case 'ready':
      return <ReadyScreen />
    case 'gameplay':
      return <GameplayScreen />
    case 'finished':
      return <FinishedScreen />
  }
}
