import './App.css'
import AsideMenu from './components/aside/AsideMenu'
import Header from './components/body/Header'
import PlayerComponent from './components/body/player'
import Controls from './components/controls/Controls'
import { colors } from './lib/colors'
import { type StoreType, usePlayerStore } from './store/playerStore'
import { PlaylistPipMode } from './components/body/pipMode/Playlist'
import { PlaylistDetail } from './components/body/pipMode/PlaylistDetail'
import { useEffect, useRef, useState } from 'react'
import Split from 'react-split'
import { type IPlaylist, type ISong } from './lib/data'

interface OpenDirectoryDialog {
  playlist: IPlaylist
  songs: ISong[]
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
    modeColor
  } = usePlayerStore<StoreType>((state) => state)

  const [currentColor, setCurrentColor] = useState(colors.gray.dark)
  let backGroundColor = colors.gray[modeColor as keyof typeof colors.gray]
  useEffect(() => {
    let newColor = colors.gray.dark
    let codeColor = colors.gray
    if (playlistView !== '0' && pictureInPicture) {
      // Take color in pip mode from current view playlist
      const viewPlaylist = playlists.find(
        (playlist) => playlist.id === playlistView
      )
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
        <PlaylistDetail
          playlistID={playlistView}
          setCurrentColor={setCurrentColor}
        />
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

  return (
    <div id="app" className="h-screen p-2 gap-3 overflow-x-hidden">
      <div className="[grid-area:main] overflow-y-auto">
        <Split
          className="flex flex-row h-full"
          sizes={[15, 85]}
          minSize={[300, 800]}
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
      <footer className="[grid-area:player] flex flex-row h-[80px]">
        <Controls />
      </footer>
    </div>
  )
}
