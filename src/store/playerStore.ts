import { type StateCreator, create } from 'zustand'
import { type ISections, type IPlaylist, type ISong } from '../lib/data'
import { type PlyrOptions } from 'plyr-react'
import { persist } from 'zustand/middleware'
import { getRandomColor } from '@/utils/random'

export interface CurrentMusicType {
  playlist: IPlaylist | undefined
  song: ISong | undefined
  songs: ISong[]
}
export type RepeatPlaylistOptions = 'off' | 'on' | 'one'
// type modeColorValues = 'dark' | 'light'

interface IProfile {
  name: string
  email: string
  image: string
}

export interface StoreType {
  modeColor: 'dark' | 'light'
  setModeColor: (modeColor: 'dark' | 'light') => void

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

  speed: number
  setSpeed: (speed: number) => void

  pictureInPicture: boolean
  setPictureInPicture: (pictureInPicture: boolean) => void

  playlistView: string
  setPlaylistView: (playlistView: string) => void

  currentSectionView: string
  setCurrentSectionView: (currentSectionView: string) => void

  currentPlaylistView: IPlaylist | undefined
  setCurrentPlaylistView: (currentPlaylistView: IPlaylist | undefined) => void

  currentPlaylistSongsView: ISong[]
  setCurrentPlaylistSongsView: (currentPlaylistSongsView: ISong[]) => void

  songsIdSelected: string[]
  setSongsIdSelected: (songsSelected: string[]) => void

  lastSongIdSelected: string
  setLastSongIdSelected: (lastSongSelected: string) => void

  editTemporallyTitle: string
  setEditTemporallyTitle: (editTemporallyTitle: string) => void

  editTemporallyColor: string
  setEditTemporallyColor: (temporallyColor: string) => void

  editTemporallyCover: string[]
  setEditTemporallyCover: (temporallyCover: string[]) => void

  songRefToScroll: ISong | undefined
  setSongRefToScroll: (songRefToScroll: ISong | undefined) => void

  homeHideSongs: boolean
  setHomeHideSongs: (homeHideSongs: boolean) => void

  profile: IProfile | undefined
  setProfile: (profile: IProfile | undefined) => void

  language: string
  setLanguage: (language: string) => void

  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void

  isShowShortcuts: boolean
  setIsShowShortcuts: (showShortcuts: boolean) => void

  sections: ISections[]
  setSections: (sections: ISections[]) => void

  editTemporallySection: string
  setEditTemporallySection: (temporallySection: string) => void

  playlistsMap: Map<string, IPlaylist>
  setPlaylistsMap: (playlistsMap: Map<string, IPlaylist>) => void

  theatreMode: boolean
  setTheatreMode: (theatreMode: boolean) => void

  isShowFullControls: boolean
  setIsShowFullControls: (isShowFullControls: boolean) => void
}
const storePlyr: StateCreator<StoreType> = (set) => ({
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
    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
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

  speed: 1,
  setSpeed: (speed) => { set({ speed }) },

  pictureInPicture: false,
  setPictureInPicture: (pictureInPicture) => { set({ pictureInPicture }) },

  playlistView: '0',
  setPlaylistView: (playlistView) => { set({ playlistView }) },

  currentSectionView: '',
  setCurrentSectionView: (currentSectionView) => { set({ currentSectionView }) },

  currentPlaylistView: undefined,
  setCurrentPlaylistView: (currentPlaylistView) => { set({ currentPlaylistView }) },

  currentPlaylistSongsView: [],
  setCurrentPlaylistSongsView: (currentPlaylistSongsView) => { set({ currentPlaylistSongsView }) },

  songsIdSelected: [],
  setSongsIdSelected: (songsIdSelected) => { set({ songsIdSelected }) },

  lastSongIdSelected: '',
  setLastSongIdSelected: (lastSongIdSelected) => { set({ lastSongIdSelected }) },

  editTemporallyTitle: '',
  setEditTemporallyTitle: (editTemporallyTitle) => { set({ editTemporallyTitle }) },

  editTemporallyColor: '',
  setEditTemporallyColor: (editTemporallyColor) => { set({ editTemporallyColor }) },

  editTemporallyCover: [],
  setEditTemporallyCover: (editTemporallyCover) => { set({ editTemporallyCover }) },

  songRefToScroll: undefined,
  setSongRefToScroll: (songRefToScroll: ISong | undefined) => { set({ songRefToScroll }) },

  homeHideSongs: false,
  setHomeHideSongs: (homeHideSongs) => { set({ homeHideSongs }) },

  profile: undefined,
  setProfile: (profile) => { set({ profile }) },

  language: 'en',
  setLanguage: (language) => { set({ language }) },

  isLoading: false,
  setIsLoading: (isLoading) => { set({ isLoading }) },

  isShowShortcuts: false,
  setIsShowShortcuts: (isShowShortcuts) => { set({ isShowShortcuts }) },

  sections: [
    {
      id: '1',
      title: 'My Playlists',
      playlists: [{
        id: '1',
        albumId: '1',
        title: 'All Songs',
        color: getRandomColor(),
        cover: ['Covers/cover1.jpg'],
        artists: [],
        songs: []
      }]
    },
    {
      id: window.crypto.randomUUID(),
      title: 'Favorites',
      playlists: []
    },
    {
      id: window.crypto.randomUUID(),
      title: 'Youtube',
      playlists: []
    }
  ],
  setSections: (sections) => { set({ sections }) },

  editTemporallySection: '',
  setEditTemporallySection: (editTemporallySection) => { set({ editTemporallySection }) },

  playlistsMap: new Map(),
  setPlaylistsMap: (playlistsMap) => { set({ playlistsMap }) },

  theatreMode: false,
  setTheatreMode: (theatreMode) => { set({ theatreMode }) },

  isShowFullControls: false,
  setIsShowFullControls: (isShowFullControls) => { set({ isShowFullControls }) }
})

export const usePlayerStore = create<StoreType>()(
  persist(
    storePlyr,
    {
      name: 'player-storage',
      partialize: (state) => ({
        modeColor: state.modeColor,
        sections: state.sections,
        currentMusic: state.currentMusic,
        randomPlaylist: state.randomPlaylist,
        repeatPlaylist: state.repeatPlaylist,
        volume: state.volume,
        profile: state.profile,
        language: state.language,
        isShowFullControls: state.isShowFullControls
      })
    }
  )
)
