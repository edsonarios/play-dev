import { TimeIcon } from '@/icons/Time'
import { DeleteOptionsIcon } from '@/icons/playlist/Options'
import { PlayTableIcon } from '@/icons/playlist/PlayPause'
import { type Playlist, type Song } from '@/lib/data'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { shuffleSongsWithCurrentSong } from '@/utils/random'
import { formatTime } from '@/utils/time'

interface PlayListTable {
  playlist: Playlist | undefined
  playlistSongs: Song[]
}

export function PlaylistTable ({ playlist, playlistSongs }: PlayListTable) {
  const {
    currentMusic,
    setCurrentMusic,
    setCopyCurrentMusic,
    randomPlaylist,
    setIsPlaying,
    songs,
    setSongs
  } = usePlayerStore<StoreType>((state) => state)

  const playSong = (toPlaySong: Song) => {
    if (toPlaySong === undefined) return
    let playListSongs = songs.filter(
      (song) => song.albumId === toPlaySong.albumId
    )
    setCopyCurrentMusic({
      playlist,
      song: toPlaySong,
      songs: playListSongs
    })

    if (randomPlaylist) {
      playListSongs = shuffleSongsWithCurrentSong(playListSongs, toPlaySong.id)
    }
    setCurrentMusic({
      playlist,
      song: toPlaySong,
      songs: playListSongs
    })

    setIsPlaying(true)
  }

  const deleteSong = (toDeleteSong: Song) => {
    const newPlaylistSongs = songs.filter(song => song.id !== toDeleteSong.id)
    setSongs(newPlaylistSongs)
  }

  return (
    <table className="table-auto text-left w-[95%] divide-y divide-gray-500/20 ml-6 mr-2 mt-4">
      <thead className="">
        <tr className="text-zinc-400 text-sm">
          <th className="px-4 py-2 font-light">#</th>
          <th className="px-4 py-2 font-light">Title</th>
          <th className="px-4 py-2 font-light">Álbum</th>
          <th className="px-4 py-2 font-light">
            <TimeIcon />
          </th>
          <th className=""></th>
        </tr>
      </thead>

      <tbody>
        <tr className="h-[16px]"></tr>
        {playlistSongs.map((song, index) => (
          <tr
            key={song.id}
            className="border-spacing-0 text-gray-300 text-sm font-light hover:bg-white/10 overflow-hidden transition duration-300"
          >
            <td
              className={'relative px-4 py-2 rounded-tl-lg rounded-bl-lg w-5'}
            >
              {currentMusic.song?.id === song.id &&
              currentMusic.song?.albumId === song.albumId
                ? (
                <img
                  src="/equaliser-animated-green.gif"
                  alt="equaliser"
                  width={16}
                  className="hover:opacity-0"
                />
                  )
                : (
                <div className="hover:opacity-0">{index + 1}</div>
                  )}
              <button
                className="absolute p-1 right-3 bottom-6 opacity-0 hover:opacity-100 bg-zinc-700 "
                onClick={() => {
                  playSong(song)
                }}
              >
                {<PlayTableIcon />}
              </button>
            </td>
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
                <span>{song.artists.join(', ')}</span>
              </div>
            </td>
            <td className="px-4 py-2">{song.album}</td>
            <td className="px-4 py-2">{formatTime(song.duration)}</td>
            <td className="text-zinc-400 px-4 py-2 rounded-tr-lg rounded-br-lg">
              <button className='opacity-0 hover:opacity-100'
              onClick={() => { deleteSong(song) }}
              >
                <DeleteOptionsIcon />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
