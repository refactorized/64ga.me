import { currentUser, currentGameTime, actions } from '../store';
import { formatTime } from '../utils';
import styles from './GameFinishedScreen.module.css';

export function GameFinishedScreen() {
  const user = currentUser.value;
  const gameTime = currentGameTime.value;

  if (!user) {
    // Fallback - should not happen in normal flow
    actions.goHome();
    return null;
  }

  const isNewRecord = !user.bestTime || gameTime < user.bestTime;

  const handlePlayAgain = () => {
    actions.resetGame();
    actions.goToScreen('ready');
  };

  return (
    <div class={styles.container}>
      <h1 class={styles.title}>Game Complete!</h1>
      
      <div class={styles.finalTime}>
        {formatTime(gameTime)}
      </div>
      
      {isNewRecord && (
        <div class={styles.newRecord}>
          🎉 New Personal Best! 🎉
        </div>
      )}
      
      <div class={styles.buttons}>
        <button 
          class={styles.playAgainButton}
          onClick={handlePlayAgain}
        >
          Play Again
        </button>
        
        <button 
          class={styles.homeButton}
          onClick={actions.goHome}
        >
          Home
        </button>
      </div>
    </div>
  );
}
