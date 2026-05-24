export type Screen = 'home' | 'ready' | 'gameplay' | 'finished';

export interface User {
  name: string;
  bestTime?: number;
}

export interface GameState {
  currentScreen: Screen;
  currentUser: User | null;
  users: User[];
  currentGameTime: number;
  gameStartTime: number | null;
}
