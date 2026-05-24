import { signal, computed } from '@preact/signals';
import type { Screen, User, GameState } from './types';

// Local storage keys
const USERS_STORAGE_KEY = 'factor64_users';

// Load users from localStorage
function loadUsers(): User[] {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save users to localStorage
function saveUsers(users: User[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save users to localStorage:', error);
  }
}

// Global state signals
export const currentScreen = signal<Screen>('home');
export const currentUser = signal<User | null>(null);
export const users = signal<User[]>(loadUsers());
export const currentGameTime = signal<number>(0);
export const gameStartTime = signal<number | null>(null);

// Computed values
export const gameState = computed<GameState>(() => ({
  currentScreen: currentScreen.value,
  currentUser: currentUser.value,
  users: users.value,
  currentGameTime: currentGameTime.value,
  gameStartTime: gameStartTime.value,
}));

// Actions
export const actions = {
  // Screen navigation
  goToScreen(screen: Screen) {
    currentScreen.value = screen;
  },

  // User management
  addUser(name: string) {
    const newUser: User = { name };
    const updatedUsers = [...users.value, newUser];
    users.value = updatedUsers;
    saveUsers(updatedUsers);
  },

  removeUser(name: string) {
    const updatedUsers = users.value.filter(user => user.name !== name);
    users.value = updatedUsers;
    saveUsers(updatedUsers);
    
    // If the removed user was the current user, clear it
    if (currentUser.value?.name === name) {
      currentUser.value = null;
    }
  },

  selectUser(user: User) {
    currentUser.value = user;
    currentScreen.value = 'ready';
  },

  // Game actions
  startGame() {
    gameStartTime.value = Date.now();
    currentGameTime.value = 0;
    currentScreen.value = 'gameplay';
  },

  finishGame() {
    if (gameStartTime.value && currentUser.value) {
      const finalTime = Date.now() - gameStartTime.value;
      currentGameTime.value = finalTime;
      
      // Update user's best time if this is better
      const userIndex = users.value.findIndex(u => u.name === currentUser.value!.name);
      if (userIndex !== -1) {
        const user = users.value[userIndex];
        if (!user.bestTime || finalTime < user.bestTime) {
          const updatedUsers = [...users.value];
          updatedUsers[userIndex] = { ...user, bestTime: finalTime };
          users.value = updatedUsers;
          currentUser.value = updatedUsers[userIndex];
          saveUsers(updatedUsers);
        }
      }
      
      gameStartTime.value = null;
      currentScreen.value = 'finished';
    }
  },

  resetGame() {
    currentGameTime.value = 0;
    gameStartTime.value = null;
  },

  goHome() {
    currentScreen.value = 'home';
    currentUser.value = null;
    actions.resetGame();
  }
};
