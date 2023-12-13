/* eslint-disable react-hooks/exhaustive-deps */
import { CardPlayButton } from '@/components/CardPlay'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { formatTotalDuration } from '@/utils/time'
import { PlaylistTable } from './PlaylistTable'
import { DeleteOptionsIcon } from '@/icons/playlist/Options'
import { useCallback, useEffect, useState } from 'react'
import { SearchLittleIcon } from '@/icons/aside/Search'
import { type Song } from '@/lib/entities/song.entity'
import debounce from 'lodash.debounce'

export function PlaylistDetail ({ playlistID }: { playlistID: string }) {
  const {
    playlists,
    songs,
    setSongs,
    setPlaylists,
    setPlaylistView,
    playlistView
  } = usePlayerStore<StoreType>((state) => state)
  const playlist = playlists.find((playlist) => playlist.id === playlistID)
  const playListSongs = songs.filter((song) => song.albumId === playlistID)
  const totalDurationSongs = playListSongs.reduce(
    (acc, song) => acc + song.duration,
    0
  )

  const [currentPlaylistSongs, setCurrentPlaylistSongs] = useState<Song[]>([])
  useEffect(() => {
    const thisSongs = songs.filter((song) => song.albumId === playlistID)
    setCurrentPlaylistSongs(thisSongs)
  }, [playlistView, songs, songs.length])

  const deletePlaylist = () => {
    if (playlist === undefined) return
    if (playlist.title === 'All Songs') return
    const newSongs = songs.filter((song) => song.albumId !== playlist.id)
    setSongs(newSongs)
    const newPlaylists = playlists.filter((item) => item.id !== playlist.id)
    setPlaylists(newPlaylists)
    setPlaylistView('0')
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
    const newCurrentPlaylistSongs = songs.filter((song) => {
      const title = song.title.toLowerCase()
      const album = song.album.toLowerCase()
      const filter = value.toLowerCase()
      return (
        song.albumId === playlistID &&
        (title.includes(filter) || album.includes(filter))
      )
    })
    debouncedFilterSong(newCurrentPlaylistSongs)
  }

  const handleClearFilter = () => {
    const playListSongs = songs.filter((song) => song.albumId === playlistID)
    setInputValue('')
    setCurrentPlaylistSongs(playListSongs)
  }
  return (
    <div className="absolute top-14 w-[95%] flex flex-col overflow-y-disable rounded-lg">
      <header className="flex flex-row gap-8 px-6 mt-12 mb-8">
        <picture className="aspect-square w-52 h-52 flex-none">
          <img
            src={playlist?.cover}
            alt={`Cover of ${playlist?.title}`}
            className="object-cover w-full h-full shadow-lg rounded-md"
          />
        </picture>

        <div className="flex flex-col justify-between">
          <h2 className="flex flex-1 items-end">Playlist</h2>
          <div>
            <h1 className="text-5xl font-bold block text-white">
              {playlist?.title}
              <span></span>
            </h1>
          </div>

          <div className="flex-1 flex items-end">
            <div className="text-sm text-gray-300 font-normal">
              <div>
                <span>{playlist?.artists.join(', ')}</span>
              </div>
              <p className="mt-1">
                <span className="text-white">{playListSongs.length} songs</span>
                , {formatTotalDuration(totalDurationSongs)} approximately
              </p>
            </div>
          </div>
        </div>
      </header>
      <section className="bg-zinc-950 bg-opacity-50">
        <div className="pl-6 pt-4 flex flex-row">
          <CardPlayButton playlist={playlist} size="large" />
          <div className="relative ml-8">
            <button
              className="absolute bottom-2 opacity-20 hover:opacity-100 hover:text-red-400"
              title="Delete playlist"
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
                onChange={(e) => {
                  handleInputChange(e.target.value)
                }}
                className="ml-2 rounded-xl p-2 w-96 opacity-60 bg-transparent outline-none"
                placeholder="Search song"
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
          playlist={playlist}
          playlistSongs={currentPlaylistSongs}
        />
      </section>
    </div>
  )
}
