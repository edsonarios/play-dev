export const formatTime = (time: number | undefined) => {
  if (time === undefined) return '0:00'

  const seconds = Math.floor(time % 60)
  const minutes = Math.floor(time / 60)

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function formatTotalDuration (totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  let result = ''
  if (hours > 0) {
    result += `${hours}h `
  }
  if (minutes > 0 || hours > 0) {
    result += `${minutes}m `
  }
  return result.trim()
}
