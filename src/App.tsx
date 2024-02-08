import './App.css'
import AsideMenu from './components/aside/AsideMenu'
import Header from './components/body/Header'
import PlayerComponent from './components/body/player'
import Controls from './components/controls/Controls'
import { colors } from './lib/colors'
import { type StoreType, usePlayerStore } from './store/playerStore'
import { PlaylistPipMode } from './components/body/pipMode/Playlist'
import { PlaylistDetail } from './components/body/pipMode/PlaylistDetail'
import { useCallback, useEffect, useRef, useState } from 'react'
import Split from 'react-split'
import { type IPlaylist, type ISong } from './lib/data'
import { useTranslation } from 'react-i18next'
import ModalUpdateStatus from './components/ModalUpdateStatus'
import ModalDownloading from './components/ModalDownloading'
import ModalShowShortcuts from './components/controls/ModalShortcuts'

interface OpenDirectoryDialog {
  playlist: IPlaylist
}

interface IYoutube {
  profile: IProfile
  playlists: IPlaylist[]
  songs: ISong[]
}

interface IProfile {
  name: string
  email: string
  image: string
}

interface ElectronAPI {
  openDirectoryDialog: () => Promise<OpenDirectoryDialog>
  receive: (
    channel: string,
    func: (event: any, ...args: any[]) => void
  ) => void
  removeListener: (channel: string, func: (...args: any[]) => void) => void
  getMusicMetadata: (filePath: string[]) => Promise<ISong[]>
  getImageToCover: () => Promise<string>
  exportConfig: (config: string) => Promise<boolean>
  importConfig: (config: string) => Promise<boolean>
  importYoutube: () => Promise<IYoutube>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export default function App () {
  const {
    currentMusic,
    pictureInPicture,
    playlistView,
    playlists,
    editTemporallyColor,
    modeColor,
    language,
    sections,
    playlistsMap
  } = usePlayerStore<StoreType>((state) => state)

  useEffect(() => {
    sections.forEach((section) => {
      section.playlists.forEach((playlist) => {
        playlistsMap.set(playlist.id, playlist)
      })
    })
    console.log(playlistsMap)
  }, [])

  const { i18n } = useTranslation()
  useEffect(() => {
    void i18n.changeLanguage(language)
  }, [language, i18n])

  const [currentColor, setCurrentColor] = useState(colors.gray.dark)
  let backGroundColor = colors.gray[modeColor as keyof typeof colors.gray]
  useEffect(() => {
    let newColor = colors.gray.dark
    let codeColor = colors.gray
    if (playlistView !== '0' && pictureInPicture) {
      console.log(playlistView)
      const [sectionId, playlistId] = playlistView.split(';')
      // Take color in pip mode from current view playlist
      const viewPlaylist = sections.find(section => section.id === sectionId)?.playlists.find(ply => ply.id === playlistId)
      // const viewPlaylist = playlists.find(
      //   (playlist) => playlist.id === playlistId
      // )
      if (viewPlaylist?.color !== undefined) {
        codeColor = colors[viewPlaylist.color]
      }
    } else {
      // Take color in normal mode from current music
      if (currentMusic.playlist?.color !== undefined && !pictureInPicture) {
        codeColor = colors[currentMusic.playlist.color]
      } else {
        // Take color in pip mode and playlist view is 0
        codeColor = colors.dark
      }
    }
    newColor = codeColor[modeColor as keyof typeof codeColor]
    backGroundColor = colors.gray[modeColor as keyof typeof colors.gray]
    setCurrentColor(newColor)
  }, [
    playlistView,
    pictureInPicture,
    currentMusic.playlist,
    playlists,
    modeColor
  ])

  useEffect(() => {
    if (editTemporallyColor !== '') {
      const codeColor = colors[editTemporallyColor]
      const newColor = codeColor[modeColor as keyof typeof codeColor]
      setCurrentColor(newColor)
    }
  }, [editTemporallyColor])

  const setPlaylist = () => {
    if (pictureInPicture && playlistView !== '0') {
      return (
        <PlaylistDetail />
      )
    }
    return <PlaylistPipMode />
  }

  const playerContainerRef = useRef<HTMLElement>(null)
  const updatePlayerSize = () => {
    if (playerContainerRef.current !== null) {
      const containerWidth = playerContainerRef.current.offsetWidth
      const containerHeight = playerContainerRef.current.offsetHeight

      const aspectRatio = 16 / 8

      let playerHeight = containerHeight
      let playerWidth = containerHeight * aspectRatio

      if (playerWidth > containerWidth) {
        playerWidth = containerWidth
        playerHeight = containerWidth / aspectRatio
      }

      if (playerHeight > containerHeight) {
        playerHeight = containerHeight
        playerWidth = playerHeight * aspectRatio
      }

      const playerWrapper = document.querySelector(
        '.plyr__video-wrapper'
      ) as HTMLElement
      if (playerWrapper !== null) {
        playerWrapper.style.maxWidth = `${playerWidth}px`
        playerWrapper.style.minWidth = `${playerWidth}px`
        playerWrapper.style.maxHeight = `${playerHeight}px`
        playerWrapper.style.minHeight = `${playerHeight}px`
      }
    }
  }

  useEffect(() => {
    updatePlayerSize()
    window.addEventListener('resize', updatePlayerSize)
    return () => {
      window.removeEventListener('resize', updatePlayerSize)
    }
  }, [currentMusic.song])

  // Event full screen
  useEffect(() => {
    const handleFullScreen = (event: any) => {
      if (event.target !== undefined) {
        const playerWrapper = document.querySelector(
          '.plyr__video-wrapper'
        ) as HTMLElement
        if (playerWrapper !== null) {
          playerWrapper.style.maxWidth = 'none'
          playerWrapper.style.minWidth = 'none'
          playerWrapper.style.maxHeight = 'none'
          playerWrapper.style.minHeight = 'none'
        }
      }
    }
    window.addEventListener('enterfullscreen', handleFullScreen)

    return () => {
      window.removeEventListener('enterfullscreen', handleFullScreen)
    }
  }, [])

  // Export config to file from store
  useEffect(() => {
    const handleExport = async () => {
      const state = usePlayerStore.getState()
      const exportState = {
        profile: state.profile,
        modeColor: state.modeColor,
        randomPlaylist: state.randomPlaylist,
        repeatPlaylist: state.repeatPlaylist,
        volume: state.volume,
        language: state.language,
        currentMusic: state.currentMusic,
        sections: state.sections,
        playlists: state.playlists,
        songs: state.songs
      }
      const json = JSON.stringify(exportState, null, 2)
      const response = await window.electronAPI.exportConfig(json)
      console.log(response) // true or false
    }

    window.electronAPI.receive('trigger-export-config', handleExport)

    return () => {
      window.electronAPI.removeListener('trigger-export-config', handleExport)
    }
  }, [])

  // Import config from file to store
  const importConfig = useCallback((_event: any, action: string) => {
    const configParsed = JSON.parse(action) as StoreType
    usePlayerStore.setState({
      profile: configParsed.profile,
      modeColor: configParsed.modeColor,
      randomPlaylist: configParsed.randomPlaylist,
      repeatPlaylist: configParsed.repeatPlaylist,
      volume: configParsed.volume,
      language: configParsed.language,
      currentMusic: configParsed.currentMusic,
      sections: configParsed.sections,
      playlists: configParsed.playlists,
      songs: configParsed.songs
    })
  }, [])

  useEffect(() => {
    window.electronAPI.receive('trigger-import-config', importConfig)
    return () => {
      window.electronAPI.removeListener('trigger-import-config', importConfig)
    }
  }, [])

  return (
    <div id="app" className="h-screen p-2 gap-3 overflow-x-hidden">
      <div className="[grid-area:main] overflow-y-auto">
        <Split
          className="flex flex-row h-full"
          sizes={[15, 85]}
          minSize={[250, 800]}
          gutterSize={10}
          cursor="col-resize"
        >
          <aside className="flex flex-col overflow-y-auto">
            <AsideMenu />
          </aside>

          <main
            ref={playerContainerRef}
            className="rounded-lg overflow-y-auto overflow-x-hidden w-full h-full flex items-center relative flex-col"
            style={{
              background: `linear-gradient(to bottom, ${currentColor}, #18181b)`,
              transition: 'opacity 0.5s ease'
            }}
          >
            {/* Just gradient with pictureInPicture is enable */}
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                background: `linear-gradient(to bottom, ${backGroundColor}, #18181b)`,
                transition: 'opacity 0.7s ease',
                opacity: pictureInPicture && playlistView === '0' ? 1 : 0
              }}
            />
            <Header />
            <div className="flex-grow flex justify-center items-center">
              <PlayerComponent />
            </div>
            {pictureInPicture && setPlaylist()}
          </main>
        </Split>
      </div>
      <footer className="[grid-area:player] flex flex-row h-[45px]">
        <Controls />
      </footer>
      <ModalUpdateStatus />
      <ModalDownloading />
      <ModalShowShortcuts />
    </div>
  )
}
