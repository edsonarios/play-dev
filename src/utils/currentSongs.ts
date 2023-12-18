import { type ISong } from '@/lib/data'
import { type CurrentMusicType } from '@/store/playerStore'
import { shuffleSongsWithCurrentSong } from './random'

// Verify is needed to updated the current songs and update it if needed
// This function is used when the songs to add is not already in the current songs, so we need to find all songs in the current songs and added the new songs
export function updateCurrentSongsIfNeeded ({
  songsToAdd,
  playlistID,
  currentMusic,
  randomPlaylist,
  setCurrentMusic
}: {
  songsToAdd: ISong[]
  playlistID: string
  currentMusic: CurrentMusicType
  randomPlaylist: boolean
  setCurrentMusic: (setCurrentMusic: CurrentMusicType) => void
}) {
  if (currentMusic.song !== undefined && playlistID === currentMusic.playlist?.id) {
    let newSongsInCurrentSong = [...currentMusic.songs, ...songsToAdd]
    if (randomPlaylist) {
      newSongsInCurrentSong = shuffleSongsWithCurrentSong(newSongsInCurrentSong, currentMusic.song?.id)
    }
    setCurrentMusic({ ...currentMusic, songs: newSongsInCurrentSong })
  }
}

export function updateCurrentSongsByDragDropIfNeeded ({
  newSongs,
  currentMusic,
  setCurrentMusic,
  randomPlaylist
}: {
  newSongs: ISong[]
  currentMusic: CurrentMusicType
  setCurrentMusic: (setCurrentMusic: CurrentMusicType) => void
  randomPlaylist: boolean
}) {
  if (newSongs.length > 0 && currentMusic.playlist?.id === newSongs[0].albumId && !randomPlaylist) {
    setCurrentMusic({ ...currentMusic, songs: newSongs })
  }
}

export function deleteSongInCurrentSongsIfNeeded ({
  song,
  currentMusic,
  setCurrentMusic
}: {
  song: ISong
  currentMusic: CurrentMusicType
  setCurrentMusic: (setCurrentMusic: CurrentMusicType) => void
}) {
  if (song.albumId === currentMusic.playlist?.id) {
    const newSongsInCurrentSong = currentMusic.songs.filter(s => s.id !== song.id)
    setCurrentMusic({ ...currentMusic, songs: newSongsInCurrentSong })
  }
}

export function deletePlaylistInCurrentSongsIfNeeded ({
  playlistID,
  currentMusic,
  setCurrentMusic
}: {
  playlistID: string
  currentMusic: CurrentMusicType
  setCurrentMusic: (setCurrentMusic: CurrentMusicType) => void
}) {
  if (playlistID === currentMusic.playlist?.id) {
    setCurrentMusic({ ...currentMusic, songs: [], playlist: undefined })
  }
}
