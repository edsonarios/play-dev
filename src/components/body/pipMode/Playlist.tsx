import { CardPlayButton } from '@/components/CardPlay'
import { PlusIcon } from '@/icons/aside/Library'
import { type IPlaylist } from '@/lib/data'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { getRandomColor, getRandomImage } from '@/utils/random'
import { withViewTransition } from '@/utils/transition'
import { useTranslation } from 'react-i18next'

export function PlaylistPipMode () {
  const { t } = useTranslation()
  const {
    setPlaylistView,
    sections,
    setCurrentSectionView,
    setCurrentPlaylistView,
    setSections
  } = usePlayerStore<StoreType>((state) => state)

  const handleSetPlaylistView = (sectionID: string, playlistId: string) => {
    const playlistToView = sections.find(section => section.id === sectionID)?.playlists.find(playlist => playlist.id === playlistId)

    if (playlistToView === undefined) return
    setCurrentSectionView(sectionID)
    setCurrentPlaylistView(playlistToView)
    withViewTransition(() => {
      setPlaylistView(`${sectionID};${playlistId}`)
    })
  }

  const delPlaylist = (sectionID: string, playlistID: string) => {
    withViewTransition(() => {
      if (playlistID === '1') {
        const newSections = structuredClone(sections)
        const sectionUpdated = newSections.map(section => {
          const newPlaylist = section.playlists.map(ply => {
            if (ply.id === '1') {
              return {
                ...ply,
                songs: []
              }
            }
            return ply
          })
          return {
            ...section,
            playlists: newPlaylist
          }
        })
        setSections(sectionUpdated)
        return
      }
      const newSections = structuredClone(sections)
      const currentSectionIndex = newSections.findIndex(
        (section) => section.id === sectionID
      )
      if (currentSectionIndex === -1) return
      const newPlaylists = newSections[currentSectionIndex].playlists.filter(
        (item) => item.id !== playlistID
      )
      newSections[currentSectionIndex].playlists = newPlaylists
      setSections(newSections)
      setPlaylistView('0')
    })
  }

  const handledNewPlaylist = (sectionID: string) => {
    withViewTransition(() => {
      const newPlaylist: IPlaylist = {
        id: window.crypto.randomUUID(),
        albumId: '',
        title: 'New Playlist',
        color: getRandomColor(),
        cover: [getRandomImage()],
        artists: [],
        songs: []
      }
      const newSections = structuredClone(sections)
      newSections.map((section) => {
        if (section.id === sectionID) {
          section.playlists.push(newPlaylist)
        }
        return section
      })
      setSections(newSections)
    })
  }

  return (
    <div className="absolute top-24 w-[95%] flex overflow-y-disable flex-col">
      {sections.map((section) => (
        <div key={section.id}>
          <div className="group flex">
            <header className="p-2 text-2xl">{section.title}</header>
            <button
              className="self-center p-2 rounded-full opacity-0 hover:bg-zinc-900 group-hover:opacity-100"
              onClick={() => {
                handledNewPlaylist(section.id)
              }}
              title={t('aside.newPlaylist')}
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
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
                    delPlaylist(section.id, playlist.id)
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
