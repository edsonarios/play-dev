'use client'
import { useEffect, useState } from 'react'
import { type Playlist, type Song } from '@/lib/data'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { CardPlayButton } from '../CardPlay'
import { shuffleSongsWithCurrentSong } from '@/utils/random'
import { VolumeAsideIcon } from '@/icons/aside/Volume'

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

  const { id, title, artists, cover } = playlist
  const artistsString = artists.join(', ')

  const getPlaylist = () => {
    if (currentPlaylist.length > 0) {
      setCurrentPlaylist([])
      return
    }
    const playListSongs = songs.filter((song) => song.albumId === +id)
    setCurrentPlaylist(playListSongs)
  }

  useEffect(() => {
    if (playlist.id === 1 && currentPlaylist.length !== 0) {
      const playListSongs = songs.filter(
        (song) => song.albumId === playlist.id
      )
      setCurrentPlaylist(playListSongs)
    }
  }, [songs.length, playlist.id, currentMusic.playlist?.id])

  const playSong = (song: Song) => {
    let playListSongs = songs.filter((song) => song.albumId === +id)
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
    const newSongs = songs.filter((song) => song.albumId !== +playlist.id)
    setSongs(newSongs)
    const newPlaylists = playlists.filter((item) => item.id !== playlist.id)
    setPlaylists(newPlaylists)
  }

  return (
    <div>
      {/* Delte Playlist button */}
      <button
        className="absolute z-10 bg-slate-900 w-5 rounded-md text-base opacity-0 hover:opacity-70 transition-opacity"
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
            src={cover}
            alt={`Cover of ${title} by ${artistsString}`}
            className="object-cover w-full h-full rounded-md"
          />
        </picture>

        {/* Title and Artist */}
        <div className="flex flex-auto flex-col truncate">
          <h4
            className={`${
              currentMusic.song?.albumId === +playlist.id
                ? 'text-green-400'
                : 'text-white'
            } text-sm`}
          >
            {title}
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
            {currentPlaylist.map((song) => (
              <li
                key={song.id}
                className="hover:bg-zinc-900 rounded-md p-2 pl-0 flex flex-row justify-between"
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
                          song.id
                        )}
                  </div>

                  {/* Song title */}
                  <div className="truncate">{song.title}</div>
                </a>

                {/* Song duration */}
                <div className="text-xs text-zinc-500">{song.duration}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
