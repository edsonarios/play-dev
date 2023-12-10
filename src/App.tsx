import './App.css'
import AsideMenu from './components/aside/AsideMenu'
import Header from './components/body/Header'
import PlayerComponent from './components/body/player'
import Controls from './components/controls/Controls'
import { colors } from './lib/colors'
import { type StoreType, usePlayerStore } from './store/playerStore'
import { PlaylistPipMode } from './components/body/pipMode/Playlist'
import { PlaylistDetail } from './components/body/pipMode/PlaylistDetail'
import { useEffect, useState } from 'react'
import Split from 'react-split'

interface fileWithMedata {
  id: string
  name: string
  duration: number
}
interface OpenDirectoryDialog {
  directoryPath: string
  files: fileWithMedata[]
}

interface ElectronAPI {
  openDirectoryDialog: () => Promise<OpenDirectoryDialog>
  receive: (
    channel: string,
    func: (event: any, ...args: any[]) => void
  ) => void
  removeListener: (channel: string, func: (...args: any[]) => void) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export default function App () {
  const { currentMusic, pictureInPicture, playlistView, playlists } =
    usePlayerStore<StoreType>((state) => state)

  const [currentColor, setCurrentColor] = useState(colors.gray.dark)
  useEffect(() => {
    let newColor = colors.gray.dark
    if (playlistView !== '0' && pictureInPicture) {
      const viewPlaylist = playlists.find(
        (playlist) => playlist.id === playlistView
      )
      if (viewPlaylist !== undefined) {
        newColor = viewPlaylist.color.dark
      }
    } else {
      newColor = currentMusic.playlist?.color.dark ?? colors.gray.dark
    }
    setCurrentColor(newColor)
  }, [playlistView, pictureInPicture, currentMusic.playlist])

  const setPlaylist = () => {
    if (pictureInPicture && playlistView !== '0') {
      return <PlaylistDetail playlistID={playlistView} />
    }
    return <PlaylistPipMode />
  }

  return (
    <div id="app" className="h-screen p-2 gap-3">
      <div className="[grid-area:main] overflow-y-auto">
        <Split
          className="flex flex-row h-full"
          sizes={[15, 85]}
          minSize={[300, 900]}
          gutterSize={10}
          cursor="col-resize"
        >
          <aside className="flex flex-col overflow-y-auto">
            <AsideMenu />
          </aside>

          <main
            className="rounded-lg overflow-y-auto w-full h-full flex justify-center items-center relative flex-col"
            style={{
              background: `linear-gradient(to bottom, ${currentColor}, #18181b)`,
              transition: 'opacity 0.5s ease'
            }}
          >
            {/* Just gradient with pictureInPicture is enable */}
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                background: 'linear-gradient(to bottom, #2c2c2c, #18181b)',
                transition: 'opacity 0.7s ease',
                opacity: pictureInPicture && playlistView === '0' ? 1 : 0
              }}
            />
            <Header />
            <PlayerComponent />
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
