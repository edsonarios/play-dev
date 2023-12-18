import { create } from 'zustand'
import { type IPlaylist, type ISong } from '../lib/data'
import { type PlyrOptions } from 'plyr-react'
// import { shuffleSongs } from '@/utils/random'

export interface CurrentMusicType {
  playlist: IPlaylist | undefined
  song: ISong | undefined
  songs: ISong[]
}
export type RepeatPlaylistOptions = 'off' | 'on' | 'one'

export interface StoreType {
  modeColor: string
  setModeColor: (modeColor: string) => void

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

  playlistView: string
  setPlaylistView: (playlistView: string) => void

  songsIdSelected: string[]
  setSongsIdSelected: (songsSelected: string[]) => void

  lastSongIdSelected: string
  setLastSongIdSelected: (lastSongSelected: string) => void

  editTemporallyTitle: string
  setEditTemporallyTitle: (editTemporallyTitle: string) => void

  editTemporallyColor: string
  setEditTemporallyColor: (temporallyColor: string) => void

  editTemporallyCover: string
  setEditTemporallyCover: (temporallyCover: string) => void

  songRefToScroll: ISong | undefined
  setSongRefToScroll: (songRefToScroll: ISong | undefined) => void

  homeHideSongs: boolean
  setHomeHideSongs: (homeHideSongs: boolean) => void
}

export const usePlayerStore = create<StoreType>((set, get) => ({
  modeColor: 'dark',
  setModeColor: (modeColor) => { set({ modeColor }) },

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
  setSongs: (songs) => { set({ songs }) },

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

  playlistView: '0',
  setPlaylistView: (playlistView) => { set({ playlistView }) },

  songsIdSelected: [],
  setSongsIdSelected: (songsIdSelected) => { set({ songsIdSelected }) },

  lastSongIdSelected: '',
  setLastSongIdSelected: (lastSongIdSelected) => { set({ lastSongIdSelected }) },

  editTemporallyTitle: '',
  setEditTemporallyTitle: (editTemporallyTitle) => { set({ editTemporallyTitle }) },

  editTemporallyColor: '',
  setEditTemporallyColor: (editTemporallyColor) => { set({ editTemporallyColor }) },

  editTemporallyCover: '',
  setEditTemporallyCover: (editTemporallyCover) => { set({ editTemporallyCover }) },

  songRefToScroll: undefined,
  setSongRefToScroll: (songRefToScroll: ISong | undefined) => { set({ songRefToScroll }) },

  homeHideSongs: false,
  setHomeHideSongs: (homeHideSongs) => { set({ homeHideSongs }) }
}))
