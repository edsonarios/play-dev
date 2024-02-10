import { DeleteOptionsIcon } from '@/icons/playlist/Options'
import { PauseTableIcon, PlayTableIcon } from '@/icons/playlist/PlayPause'
import { type ISong } from '@/lib/data'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { withViewTransition } from '@/utils/transition'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { formatTime } from 'electron/utils'
import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface IDragableRow {
  song: ISong
  index: number
  playSong: (song: ISong) => void
  deleteSong: (song: ISong) => void
}
export function DragableRow ({
  song,
  index,
  playSong,
  deleteSong
}: IDragableRow) {
  const { t } = useTranslation()

  const {
    currentMusic,
    songsIdSelected,
    setSongsIdSelected,
    lastSongIdSelected,
    setLastSongIdSelected,
    sections,
    setSections,
    currentSectionView,
    currentPlaylistView,
    setCurrentPlaylistView,
    isPlaying
  } = usePlayerStore<StoreType>((state) => state)
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    overIndex
  } = useSortable({
    id: song.id,
    transition: {
      duration: 300,
      easing: 'cubic-bezier(1,1,0,0)'
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleRowClick = (event: any) => {
    const ctrl = event.ctrlKey as boolean
    const shift = event.shiftKey as boolean
    const alt = event.altKey as boolean

    if (!ctrl && !shift && !alt) {
      const isSelected = songsIdSelected.includes(song.id)
      setSongsIdSelected(isSelected ? [] : [song.id])
      setLastSongIdSelected(isSelected ? '' : song.id)
    }
    if (ctrl) {
      const isSelected = songsIdSelected.includes(song.id)
      setSongsIdSelected(
        isSelected
          ? songsIdSelected.filter((id) => id !== song.id)
          : [...songsIdSelected, song.id]
      )
    }
    if (shift && lastSongIdSelected !== '') {
      const lasSongIdSelectedIndex = currentPlaylistView?.songs.findIndex(
        (song) => song.id === lastSongIdSelected
      )
      const range = [lasSongIdSelectedIndex, index].sort((a, b) => a! - b!)
      const rangeSelected = currentPlaylistView?.songs
        .slice(range[0], range[1]! + 1)
        .map((song) => song.id)
      setSongsIdSelected(rangeSelected!)
    }
    if (shift && lastSongIdSelected === '') {
      const range = [0, index].sort((a, b) => a - b)
      const rangeSelected = currentPlaylistView?.songs
        .slice(range[0], range[1] + 1)
        .map((song) => song.id)
      setSongsIdSelected(rangeSelected!)
    }
  }

  const isSongSelected = songsIdSelected.includes(song.id)

  // Drag and drop events and control blinking with useRef
  const [isDragOver, setIsDragOver] = useState(false)
  const dragCounter = useRef(0)

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

  // Insert new songs by drag and drop
  const handleDrop = async (event: any, songIndex: ISong) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(false)
    dragCounter.current = 0

    const dataFiles = Array.from(event.dataTransfer.files) as unknown as File[]
    const filesWithMetadata = await window.electronAPI.getMusicMetadata(
      dataFiles.map((file) => file.path)
    )
    // Use DataTransferItemList interface to access the file(s)
    if (dataFiles !== undefined) {
      if (dataFiles.length > 0) {
        const songsToAdd: ISong[] = []
        for (const item of filesWithMetadata) {
          const newSong: ISong = {
            ...item,
            albumId: song.albumId,
            image: song.image
          }
          songsToAdd.push(newSong)
        }
        const newSections = structuredClone(sections)
        const newPlaylist = structuredClone(
          newSections
            .find((section) => section.id === currentSectionView)
            ?.playlists.find((ply) => ply.id === currentPlaylistView?.id)
        )
        const newPlaylistSongs = structuredClone(newPlaylist?.songs)
        const indexSong = newPlaylistSongs?.findIndex(
          (song) => song.id === songIndex.id
        )
        newPlaylistSongs?.splice(indexSong!, 0, ...songsToAdd)
        const newSectionToAdd = newSections.map((section) => {
          if (section.id === currentSectionView) {
            section.playlists = section.playlists.map((playlist) => {
              if (playlist.id === currentPlaylistView?.id) {
                playlist.songs = newPlaylistSongs!
              }
              return playlist
            })
          }
          return section
        })
        withViewTransition(() => {
          setCurrentPlaylistView({
            ...currentPlaylistView!,
            songs: newPlaylistSongs!
          })
          setSections(newSectionToAdd)
        })
      }
    }
  }

  return (
    <tr
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      key={song.id}
      className={`border-spacing-0 text-gray-300 text-sm font-light overflow-hidden transition duration-300 select-none
      ${isDragging ? 'opacity-30' : ''}
      ${overIndex === index ? 'border-2 border-green-500 ' : ''}
      ${
        overIndex === index && song.isDragging ? 'border-2 border-red-500 ' : ''
      }
      ${!isSongSelected ? 'hover:bg-white/5' : ''}
      ${isSongSelected ? 'bg-white/10' : ''}
      ${song.isDragging ? 'opacity-0' : ''}
      ${isDragOver ? 'border-t-4 border-blue-600 border-opacity-60' : ''}`}
      style={style}
      onClick={handleRowClick}
      onDoubleClick={() => { playSong(song) }}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(event) => {
        void handleDrop(event, song)
      }}
    >
      {/* Id or equaliser icon */}
      <td
        className={
          'group relative px-4 py-2 rounded-tl-lg rounded-bl-lg w-5'
        }
      >
        {currentMusic.song?.id === song.id &&
        currentMusic.song?.albumId === song.albumId ? (
          <img
            src="equaliser-animated-green.gif"
            alt="equaliser"
            width={16}
            className="group-hover:opacity-0"
          />
            ) : (
          <div className='group-hover:opacity-0'>{index + 1}</div>
            )}
        <button
          className="absolute p-2 right-2 bottom-4 opacity-0 group-hover:opacity-80 z-10 "
          onClick={() => { playSong(song) }}
        >
          {currentMusic.song?.id === song.id && isPlaying
            ? <PauseTableIcon />
            : <PlayTableIcon />}
        </button>
      </td>
      {/* Title */}
      <td className="px-4 py-2 flex gap-3">
        <picture className="">
          <img src={song.image} alt={song.title} className="w-11 h-11" />
        </picture>
        <div className="flex flex-col">
          <h3
            className={`text-base font-normal
        ${
          currentMusic.song?.id === song.id &&
          currentMusic.song.albumId === song.albumId
            ? 'text-green-500'
            : ''
        }
        `}
          >
            {song.title}
          </h3>
          <span>
            {song.artists !== undefined && song.artists.length > 0
              ? song.artists.join(', ')
              : ''}
          </span>
        </div>
      </td>
      {/* Album name */}
      <td className="px-4 py-2">{song.album}</td>
      {/* Time duration */}
      <td className="px-4 py-2">{formatTime(song.duration)}</td>
      {/* Delete Song Button */}
      <td className="relative text-zinc-400 px-4 py-2 rounded-tr-lg rounded-br-lg">
        <button
          className="opacity-10 hover:opacity-100 p-1"
          onClick={() => {
            deleteSong(song)
          }}
          title={t('playlist.deleteSong')}
        >
          <DeleteOptionsIcon />
        </button>
        <div
          className={`absolute flex items-center justify-center rounded-full bg-blue-600 text-white p-1 w-6 h-6 opacity-0 top-4 right-4 ${
            isDragging && songsIdSelected.length > 0 ? 'opacity-100' : ''
          }`}
        >
          {songsIdSelected.length}
        </div>
      </td>
    </tr>
  )
}
