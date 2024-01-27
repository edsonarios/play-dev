import { type IPlaylist, type ISong } from '@/lib/data'
import { withViewTransition } from '@/utils/transition'

export const OpenFolder = async (
  playlists: IPlaylist[],
  setPlaylists: (playlists: IPlaylist[]) => void,
  setSongs: (songs: ISong[]) => void,
  songs: ISong[],
  setIsLoading: (isLoading: boolean) => void
) => {
  withViewTransition(async () => {
    setIsLoading(true)
    const folder = await window.electronAPI.openDirectoryDialog()
    if (folder?.playlist !== undefined) {
      const Newplaylists = [...playlists, folder.playlist]
      setPlaylists(Newplaylists)
      const newSongs = [...songs, ...folder.songs]
      setSongs(newSongs)
    }
    setIsLoading(false)
  })
}
