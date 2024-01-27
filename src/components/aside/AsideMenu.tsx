import { HomeIcon } from '@/icons/aside/Home'
import { LibraryIcon, PlusIcon } from '@/icons/aside/Library'
import SideMenuCard from './SideMenuCard'
import SideMenuItem from './SideMenuItem'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { FolderIcon } from '@/icons/aside/Folder'
import { Playlist } from '@/lib/entities/playlist.entity'
import { getRandomColor, getRandomImage } from '@/utils/random'
import {
  DndContext,
  useSensors,
  type DragEndEvent,
  useSensor,
  MouseSensor,
  TouchSensor
} from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { OpenFolder } from '../services/ElectronUtils'
import { withViewTransition } from '@/utils/transition'
import { useTranslation } from 'react-i18next'

export default function AsideMenu () {
  const { t } = useTranslation()
  const {
    playlists,
    setPlaylists,
    setSongs,
    songs,
    homeHideSongs,
    setHomeHideSongs,
    setPlaylistView,
    setPictureInPicture,
    setIsLoading
  } = usePlayerStore<StoreType>((state) => state)

  const handleSelectFolder = async () => {
    await OpenFolder(playlists, setPlaylists, setSongs, songs, setIsLoading)
  }

  const handledNewPlaylist = () => {
    withViewTransition(() => {
      const newPlaylist = new Playlist({
        id: window.crypto.randomUUID(),
        albumId: '',
        title: 'New Playlist',
        color: getRandomColor(),
        cover: [getRandomImage()],
        artists: []
      })
      const currentPlaylists = playlists
      currentPlaylists.push(newPlaylist)
      setPlaylists(currentPlaylists)
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    const activeId = active.id as string
    const overId = over?.id as string
    if (overId === undefined) return
    const currentPlaylists = playlists
    const activeIndex = currentPlaylists.findIndex(
      (playlist) => playlist.id === activeId
    )
    const overIndex = currentPlaylists.findIndex(
      (playlist) => playlist.id === overId
    )
    const [removed] = currentPlaylists.splice(activeIndex, 1)
    currentPlaylists.splice(overIndex, 0, removed)
    setPlaylists(currentPlaylists)
  }

  // Delay in drang and drop
  const activationConstraint = {
    delay: 150,
    tolerance: 5
  }
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint
    }),
    useSensor(TouchSensor, {
      activationConstraint
    })
  )

  const handledHome = () => {
    setHomeHideSongs(!homeHideSongs)
    setPlaylistView('0')
    setPictureInPicture(true)
  }

  const handledExportStore = () => {
    console.log('Your Library')
  }

  return (
    <nav className="flex flex-col flex-1 gap-2 overflow-y-auto">
      <div className="bg-zinc-900 rounded-lg p-2">
        <ul>
          <SideMenuItem
            Icon={HomeIcon}
            text={t('aside.home')}
            href="#"
            handledFunction={handledHome}
          />
          <SideMenuItem
            Icon={FolderIcon}
            text={t('aside.folder')}
            href="#"
            handledFunction={handleSelectFolder}
          />
        </ul>
      </div>

      <div className="bg-zinc-900 rounded-lg p-2 flex-1 overflow-y-auto">
        <ul>
          <div className="flex justify-between">
            <SideMenuItem
              Icon={LibraryIcon}
              text={t('aside.library')}
              href="#"
              handledFunction={handledExportStore}
            />
            <button
              className="self-center mt-2 p-2 rounded-full opacity-70 hover:bg-zinc-800 hover:opacity-100"
              onClick={handledNewPlaylist}
              title={t('aside.newPlaylist')}
            >
              <PlusIcon />
            </button>
          </div>
          <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
            <SortableContext items={playlists.map((playlist) => playlist.id)}>
              {playlists.map((playlist) => (
                <SideMenuCard key={playlist.id} playlist={playlist} />
              ))}
            </SortableContext>
          </DndContext>
        </ul>
      </div>
    </nav>
  )
}
