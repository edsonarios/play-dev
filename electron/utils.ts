import { type IPlaylist, colors, covers } from './entities/playlist.entity'

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
  return colorKeys[randomIndex]
}

export const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * covers.length)
  return covers[randomIndex]
}

export function improveCovers (playlists: IPlaylist[]): IPlaylist[] {
  return playlists.map(playlist => {
    // Copy the playlist
    const copiedPlaylist = { ...playlist, cover: [...playlist.cover] }

    // Get the songs of the playlist
    const playlistSongs = playlist.songs

    // Get unique covers to maximun 4
    const uniqueCovers = new Set<string>()
    for (const song of playlistSongs) {
      uniqueCovers.add(song.image)
      if (uniqueCovers.size === 4) break
    }

    // Asigned covers to the playlist
    if (uniqueCovers.size === 4) {
      copiedPlaylist.cover = Array.from(uniqueCovers)
    }
    if (uniqueCovers.size > 0 && uniqueCovers.size < 4) {
      copiedPlaylist.cover = [playlistSongs[0].image]
    }
    if (uniqueCovers.size === 0) {
      copiedPlaylist.cover = [getRandomImage()]
    }
    return copiedPlaylist
  })
}
