import { CardPlayButton } from '@/components/CardPlay'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { formatTotalDuration } from '@/utils/time'
import { PlaylistTable } from './PlaylistTable'
import { DeleteOptionsIcon } from '@/icons/playlist/Options'
import { useCallback, useEffect, useState } from 'react'
import { SearchLittleIcon } from '@/icons/aside/Search'
import debounce from 'lodash.debounce'
import ModalEditPlaylist from './ModalEditPlaylist'
import { withViewTransition } from '@/utils/transition'
import { useTranslation } from 'react-i18next'
import { type ISong } from '@/lib/data'

export function PlaylistDetail () {
  const { t } = useTranslation()

  const {
    setPlaylistView,
    editTemporallyTitle,
    setEditTemporallyTitle,
    setEditTemporallyColor,
    editTemporallyCover,
    setEditTemporallyCover,
    sections,
    setSections,
    setEditTemporallySection,
    currentSectionView,
    currentPlaylistView,
    setCurrentPlaylistView
  } = usePlayerStore<StoreType>((state) => state)
  const totalDurationSongs = currentPlaylistView?.songs.reduce(
    (acc, song) => acc + song.duration,
    0
  )

  // search song in playlist
  const [currentPlaylistSongs, setCurrentPlaylistSongs] = useState<ISong[]>([])
  useEffect(() => {
    setCurrentPlaylistSongs(currentPlaylistView?.songs ?? [])
  }, [sections])

  const deletePlaylist = () => {
    withViewTransition(() => {
      if (currentPlaylistView === undefined) return
      if (currentPlaylistView.id === '1') {
        const newSections = sections.map((section) => {
          const newPlaylists = section.playlists.map((playlist) => {
            if (playlist.id === '1') {
              return {
                ...playlist,
                songs: []
              }
            }
            return playlist
          })
          return {
            ...section,
            playlists: newPlaylists
          }
        })
        setSections(newSections)
        setCurrentPlaylistView({
          ...currentPlaylistView,
          songs: []
        })
        return
      }
      const newSections = sections.map((section) => {
        const newPlaylists = section.playlists.filter(
          (playlist) => playlist.id !== currentPlaylistView.id
        )
        return {
          ...section,
          playlists: newPlaylists
        }
      })
      setSections(newSections)
      setPlaylistView('0')
    })
  }

  // Search song in playlist with debounce
  const [inputValue, setInputValue] = useState('')
  const debouncedFilterSong = useCallback(
    debounce(setCurrentPlaylistSongs, 300),
    []
  )
  const [isSearching, setIsSearching] = useState(false)
  const handleInputChange = (value: string) => {
    setInputValue(value)
    if (currentPlaylistView === undefined) return
    const newCurrentPlaylistSongs = currentPlaylistView.songs.filter((song) => {
      const title = song.title.toLowerCase()
      const album = song.album.toLowerCase()
      const filter = value.toLowerCase()
      return title.includes(filter) || album.includes(filter)
    })
    debouncedFilterSong(newCurrentPlaylistSongs)
  }

  const handleClearFilter = () => {
    setInputValue('')
    setCurrentPlaylistSongs(currentPlaylistView?.songs ?? [])
  }

  // Open modal edit playlist
  const [isOpen, setIsOpen] = useState(false)
  const handledOpenEditPlaylist = () => {
    withViewTransition(() => {
      if (currentPlaylistView === undefined) return
      setEditTemporallyTitle(currentPlaylistView.title)
      setEditTemporallyColor(currentPlaylistView.color)
      setEditTemporallyCover(currentPlaylistView?.cover)
      setEditTemporallySection(currentSectionView)
      setIsOpen(true)
    })
  }

  // Event key escape to close edit playlist
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'Escape' && currentPlaylistView !== undefined) {
        withViewTransition(() => {
          setEditTemporallyTitle('')
          setEditTemporallyColor(currentPlaylistView.color)
          setEditTemporallyCover([])
          setEditTemporallySection('')
          setIsOpen(false)
        })
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [currentPlaylistView])

  const handledCloseModal = () => {
    withViewTransition(() => {
      if (currentPlaylistView === undefined) return
      setEditTemporallyTitle('')
      setEditTemporallyColor(currentPlaylistView.color)
      setEditTemporallyCover([])
      setEditTemporallySection('')
      setIsOpen(false)
    })
  }

  const durationSongs = formatTotalDuration(totalDurationSongs ?? 0)
  return (
    <div className="absolute top-14 w-[95%] flex flex-col overflow-y-disable rounded-lg">
      <header className="flex flex-row gap-8 px-6 mt-12 mb-8">
        <div className="w-40">
          {currentPlaylistView?.cover.length === 1 ||
          editTemporallyCover.length === 1 ? (
            <picture className="aspect-square">
              <img
                src={
                  isOpen
                    ? editTemporallyCover[0]
                    : currentPlaylistView?.cover[0]
                }
                alt={`Cover of ${
                  currentPlaylistView?.title
                } by ${currentPlaylistView?.artists.join(',')}`}
                className="object-cover h-full rounded-md"
                style={{
                  viewTransitionName: `playlist-${currentPlaylistView?.id}`
                }}
              />
            </picture>
              ) : (
            <div className="grid grid-cols-2 aspect-square w-full h-44">
              {currentPlaylistView?.cover.map((cover, index) => (
                <div key={index} className="relative w-full h-full">
                  <img
                    src={cover}
                    alt={`Song ${index}`}
                    className="absolute w-full h-full object-cover"
                    style={{
                      viewTransitionName: `playlist-${currentPlaylistView?.id}-${index}`
                    }}
                  />
                </div>
              ))}
            </div>
              )}
        </div>
        <div className="flex flex-col">
          <h2 className="flex flex-1 items-end">{t('playlist.playlist')}</h2>
          <button
            className="flex flex-1 items-end"
            onClick={handledOpenEditPlaylist}
            title="Edit Playlist"
          >
            <h1
              className="text-5xl font-bold block"
              style={{ viewTransitionName: `title-${currentPlaylistView?.id}` }}
            >
              {editTemporallyTitle !== ''
                ? editTemporallyTitle
                : currentPlaylistView?.title}
            </h1>
          </button>

          <div className="flex-1 flex items-end">
            <div className="text-sm text-gray-300 font-normal">
              <div>
                <span>{currentPlaylistView?.artists.join(', ')}</span>
              </div>
              <p className="mt-1">
                <span className="">
                  {currentPlaylistView?.songs.length} {t('playlist.songs')}
                </span>
                {`${
                  durationSongs !== ''
                    ? ', ' + durationSongs + ' ' + t('playlist.approximately')
                    : ''
                }`}
              </p>
            </div>
          </div>
        </div>
      </header>
      <section className="bg-zinc-950 bg-opacity-50">
        <div className="pl-6 pt-4 flex flex-row">
          <CardPlayButton playlist={currentPlaylistView} size="large" />
          <div className="relative ml-8">
            <button
              className="absolute bottom-2 opacity-20 hover:opacity-100 hover:text-red-400"
              title={t('playlist.deletePlaylist')}
              onClick={() => {
                deletePlaylist()
              }}
            >
              <DeleteOptionsIcon />
            </button>
          </div>
          <div className="relative ml-16">
            <label
              className={`flex bg-zinc-950 rounded-3xl opacity-60 border-2
            ${isSearching ? ' border-white' : 'border-transparent'}
            ${inputValue !== '' ? 'opacity-100' : ''}`}
            >
              <div className="flex self-center ml-2">
                <SearchLittleIcon />
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(event) => {
                  handleInputChange(event.target.value)
                }}
                className="ml-2 rounded-xl p-2 w-96 opacity-60 bg-transparent outline-none"
                placeholder={t('playlist.search')}
                onFocus={() => {
                  setIsSearching(true)
                }}
                onBlur={() => {
                  setIsSearching(false)
                }}
              />
              <button
                className={`absolute right-0 top-0 z-10 opacity-0 p-3
                    ${inputValue !== '' ? 'opacity-100' : ''}`}
                onClick={handleClearFilter}
                disabled={inputValue === ''}
              >
                X
              </button>
            </label>
          </div>
        </div>
        <PlaylistTable
          playlist={currentPlaylistView}
          playlistSongs={currentPlaylistSongs}
        />
        <ModalEditPlaylist
          playlist={currentPlaylistView}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handledCloseModal={handledCloseModal}
        />
      </section>
    </div>
  )
}
