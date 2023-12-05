import { CardPlayButton } from '@/components/CardPlay'
import { type StoreType, usePlayerStore } from '@/store/playerStore'

export function PlaylistPipMode () {
  const { playlists, setPlaylistView, songs, setSongs, setPlaylists } = usePlayerStore<StoreType>((state) => state)

  const handleSetPlaylist = (id: string) => {
    setPlaylistView(id)
  }

  const delPlaylist = (id: string) => {
    const playlist = playlists.find((playlist) => playlist.id === id)
    if (playlist === undefined) return
    if (playlist.title === 'All Songs') return
    const newSongs = songs.filter((song) => song.albumId !== playlist.id)
    setSongs(newSongs)
    const newPlaylists = playlists.filter((item) => item.id !== playlist.id)
    setPlaylists(newPlaylists)
  }

  return (
    <div className="absolute top-24 w-[95%] flex overflow-y-disable p-2 gap-10 flex-wrap">
        {playlists.map((playlist) => (
            <article
              key={playlist.id}
              className="group relative hover:bg-zinc-800 shadow-lg hover:shadow-xl bg-zinc-500/30 rounded-md transition-all duration-300 h-60"
            >
              {/* Delte Playlist button */}
              <button
                className="absolute z-40 bg-slate-900 w-5 rounded-md text-base opacity-0 hover:opacity-70 transition-opacity"
                onClick={() => { delPlaylist(playlist.id) }}
              >
                X
              </button>
              <div
                className="absolute right-4 bottom-20 translate-y-4
                            transition-all duration-500 opacity-0
                            group-hover:translate-y-0 group-hover:opacity-100
                            z-10"
              >
                <CardPlayButton playlist={playlist} />
              </div>
              <button
                className="transition-all duration-300 flex p-2 overflow-hidden gap-2 pb-6 rounded-md w-44 flex-col"
                onClick={() => { handleSetPlaylist(playlist.id) }}
              >
                <picture className="aspect-square">
                  <img
                    src={playlist.cover}
                    alt={`Cover of ${playlist.title} by ${playlist.artists.join(
                      ','
                    )}`}
                    className="object-cover h-full rounded-md"
                  />
                </picture>
                <div className="flex flex-auto flex-col px-2">
                  <h4 className="text-white text-sm">{playlist.title}</h4>

                  <span className="text-xs text-gray-400">
                    {playlist.artists.join(',')}
                  </span>
                </div>
              </ button>
            </article>
        ))}
    </div>
  )
}
