'use client'
import { useEffect, useRef, useState } from 'react'
import { type IPlaylist, type ISong } from '@/lib/data'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { CardPlayButton } from '../CardPlay'
import { shuffleSongsWithCurrentSong } from '@/utils/random'
import { VolumeAsideIcon } from '@/icons/aside/Volume'
import { formatTime } from '@/utils/time'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { withViewTransition } from '@/utils/transition'
import { useTranslation } from 'react-i18next'
import { type StoreLoadingType, useLoadingStore } from '@/store/loadingStore'
import { PencilIcon } from '@/icons/edit/Pencil'

interface CardPlaylist {
  sectionID: string
  playlist: IPlaylist
}

export default function SideMenuCard ({ sectionID, playlist }: CardPlaylist) {
  const { t } = useTranslation()
  const {
    setCurrentMusic,
    currentMusic,
    setIsPlaying,
    randomPlaylist,
    songRefToScroll,
    setSongRefToScroll,
    homeHideSongs,
    sections,
    setSections,
    setPlaylistView,
    setCurrentPlaylistView,
    currentPlaylistView,
  } = usePlayerStore<StoreType>((state) => state)
  const { setIsLoading, setMessageLoading } = useLoadingStore<StoreLoadingType>(
    (state) => state
  )
  const [isPlaylistExpanded, setIsPlaylistExpanded] = useState(false)
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: playlist.id,
    transition: {
      duration: 300,
      easing: 'cubic-bezier(1,1,0,0)',
    },
    disabled: isPlaylistExpanded,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const [currentSongs, setCurrentSongs] = useState<ISong[]>([])
  useEffect(() => {
    if (isPlaylistExpanded) {
      setCurrentSongs(playlist.songs)
    }
  }, [sections])

  const artistsString = playlist.artists.join(', ')

  const displayPlaylist = () => {
    if (isEditPlaylist !== '') return
    if (isPlaylistExpanded) {
      setIsPlaylistExpanded(false)
    } else {
      setIsPlaylistExpanded(true)
    }
    if (isPlaylistExpanded && currentSongs.length > 0) {
      setCurrentSongs([])
      return
    }
    const playListSongs = playlist.songs
    setCurrentSongs(playListSongs)
  }

  const [isEditPlaylist, setIsEditPlaylist] = useState('')
  const [valueEditPlaylist, setValueEditPlaylist] = useState('')
  const handledIsEditPlaylistName = (playlistID: string, playlistTitle: string) => {
    withViewTransition(() => {
      setIsEditPlaylist(playlistID)
      setValueEditPlaylist(playlistTitle)
    })
  }

  const handledEditTitlePlaylist = (newValueEditPlaylist: string) => {
    const newSections = structuredClone(sections)
    const sectionsUpdated = newSections.map((section) => {
      return {
        ...section,
        playlists: section.playlists.map((ply) => {
          if (ply.id === playlist.id) {
            return {
              ...ply,
              title: newValueEditPlaylist,
            }
          }
          return ply
        }),
      }
    })
    setSections(sectionsUpdated)
  }

  const playSong = (song: ISong) => {
    let playListSongs = playlist.songs

    if (randomPlaylist) {
      playListSongs = shuffleSongsWithCurrentSong(playListSongs, song.id)
    }
    setCurrentMusic({
      playlist,
      song,
      songs: playListSongs,
    })

    setIsPlaying(true)
  }

  const delPlaylist = () => {
    withViewTransition(() => {
      if (playlist.id === '1') {
        const newSections = structuredClone(sections)
        const sectionUpdated = newSections.map((section) => {
          const newPlaylist = section.playlists.map((ply) => {
            if (ply.id === '1') {
              return {
                ...ply,
                songs: [],
              }
            }
            return ply
          })
          return {
            ...section,
            playlists: newPlaylist,
          }
        })
        setSections(sectionUpdated)
        setCurrentSongs([])
        setIsPlaylistExpanded(false)
        return
      }
      const newSections = structuredClone(sections)
      const currentSectionIndex = newSections.findIndex(
        (section) => section.id === sectionID
      )
      if (currentSectionIndex === -1) return
      const newPlaylists = newSections[currentSectionIndex].playlists.filter(
        (item) => item.id !== playlist.id
      )
      newSections[currentSectionIndex].playlists = newPlaylists
      setSections(newSections)
      if (playlist.id === currentPlaylistView?.id) {
        setPlaylistView('0')
      }
    })
  }

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

    const filesWithMetadata = await window.electronAPI.getMusicMetadata(
      dataFiles.map((file) => file.path)
    )
    const songsToAdd = filesWithMetadata.map((item) => ({
      ...item,
      albumId: playlist.id,
      image: playlist.cover[0],
    }))

    const newSections = sections.map((section) => {
      if (section.id !== sectionID) return section
      const newPlaylists = section.playlists.map((ply) => {
        if (ply.id === playlist.id) {
          return {
            ...ply,
            songs: [...ply.songs, ...songsToAdd],
          }
        }
        return ply
      })
      return {
        ...section,
        playlists: newPlaylists,
      }
    })
    // Update sections
    setSections(newSections)

    // Update aside playlist
    if (isPlaylistExpanded) {
      setCurrentSongs([...currentSongs, ...songsToAdd])
    }
    // Update current playlist view
    if (playlist.id === currentPlaylistView?.id) {
      setCurrentPlaylistView({
        ...currentPlaylistView,
        songs: [...currentPlaylistView.songs, ...songsToAdd],
      })
    }

    // Update current playlist if is playing
    if (playlist.id === currentMusic.playlist?.id) {
      const newSongsToAdd = [...currentMusic.playlist.songs, ...songsToAdd]
      const newSongs = randomPlaylist
        ? shuffleSongsWithCurrentSong(newSongsToAdd, currentMusic.song!.id)
        : newSongsToAdd
      setCurrentMusic({
        ...currentMusic,
        playlist: {
          ...currentMusic.playlist,
          songs: newSongsToAdd,
        },
        songs: newSongs,
      })
    }
    setIsLoading(false)
  }

  // Focus in current song
  const songRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (songRefToScroll === undefined || currentSongs === undefined) return
    if (
      currentSongs !== undefined &&
      playlist.id === songRefToScroll.albumId &&
      !isPlaylistExpanded
    ) {
      setIsPlaylistExpanded(true)
      const playListSongs = playlist.songs
      setCurrentSongs(playListSongs)
      setSongRefToScroll(undefined)
    }
    const currentSong = currentSongs.find(
      (song) => song.id === currentMusic.song?.id
    )
    if (songRefToScroll.id === currentSong?.id) {
      songRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setSongRefToScroll(undefined)
    }
  }, [songRefToScroll])

  // Hiden all songs from playlists
  useEffect(() => {
    if (currentSongs === undefined || currentSongs.length === 0) return
    setIsPlaylistExpanded(false)
    setCurrentSongs([])
  }, [homeHideSongs])

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`${isDragOver ? 'bg-zinc-700' : ''} overflow-auto relative
      ${isDragging ? 'opacity-50' : ''}`}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      key={playlist.id}
      style={style}
    >
      {/* Delte Playlist button */}
      <button
        className="absolute z-20 bg-slate-900 w-5 rounded-md text-base opacity-0 hover:opacity-70 transition-opacity"
        onClick={delPlaylist}
        title={t('playlist.deletePlaylist')}
      >
        X
      </button>
      {/* Edit Playlist button */}
      {currentSongs.length === 0 && !isPlaylistExpanded && (
        <button
          className="absolute z-20 bg-slate-900 w-3 rounded-md text-base opacity-0 hover:opacity-70 transition-opacity bottom-0 left-0"
          onClick={() => {
            handledIsEditPlaylistName(playlist.id, playlist.title)
          }}
          title={t('aside.editPlaylist')}
        >
          <PencilIcon />
        </button>
      )}
      {/* Playlist item */}
      <a
        href="#"
        className="playlist-item flex relative group p-2 overflow-hidden items-center gap-5 rounded-md hover:bg-zinc-800"
        onClick={displayPlaylist}
      >
        {/* Image Playlist */}
        <picture className="h-12 w-12 flex-none">
          <img
            src={playlist.cover[0]}
            alt={`Cover of ${playlist.title} by ${artistsString}`}
            className="object-cover w-full h-full rounded-md"
          />
        </picture>

        {/* Edit Playlist Name */}
        {isEditPlaylist !== '' ? (
          <label
            className={`flex bg-zinc-700 rounded-md opacity-60 border-2
            ${isEditPlaylist !== '' ? ' border-white' : ''}`}
          >
            <input
              type="text"
              value={valueEditPlaylist}
              onChange={(event) => {
                setValueEditPlaylist(event.target.value)
              }}
              className="rounded-xl p-1 bg-transparent outline-none text-base"
              placeholder={'...'}
              autoFocus
              onBlur={() => {
                withViewTransition(() => {
                  setIsEditPlaylist('')
                })
              }}
              onKeyDown={(e) => {
                withViewTransition(() => {
                  if (e.key === 'Enter') {
                    handledEditTitlePlaylist(valueEditPlaylist)
                    setIsEditPlaylist('')
                  } else if (e.key === 'Escape') {
                    setValueEditPlaylist('')
                    setIsEditPlaylist('')
                  }
                })
              }}
            />
          </label>
        ) : (
          <div className="flex flex-auto flex-col truncate">
            {/* Title and Artist */}
            <h4
              className={`${
                currentMusic.song?.albumId === playlist.id
                  ? 'text-green-400'
                  : 'text-white'
              } text-sm`}
            >
              {playlist.title}
            </h4>
            <span className="text-xs text-gray-400">{artistsString}</span>
          </div>
        )}
        {/* Play button */}
        {isEditPlaylist === '' && (
          <div className="absolute right-4 bottom-4 translate-y-4 transition-all duration-500 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-10">
            <CardPlayButton playlist={playlist} />
          </div>
        )}
        {playlist.id === currentMusic.playlist?.id && (
          <div className="absolute right-[26px] bottom-[35px] translate-y-4 transition-all duration-500 opacity-100 group-hover:translate-y-0 group-hover:opacity-0 z-10 text-green-400">
            <VolumeAsideIcon />
          </div>
        )}
      </a>

      {/* Playlist songs */}
      {currentSongs.length > 0 && (
        <div className="bg-zinc-800 rounded-md">
          <ul className="flex flex-col ">
            {currentSongs.map((song, index) => (
              <li
                key={song.id}
                className={`${
                  isDragOver ? 'bg-zinc-700' : ''
                } hover:bg-zinc-900 rounded-md p-2 pl-0 flex flex-row justify-between`}
                onClick={() => {
                  playSong(song)
                }}
              >
                <a
                  href="#"
                  className={`${
                    currentMusic.song?.id === song.id &&
                    currentMusic.song?.albumId === song.albumId
                      ? 'text-green-400'
                      : 'text-white'
                  } text-sm ml-4 truncate flex flex-row mr-4`}
                >
                  {/* id or equaliser gif */}
                  {/* ref just to current song */}
                  <div
                    ref={currentMusic.song?.id === song.id ? songRef : null}
                    className="mr-3 flex-shrink-0"
                  >
                    {currentMusic.song?.id === song.id &&
                    currentMusic.song?.albumId === song.albumId ? (
                      <img
                        src="equaliser-animated-green.gif"
                        alt="equaliser"
                        width={16}
                        height={16}
                      />
                        ) : (
                          index + 1
                        )}
                  </div>

                  {/* Song title */}
                  <div className="truncate">{song.title}</div>
                </a>

                {/* Song duration */}
                <div className="text-xs text-zinc-500">
                  {formatTime(song.duration)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {isPlaylistExpanded && currentSongs.length === 0 && (
        <h3 className="ml-4 mt-1 text-xs">Not Found Songs in this playlist</h3>
      )}
    </div>
  )
}
