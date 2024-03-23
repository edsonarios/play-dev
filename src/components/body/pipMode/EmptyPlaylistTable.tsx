import { type IPlaylist } from '@/lib/data'
import { type StoreLoadingType, useLoadingStore } from '@/store/loadingStore'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type StoreType, usePlayerStore } from '../../../store/playerStore'
import { withViewTransition } from '@/utils/transition'

export function EmptyPlaylistTable ({
  playlist,
}: {
  playlist: IPlaylist | undefined
}) {
  const { t } = useTranslation()

  const { sections, setSections, currentPlaylistView, setCurrentPlaylistView } = usePlayerStore<StoreType>((state) => state)
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

  const handleDrop = async (event: any) => {
    setMessageLoading(t('loading.loadingSongs'))
    event.preventDefault()
    setIsDragOver(false)

    const dataFiles = Array.from(event.dataTransfer.files) as unknown as File[]
    const filesWithMetadata = await window.electronAPI.getMusicMetadata(
      dataFiles.map((file) => file.path)
    )
    console.log(filesWithMetadata)

    if (filesWithMetadata.length === 0) return
    const sectionsCloned = structuredClone(sections)
    let currentCover = ''
    const newSections = sectionsCloned.map((section) => {
      return {
        ...section,
        playlists: section.playlists.map((ply) => {
          if (ply.id === playlist?.id) {
            return {
              ...ply,
              songs: filesWithMetadata.map((song) => {
                currentCover = ply.cover[0]
                return {
                  ...song,
                  image: ply.cover[0],
                }
              }),
            }
          }
          return ply
        }),
      }
    })
    if (currentPlaylistView === undefined) return
    withViewTransition(() => {
      setCurrentPlaylistView({
        ...currentPlaylistView,
        songs: filesWithMetadata.map((song) => {
          return {
            ...song,
            image: currentCover,
          }
        }),
      })
      setSections(newSections)
    })
    setIsLoading(false)
  }
  return (
    <h1
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full h-56 flex justify-center items-center
        ${isDragOver ? 'border-2' : ''}`}
    >
      {t('playlist.empty')}
    </h1>
  )
}
