import { PlusIcon } from '@/icons/aside/Library'
import { type ISections } from '@/lib/data'
import { type StoreLoadingType, useLoadingStore } from '@/store/loadingStore'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function TitleSection (
  {
    section,
    handledIsEditSection,
    handledNewPlaylist
  }: {
    section: ISections
    handledIsEditSection: (id: string, title: string) => void
    handledNewPlaylist: (sectionID: string) => void
  }) {
  const { t } = useTranslation()
  const {
    sections,
    setSections,
  } = usePlayerStore<StoreType>((state) => state)
  const { setIsLoading, setMessageLoading } = useLoadingStore<StoreLoadingType>(
    (state) => state
  )
  // Drag and drop events and control blinking with useRef
  const [isDragOver, setIsDragOver] = useState(false)
  const dragCounter = useRef(0)

  // Drag and drop
  const handleDragEnter = (event: any) => {
    event.preventDefault()
    event.stopPropagation()
    dragCounter.current++
    if (dragCounter.current === 1) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (event: any) => {
    event.preventDefault()
    event.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setIsDragOver(false)
    }
  }

  const handleDragOver = (event: any) => {
    event.preventDefault()
    event.stopPropagation()
    if (dragCounter.current === 1) {
      setIsDragOver(true)
    }
  }

  // Add new songs to playlist
  const handleDrop = async (event: any) => {
    setMessageLoading(t('loading.loadingSongs'))
    setIsLoading(true)
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(false)
    dragCounter.current = 0
    const dataFiles = Array.from(event.dataTransfer.files) as unknown as File[]
    if (dataFiles.length === 0) return

    const newPlaylist = await window.electronAPI.getPlaylistFromDirectory(
      dataFiles.map((file) => file.path)
    )
    const newSections = sections.map((sec) => {
      if (sec.id === section.id) {
        return {
          ...sec,
          playlists: [...sec.playlists, ...newPlaylist]
        }
      }
      return sec
    })
    setSections(newSections)
    setIsLoading(false)
  }

  return (
      <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex mb-2 w-full
      ${isDragOver ? 'bg-zinc-700' : ''} `}
    >
      <header
        className="p-2 text-lg"
        onDoubleClick={() => {
          handledIsEditSection(section.id, section.title)
        }}
      >
        {section.title}
      </header>
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
  )
}
