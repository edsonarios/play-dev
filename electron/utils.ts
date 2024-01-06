import { type IPlaylist, colors, covers } from './entities/playlist.entity'
import { type ISong } from './entities/song.entity'

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

export function improveCovers (playlists: IPlaylist[], songs: ISong[]): IPlaylist[] {
  // Mapeo de todas las canciones por playlist para un acceso rápido
  const songsByPlaylist = songs.reduce<Record<string, ISong[]>>((acc, song) => {
    if (acc[song.albumId] !== undefined) {
      acc[song.albumId].push(song)
    } else {
      acc[song.albumId] = [song]
    }
    return acc
  }, {})

  const improvedPlaylists = playlists.map(playlist => {
    const copiedPlaylist = { ...playlist, cover: [...playlist.cover] }

    const playlistSongs = songsByPlaylist[playlist.id]
    if (playlistSongs !== undefined && playlistSongs.length >= 4) {
      const uniqueCovers = new Set<string>()

      for (const song of playlistSongs) {
        uniqueCovers.add(song.image)
        if (uniqueCovers.size === 4) break
      }

      if (uniqueCovers.size === 4) {
        copiedPlaylist.cover = Array.from(uniqueCovers)
      }
    }
    if (copiedPlaylist.cover.length === 0) copiedPlaylist.cover.push(getRandomImage())
    if (copiedPlaylist.cover.length > 4) copiedPlaylist.cover = [playlistSongs[0].image]

    return copiedPlaylist
  })

  return improvedPlaylists
}
