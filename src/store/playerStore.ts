import { create } from 'zustand'
import { type IPlaylist, type ISong } from '../lib/data'
import { type PlyrOptions } from 'plyr-react'

export interface CurrentMusicType {
  playlist: IPlaylist | undefined
  song: ISong | undefined
  songs: ISong[]
}
export type RepeatPlaylistOptions = 'off' | 'on' | 'one'

export interface StoreType {
  playerOptions: PlyrOptions
  setPlayerOptions: (playerOptions: PlyrOptions) => void

  playlists: IPlaylist[]
  setPlaylists: (playlists: IPlaylist[]) => void

  songs: ISong[]
  setSongs: (songs: ISong[]) => void

  isPlaying: boolean
  setIsPlaying: (isPlaying: boolean) => void

  currentMusic: CurrentMusicType
  setCurrentMusic: (currentMusic: CurrentMusicType) => void

  songCurrentTime: number
  setSongCurrentTime: (songCurrentTime: number) => void

  localSongCurrentTime: number
  setLocalSongCurrentTime: (localSongCurrentTime: number) => void

  durationSong: number
  setDurationSong: (durationSong: number) => void

  volume: number
  setVolume: (volume: number) => void

  repeatPlaylist: RepeatPlaylistOptions
  setRepeatPlaylist: (repeatPlaylist: RepeatPlaylistOptions) => void

  randomPlaylist: boolean
  setRandomPlaylist: (randomPlaylist: boolean) => void

  speed: number
  setSpeed: (speed: number) => void

  pictureInPicture: boolean
  setPictureInPicture: (pictureInPicture: boolean) => void

  copyCurrentMusic: CurrentMusicType
  setCopyCurrentMusic: (copyCurrentMusic: CurrentMusicType) => void

  playlistView: string
  setPlaylistView: (playlistView: string) => void

  songsIdSelected: string[]
  setSongsIdSelected: (songsSelected: string[]) => void

  lastSongIdSelected: string
  setLastSongIdSelected: (lastSongSelected: string) => void
}

export const usePlayerStore = create<StoreType>((set, get) => ({
  playerOptions: {
    loop: { active: false },
    autoplay: false,
    hideControls: true,
    keyboard: {
      global: true
    },
    invertTime: false,
    controls: ['play-large', 'pip', 'fullscreen']
  },
  setPlayerOptions: (playerOptions) => { set({ playerOptions }) },

  playlists: [],
  setPlaylists: (playlists) => { set({ playlists }) },

  songs: [],
  setSongs: (songs) => {
    const { currentMusic, setCurrentMusic } = get()

    if (currentMusic?.song !== undefined) {
      const updateCurrentSongs = songs.filter(song => song.albumId === currentMusic.playlist?.id)
      setCurrentMusic({ ...currentMusic, songs: updateCurrentSongs })
    }

    set({ songs })
  },

  isPlaying: false,
  setIsPlaying: (isPlaying) => { set({ isPlaying }) },

  currentMusic: {
    playlist: undefined,
    song: undefined,
    songs: []
  },
  setCurrentMusic: (currentMusic) => { set({ currentMusic }) },

  songCurrentTime: 0,
  setSongCurrentTime: (songCurrentTime) => { set({ songCurrentTime }) },

  localSongCurrentTime: 0,
  setLocalSongCurrentTime: (localSongCurrentTime) => { set({ localSongCurrentTime }) },

  durationSong: 1,
  setDurationSong: (durationSong) => { set({ durationSong }) },

  volume: 1,
  setVolume: (volume) => { set({ volume }) },

  repeatPlaylist: 'off',
  setRepeatPlaylist: (repeatPlaylist) => { set({ repeatPlaylist }) },

  randomPlaylist: false,
  setRandomPlaylist: (randomPlaylist) => { set({ randomPlaylist }) },

  speed: 1,
  setSpeed: (speed) => { set({ speed }) },

  pictureInPicture: false,
  setPictureInPicture: (pictureInPicture) => { set({ pictureInPicture }) },

  copyCurrentMusic: {
    playlist: undefined,
    song: undefined,
    songs: []
  },
  setCopyCurrentMusic: (copyCurrentMusic) => { set({ copyCurrentMusic }) },

  playlistView: '0',
  setPlaylistView: (playlistView) => { set({ playlistView }) },

  songsIdSelected: [],
  setSongsIdSelected: (songsIdSelected) => { set({ songsIdSelected }) },

  lastSongIdSelected: '',
  setLastSongIdSelected: (lastSongIdSelected) => { set({ lastSongIdSelected }) }
}))
