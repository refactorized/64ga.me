import { useState } from 'preact/hooks';
import { users, actions } from '../store';
import { formatTime } from '../utils';
import styles from './HomeScreen.module.css';

export function HomeScreen() {
  const [newUserName, setNewUserName] = useState('');

  const handleAddUser = (e: Event) => {
    e.preventDefault();
    if (newUserName.trim() && !users.value.find(u => u.name === newUserName.trim())) {
      actions.addUser(newUserName.trim());
      setNewUserName('');
    }
  };

  return (
    <div class={styles.container}>
      <h1 class={styles.title}>Factor 64</h1>
      
      <form class={styles.addUserForm} onSubmit={handleAddUser}>
        <input
          type="text"
          placeholder="Enter username"
          value={newUserName}
          onInput={(e) => setNewUserName((e.target as HTMLInputElement).value)}
          class={styles.addUserInput}
          maxLength={20}
        />
        <button type="submit" disabled={!newUserName.trim()}>
          Add User
        </button>
      </form>

      {users.value.length === 0 ? (
        <div class={styles.emptyState}>
          No users yet. Add a username to get started!
        </div>
      ) : (
        <ul class={styles.userList}>
          {users.value.map((user) => (
            <li key={user.name} class={styles.userItem}>
              <div 
                class={styles.userName}
                onClick={() => actions.selectUser(user)}
              >
                {user.name}
              </div>
              {user.bestTime && (
                <div class={styles.userBestTime}>
                  Best: {formatTime(user.bestTime)}
                </div>
              )}
              <button
                class={styles.removeButton}
                onClick={() => actions.removeUser(user.name)}
                title="Remove user"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
