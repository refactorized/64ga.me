import { currentUser, actions } from '../store';
import { formatTime } from '../utils';
import styles from './ReadyScreen.module.css';

export function ReadyScreen() {
  const user = currentUser.value;

  if (!user) {
    // Fallback - should not happen in normal flow
    actions.goHome();
    return null;
  }

  return (
    <div class={styles.container}>
      <h1 class={styles.title}>Ready to Play?</h1>
      
      <div class={styles.userName}>{user.name}</div>
      
      <div class={styles.bestTime}>
        {user.bestTime ? (
          <>Best Time: {formatTime(user.bestTime)}</>
        ) : (
          <span class={styles.noBestTime}>No best time yet</span>
        )}
      </div>
      
      <button 
        class={`${styles.startButton} primary`}
        onClick={actions.startGame}
      >
        Start Game
      </button>
      
      <div>
        <button 
          class={styles.backButton}
          onClick={actions.goHome}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
