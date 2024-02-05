import { CardPlayButton } from '@/components/CardPlay'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { deletePlaylistInCurrentSongsIfNeeded } from '@/utils/currentSongs'
import { withViewTransition } from '@/utils/transition'

export function PlaylistPipMode () {
  const {
    playlists,
    setPlaylistView,
    songs,
    setSongs,
    setPlaylists,
    currentMusic,
    setCurrentMusic,
    sections,
    setCurrentPlaylistView,
    setCurrentSongsView
  } = usePlayerStore<StoreType>((state) => state)

  const handleSetPlaylistView = (sectionID: string, playlistId: string) => {
    const playlistToView = sections.find(section => section.id === sectionID)?.playlists.find(playlist => playlist.id === playlistId)

    console.log(playlistToView)
    if (playlistToView === undefined) return
    setCurrentPlaylistView(playlistToView)
    setCurrentSongsView(playlistToView?.songs)
    withViewTransition(() => {
      setPlaylistView(`${sectionID};${playlistId}`)
    })
  }

  const delPlaylist = (id: string) => {
    withViewTransition(() => {
      const playlist = playlists.find((playlist) => playlist.id === id)
      if (playlist === undefined) return
      if (playlist.title === 'All Songs') return
      deletePlaylistInCurrentSongsIfNeeded({
        playlistID: playlist.id,
        currentMusic,
        setCurrentMusic
      })
      const newSongs = songs.filter((song) => song.albumId !== playlist.id)
      setSongs(newSongs)
      const newPlaylists = playlists.filter((item) => item.id !== playlist.id)
      setPlaylists(newPlaylists)
    })
  }

  return (
    <div className="absolute top-24 w-[95%] flex overflow-y-disable flex-col">
      {sections.map((section) => (
        <div key={section.id}>
          <header className="p-2 text-2xl">{section.title}</header>
          <section className="flex p-2 gap-10 flex-wrap">
            {section.playlists.map((playlist) => (
              <article
                key={playlist.id}
                className="group relative hover:bg-zinc-800 shadow-lg hover:shadow-xl bg-zinc-500/30 rounded-md transition-all duration-300 h-60"
              >
                {/* Delte Playlist button */}
                <button
                  className="absolute z-40 bg-slate-900 w-5 rounded-md text-base opacity-0 hover:opacity-70 transition-opacity"
                  onClick={() => {
                    delPlaylist(playlist.id)
                  }}
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
                  onClick={() => {
                    handleSetPlaylistView(section.id, playlist.id)
                  }}
                >
                  {playlist.cover.length === 1
                    ? (
                    <picture className="aspect-square h-44 w-40">
                      <img
                        src={playlist.cover[0]}
                        alt={`Cover of ${
                          playlist.title
                        } by ${playlist.artists.join(',')}`}
                        className="object-cover h-full rounded-md"
                        style={{
                          viewTransitionName: `playlist-${playlist?.id}`
                        }}
                      />
                    </picture>
                      )
                    : (
                    <div className="grid grid-cols-2 aspect-square w-full h-44">
                      {playlist.cover.map((cover, index) => (
                        <div key={index} className="relative w-full h-full">
                          <img
                            src={cover}
                            alt={`Song ${index}`}
                            className="absolute w-full h-full object-cover"
                            style={{
                              viewTransitionName: `playlist-${playlist?.id}-${index}`
                            }}
                          />
                        </div>
                      ))}
                    </div>
                      )}
                  <div className="flex flex-auto flex-col px-2">
                    <h4
                      className="text-white text-sm"
                      style={{ viewTransitionName: `title-${playlist?.id}` }}
                    >
                      {playlist.title}
                    </h4>

                    <span className="text-xs text-gray-400">
                      {playlist.artists.join(',')}
                    </span>
                  </div>
                </button>
              </article>
            ))}
          </section>
        </div>
      ))}
    </div>
  )
}
