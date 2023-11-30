import './App.css'
import AsideMenu from './components/aside/AsideMenu'
import Header from './components/body/Header'
import PlayerComponent from './components/body/player'
import Controls from './components/controls/Controls'
import { colors } from './lib/colors'
import { type StoreType, usePlayerStore } from './store/playerStore'

export default function App () {
  const { currentMusic } = usePlayerStore<StoreType>(state => state)
  const currentColor = (currentMusic.playlist != null) ? currentMusic.playlist?.color.dark : colors.gray.dark

  return (
    <div id='app' className='relative h-screen p-2 gap-3'>
      <aside className='[grid-area:aside] flex-col flex overflow-y-auto'>
        <AsideMenu />
      </aside>

      <main
        className='[grid-area:main] rounded-lg overflow-y-auto w-full h-full flex justify-center items-center flex-col'
        style={{
          background: `linear-gradient(to bottom, ${currentColor}, #18181b)`
        }}
      >
        <Header />
        <PlayerComponent />
      </main>

      <footer className='[grid-area:player] h-[80px]'>
        <Controls />
      </footer>
    </div>
  )
}
