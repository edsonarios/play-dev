import { CardPlayButton } from '@/components/CardPlay'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { formatTotalDuration } from '@/utils/time'
import { PlaylistTable } from './PlaylistTable'

export function PlaylistDetail ({ id }: { id: number }) {
  const { playlists, songs } = usePlayerStore<StoreType>((state) => state)
  const playlist = playlists.find((playlist) => playlist.id === id)
  const playListSongs = songs.filter((song) => song.albumId === id)
  const totalDurationSongs = playListSongs.reduce(
    (acc, song) => acc + song.duration,
    0
  )
  return (
    <div className="absolute top-24 w-[95%] flex flex-col bg-zinc-900 overflow-y-disable rounded-lg">
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
                <span className="text-white">
                  {playListSongs.length} songs
                </span>
                , {formatTotalDuration(totalDurationSongs)} approximately
              </p>
            </div>
          </div>
        </div>
      </header>
      <section className="bg-zinc-800 bg-opacity-80">
        <div className="pl-6 pt-4">
          <CardPlayButton playlist={playlist} size="large" />
        </div>
        <PlaylistTable playlist={playlist} playlistSongs={playListSongs} />
      </section>
    </div>
  )
}
