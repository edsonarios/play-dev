import { HomeIcon } from '@/icons/aside/Home'
import { LibraryIcon, PlusIcon } from '@/icons/aside/Library'
import SideMenuCard from './SideMenuCard'
import SideMenuItem from './SideMenuItem'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { FolderIcon } from '@/icons/aside/Folder'
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
import { type ISections, type IPlaylist } from '@/lib/data'

export default function AsideMenu () {
  const { t } = useTranslation()
  const {
    playlists,
    setPlaylists,
    homeHideSongs,
    setHomeHideSongs,
    setPlaylistView,
    setPictureInPicture,
    setIsLoading,
    sections,
    setSections
  } = usePlayerStore<StoreType>((state) => state)

  const handledOpenFolder = async () => {
    await OpenFolder(sections, setSections, setIsLoading)
  }

  const handledNewPlaylist = (sectionID: string) => {
    withViewTransition(() => {
      const newPlaylist: IPlaylist = {
        id: window.crypto.randomUUID(),
        albumId: '',
        title: 'New Playlist',
        color: getRandomColor(),
        cover: [getRandomImage()],
        artists: [],
        songs: []
      }
      const newSections = structuredClone(sections)
      newSections.map((section) => {
        if (section.id === sectionID) {
          section.playlists.push(newPlaylist)
        }
        return section
      })
      setSections(newSections)
    })
  }

  const handledNewSection = () => {
    const newSection: ISections = {
      id: window.crypto.randomUUID(),
      title: 'New Section',
      playlists: []
    }
    setSections([...sections, newSection])
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
    delay: 300,
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

  const handledDeleteSection = (sectionID: string) => {
    if (sectionID === '1') return
    const newSections = sections.filter((section) => section.id !== sectionID)
    setSections(newSections)
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
            handledFunction={handledOpenFolder}
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
              onClick={handledNewSection}
              title={t('aside.newSection')}
            >
              <PlusIcon />
            </button>
          </div>
          {sections.map((section) => (
            <div key={section.id}>
              <div className="relative group flex">
                <button
                  className="absolute z-20 bg-slate-900 w-2 rounded-md text-xs opacity-0 hover:opacity-70 transition-opacity"
                  onClick={() => {
                    handledDeleteSection(section.id)
                  }}
                  title={t('aside.deleteSection')}
                >
                  X
                </button>
                <header className="p-2 text-lg">{section.title}</header>
                <button
                  className="self-center p-2 rounded-full opacity-0 hover:bg-zinc-800 group-hover:opacity-100"
                  onClick={() => {
                    handledNewPlaylist(section.id)
                  }}
                  title={t('aside.newPlaylist')}
                >
                  <PlusIcon className="w-3 h-3" />
                </button>
              </div>
              <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
                <SortableContext
                  items={playlists.map((playlist) => playlist.id)}
                >
                  {section.playlists.map((playlist) => (
                    <SideMenuCard
                      key={playlist.id}
                      sectionID={section.id}
                      playlist={playlist}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          ))}
        </ul>
      </div>
    </nav>
  )
}
