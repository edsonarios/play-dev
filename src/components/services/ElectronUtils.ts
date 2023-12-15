import { type IPlaylist, type ISong } from '@/lib/data'

export const OpenFolder = async (
  playlists: IPlaylist[],
  setPlaylists: (playlists: IPlaylist[]) => void,
  setSongs: (songs: ISong[]) => void,
  songs: ISong[]
) => {
  const folder = await window.electronAPI.openDirectoryDialog()
  if (folder?.playlist !== undefined) {
    const Newplaylists = [...playlists, folder.playlist]
    setPlaylists(Newplaylists)
    const newSongs = [...songs, ...folder.songs]
    setSongs(newSongs)
  }
}
