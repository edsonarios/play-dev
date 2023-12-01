import { colors } from '@/lib/colors'
import { covers, type Song } from '../lib/data'

// Function to shuffle the array but the current song is always the first
export const shuffleSongsWithCurrentSong = (songs: Song[], currentSongId: number) => {
  const shuffled = [...songs]

  // Find the index of the current song
  const currentIndex = shuffled.findIndex(song => song.id === currentSongId)

  // Put the current song in the first position

  if (currentIndex >= 0) {
    [shuffled[0], shuffled[currentIndex]] = [shuffled[currentIndex], shuffled[0]]
  }

  // Algorithm  Fisher-Yates to shuffle the array, starting from the second element
  for (let i = shuffled.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * (i - 1)) + 1;
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}

export const shuffleSongs = (songs: Song[]) => {
  const shuffled = [...songs]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
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
