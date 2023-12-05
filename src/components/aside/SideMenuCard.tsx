'use client'
import { useEffect, useRef, useState } from 'react'
import { type Playlist, type Song } from '@/lib/data'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { CardPlayButton } from '../CardPlay'
import { shuffleSongsWithCurrentSong } from '@/utils/random'
import { VolumeAsideIcon } from '@/icons/aside/Volume'
import { formatTime } from '@/utils/time'

interface CardPlaylist {
  playlist: Playlist
}

export default function SideMenuCard ({ playlist }: CardPlaylist) {
  const {
    setCurrentMusic,
    currentMusic,
    setIsPlaying,
    setCopyCurrentMusic,
    randomPlaylist,
    songs,
    setSongs,
    playlists,
    setPlaylists
  } = usePlayerStore<StoreType>((state) => state)
  const [currentPlaylist, setCurrentPlaylist] = useState<Song[]>([])

  // const { id, title, artists, cover } = playlist
  const artistsString = playlist.artists.join(', ')

  const getPlaylist = () => {
    if (currentPlaylist.length > 0) {
      setCurrentPlaylist([])
      return
    }
    const playListSongs = songs.filter((song) => song.albumId === playlist.id)
    setCurrentPlaylist(playListSongs)
  }

  // Reload playlist songs
  useEffect(() => {
    if (currentPlaylist.length !== 0) {
      const playListSongs = songs.filter(
        (song) => song.albumId === playlist.id
      )
      setCurrentPlaylist(playListSongs)
    }
  }, [songs.length])

  const playSong = (song: Song) => {
    let playListSongs = songs.filter((song) => song.albumId === playlist.id)
    setCopyCurrentMusic({
      playlist,
      song,
      songs: playListSongs
    })

    if (randomPlaylist) {
      playListSongs = shuffleSongsWithCurrentSong(playListSongs, song.id)
    }
    setCurrentMusic({
      playlist,
      song,
      songs: playListSongs
    })

    setIsPlaying(true)
  }

  const delPlaylist = () => {
    if (playlist.title === 'All Songs') return
    const newSongs = songs.filter((song) => song.albumId !== playlist.id)
    setSongs(newSongs)
    const newPlaylists = playlists.filter((item) => item.id !== playlist.id)
    setPlaylists(newPlaylists)
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

  const handleDrop = (event: any) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(false)
    dragCounter.current = 0

    // Use DataTransferItemList interface to access the file(s)
    if (event.dataTransfer.items !== undefined) {
      if (event.dataTransfer.items.length > 0 && event.dataTransfer.items[0].kind === 'file') {
        for (const item of event.dataTransfer.items) {
          // If dropped items aren't files, reject them
          if (item.kind === 'file') {
            const file = item.getAsFile()
            console.log(file)
            const folderPath = file.path.split(file.name)[0].replace(/\\/g, '/')
            const newSongs = songs
            const newSong: Song = {
              id: window.crypto.randomUUID(),
              albumId: playlist.id,
              title: file.name,
              directoryPath: folderPath,
              image: playlist.cover,
              artists: ['artists'],
              album: 'All Songs',
              duration: 90,
              format: ''
            }
            newSongs.push(newSong)
            setSongs(newSongs)
          }
        }
      }
    }
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`${isDragOver ? 'bg-zinc-700' : ''} overflow-auto relative`}
    >
      {/* Delte Playlist button */}
      <button
        className="absolute z-20 bg-slate-900 w-5 rounded-md text-base opacity-0 hover:opacity-70 transition-opacity"
        onClick={delPlaylist}
      >
        X
      </button>
      {/* Playlist item */}
      <a
        href="#"
        className="playlist-item flex relative group p-2 overflow-hidden items-center gap-5 rounded-md hover:bg-zinc-800"
        onClick={getPlaylist}
      >
        {/* Image Playlist */}
        <picture className="h-12 w-12 flex-none">
          <img
            src={playlist.cover}
            alt={`Cover of ${playlist.title} by ${artistsString}`}
            className="object-cover w-full h-full rounded-md"
          />
        </picture>

        {/* Title and Artist */}
        <div className="flex flex-auto flex-col truncate">
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

        {/* Play button */}
        <div className="absolute right-4 bottom-4 translate-y-4 transition-all duration-500 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-10">
          <CardPlayButton playlist={playlist} />
        </div>
        {playlist.id === currentMusic.playlist?.id && (
          <div className="absolute right-[26px] bottom-[35px] translate-y-4 transition-all duration-500 opacity-100 group-hover:translate-y-0 group-hover:opacity-0 z-10 text-green-400">
            <VolumeAsideIcon />
          </div>
        )}
      </a>

      {/* Playlist songs */}
      {currentPlaylist.length > 0 && (
        <div className="bg-zinc-800 rounded-md">
          <ul className="flex flex-col ">
            {currentPlaylist.map((song, index) => (
              <li
                key={song.id}
                className={`${isDragOver ? 'bg-zinc-700' : ''} hover:bg-zinc-900 rounded-md p-2 pl-0 flex flex-row justify-between`}
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
                  <div className="mr-3">
                    {currentMusic.song?.id === song.id &&
                    currentMusic.song?.albumId === song.albumId
                      ? (
                      <img
                        src="/equaliser-animated-green.gif"
                        alt="equaliser"
                        width={16}
                      />
                        )
                      : (
                          index + 1
                        )}
                  </div>

                  {/* Song title */}
                  <div className="truncate">{song.title}</div>
                </a>

                {/* Song duration */}
                <div className="text-xs text-zinc-500">{formatTime(song.duration)}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
