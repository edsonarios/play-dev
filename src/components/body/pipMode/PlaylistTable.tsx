import { TimeIcon } from '@/icons/Time'
import { type Song } from '@/lib/data'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { formatTime } from '@/utils/time'

interface PlayListTable {
  songs: Song[]
}

export function PlaylistTable ({ songs }: PlayListTable) {
  const { currentMusic } = usePlayerStore<StoreType>((state) => state)
  return (
    <table className="table-auto text-left min-w-full divide-y divide-gray-500/20">
      <thead className="">
        <tr className="text-zinc-400 text-sm">
          <th className="px-4 py-2 font-light">#</th>
          <th className="px-4 py-2 font-light">Título</th>
          <th className="px-4 py-2 font-light">Álbum</th>
          <th className="px-4 py-2 font-light">
            <TimeIcon />
          </th>
        </tr>
      </thead>

      <tbody>
        <tr className="h-[16px]"></tr>
        {songs.map((song) => (
          <tr
            key={song.id}
            className="border-spacing-0 text-gray-300 text-sm font-light hover:bg-white/10 overflow-hidden transition duration-300"
          >
            <td className={'px-4 py-2 rounded-tl-lg rounded-bl-lg w-5'}>
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
            </td>
            <td className="px-4 py-2 flex gap-3">
              <picture className="">
                <img src={song.image} alt={song.title} className="w-11 h-11" />
              </picture>
              <div className="flex flex-col">
                <h3
                  className={`text-white text-base font-normal
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
            <td className="px-4 py-2 rounded-tr-lg rounded-br-lg">
              {formatTime(song.duration)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
