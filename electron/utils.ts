import { colors, covers } from './entities/playlist.entity'

export const formatTime = (time: number | undefined) => {
  if (time === undefined) return '0:00'

  const seconds = Math.floor(time % 60)
  const minutes = Math.floor(time / 60)

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function naturalSort (a: string, b: string) {
  return a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: 'base'
  })
}

export const getRandomColor = () => {
  const colorKeys = Object.keys(colors)
  const randomIndex = Math.floor(Math.random() * colorKeys.length)
  const randomColorKey = colorKeys[randomIndex]
  return colors[randomColorKey]
}

export const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * covers.length)
  return covers[randomIndex]
}
