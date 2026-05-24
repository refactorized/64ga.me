export function formatTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const ms = Math.floor((milliseconds % 1000) / 10);
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  } else {
    return `${remainingSeconds}.${ms.toString().padStart(2, '0')}s`;
  }
}
