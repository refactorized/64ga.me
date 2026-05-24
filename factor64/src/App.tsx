import { currentScreen } from './store';
import { HomeScreen } from './components/HomeScreen';
import { ReadyScreen } from './components/ReadyScreen';
import { GameplayScreen } from './components/GameplayScreen';
import { GameFinishedScreen } from './components/GameFinishedScreen';
import { UserSelector } from './components/UserSelector';
import styles from './App.module.css';

export function App() {
  const renderScreen = () => {
    switch (currentScreen.value) {
      case 'home':
        return <HomeScreen />;
      case 'ready':
        return <ReadyScreen />;
      case 'gameplay':
        return <GameplayScreen />;
      case 'finished':
        return <GameFinishedScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div class={styles.app}>
      <UserSelector />
      <div class={styles.content}>
        {renderScreen()}
      </div>
    </div>
  );
}
