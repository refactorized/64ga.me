export function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const cs = Math.floor((ms % 1000) / 10)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  if (min > 0) return `${min}:${pad(sec)}.${pad(cs)}`
  return `${sec}.${pad(cs)}s`
}
