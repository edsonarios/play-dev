import './App.css'
import AsideMenu from './components/aside/AsideMenu'
import Header from './components/body/Header'
import PlayerComponent from './components/body/player'
import Controls from './components/controls/Controls'
import { colors } from './lib/colors'
import { type StoreType, usePlayerStore } from './store/playerStore'
import { PlaylistPipMode } from './components/body/pipMode/Playlist'
import { PlaylistDetail } from './components/body/pipMode/PlaylistDetail'
interface fileWithMedata {
  name: string
  duration: number
}
interface OpenDirectoryDialog {
  directoryPath: string
  files: fileWithMedata[]
}

interface ElectronAPI {
  openDirectoryDialog: () => Promise<OpenDirectoryDialog>
  receive: (channel: string, func: (event: any, ...args: any[]) => void) => void
  removeListener: (channel: string, func: (...args: any[]) => void) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export default function App () {
  const { currentMusic, pictureInPicture, playlistView } = usePlayerStore<StoreType>(state => state)

  const currentColor = (currentMusic.playlist != null) ? currentMusic.playlist?.color.dark : colors.gray.dark

  const setPlaylist = () => {
    if (pictureInPicture && playlistView !== 0) {
      return <PlaylistDetail id={playlistView} />
    }
    return <PlaylistPipMode />
  }
  return (
    <div id='app' className='relative h-screen p-2 gap-3'>
      <aside className='[grid-area:aside] flex-col flex overflow-y-auto'>
        <AsideMenu />
      </aside>

      <main
        className='[grid-area:main] rounded-lg overflow-y-auto w-full h-full flex justify-center items-center flex-col relative'
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
            opacity: pictureInPicture && playlistView === 0 ? 1 : 0
          }}
        />
        <Header />
        <PlayerComponent />
        {pictureInPicture && setPlaylist()}
      </main>

      <footer className='[grid-area:player] h-[80px]'>
        <Controls />
      </footer>
    </div>
  )
}
