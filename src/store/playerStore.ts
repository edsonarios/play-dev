import { create } from 'zustand'
import { type Playlist, type Song } from '../lib/data'
import { type PlyrOptions } from 'plyr-react'

export interface CurrentMusicType {
  playlist: Playlist | undefined
  song: Song | undefined
  songs: Song[]
}
export type RepeatPlaylistOptions = 'off' | 'on' | 'one'

export interface StoreType {
  playerOptions: PlyrOptions
  setPlayerOptions: (playerOptions: PlyrOptions) => void

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

  copyCurrentMusic: CurrentMusicType
  setCopyCurrentMusic: (copyCurrentMusic: CurrentMusicType) => void
}
export const usePlayerStore = create<StoreType>((set) => ({
  playerOptions: {
    loop: { active: false },
    autoplay: true,
    hideControls: true,
    keyboard: {
      global: true
    },
    invertTime: false,
    controls: ['play-large', 'pip', 'fullscreen']
  },
  setPlayerOptions: (playerOptions) => { set({ playerOptions }) },

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

  copyCurrentMusic: {
    playlist: undefined,
    song: undefined,
    songs: []
  },
  setCopyCurrentMusic: (copyCurrentMusic) => { set({ copyCurrentMusic }) }
}))
