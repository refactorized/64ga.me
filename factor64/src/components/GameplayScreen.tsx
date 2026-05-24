import { useEffect } from 'preact/hooks';
import { currentGameTime, gameStartTime, actions } from '../store';
import { formatTime } from '../utils';
import styles from './GameplayScreen.module.css';

export function GameplayScreen() {
  useEffect(() => {
    if (!gameStartTime.value) {
      // Safety check - should not happen in normal flow
      actions.goHome();
      return;
    }

    const interval = setInterval(() => {
      if (gameStartTime.value) {
        currentGameTime.value = Date.now() - gameStartTime.value;
      }
    }, 10); // Update every 10ms for smooth timer

    return () => clearInterval(interval);
  }, []);

  return (
    <div class={styles.container}>
      <div class={styles.timer}>
        {formatTime(currentGameTime.value)}
      </div>
      
      <div class={styles.instructions}>
        Click the button to stop the timer!
      </div>
      
      <button 
        class={styles.gameButton}
        onClick={actions.finishGame}
      >
        STOP
      </button>
    </div>
  );
}
