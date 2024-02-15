import { TimeIcon } from '@/icons/Time'
import { type IPlaylist, type ISong } from '@/lib/data'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { shuffleSongsWithCurrentSong } from '@/utils/random'
import {
  DndContext,
  useSensors,
  type DragEndEvent,
  useSensor,
  MouseSensor,
  TouchSensor,
  type DragStartEvent,
} from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { DragableRow } from './DragableRow'
import { withViewTransition } from '@/utils/transition'
import { useTranslation } from 'react-i18next'

interface PlayListTable {
  playlist: IPlaylist | undefined
  playlistSongs: ISong[]
}
interface ActivatorEvent {
  shiftKey: boolean
  ctrlKey: boolean
  altKey: boolean
}
export function PlaylistTable ({ playlist, playlistSongs }: PlayListTable) {
  const { t } = useTranslation()

  const {
    currentMusic,
    setCurrentMusic,
    randomPlaylist,
    songsIdSelected,
    sections,
    setSections,
    currentSectionView,
    setCurrentPlaylistView,
    isPlaying,
    setIsPlaying,
  } = usePlayerStore<StoreType>((state) => state)

  const playSong = (toPlaySong: ISong) => {
    if (playlist === undefined) return
    if (currentMusic.song?.id === toPlaySong.id) {
      setIsPlaying(!isPlaying)
      return
    }
    let playListSongs = playlist.songs

    if (randomPlaylist) {
      playListSongs = shuffleSongsWithCurrentSong(playListSongs, toPlaySong.id)
    }
    setCurrentMusic({
      playlist,
      song: toPlaySong,
      songs: playListSongs,
    })
  }

  const deleteSong = (toDeleteSong: ISong) => {
    const updatedSections = sections.map((section) => {
      if (section.id === currentSectionView) {
        const updatedPlaylists = section.playlists.map((playlist) => {
          if (playlist.id === playlist?.id) {
            const updatedSongs = playlist.songs.filter(
              (song) => song.id !== toDeleteSong.id
            )
            return { ...playlist, songs: updatedSongs }
          }
          return playlist
        })
        return { ...section, playlists: updatedPlaylists }
      }
      return section
    })
    const newCurrentPlaylist = updatedSections
      .find((section) => section.id === currentSectionView)
      ?.playlists.find((ply) => ply.id === playlist?.id)

    // Update current playlist if is playing
    if (playlist?.id === currentMusic.playlist?.id) {
      let continueCurrentSong = true
      if (currentMusic.song?.id === toDeleteSong.id) {
        continueCurrentSong = false
        setIsPlaying(false)
      }
      const newSongs = currentMusic.songs.filter(
        (song) => song.id !== toDeleteSong.id
      )
      setCurrentMusic({
        ...currentMusic,
        song: continueCurrentSong ? currentMusic.song : undefined,
        playlist: {
          ...currentMusic.playlist!,
          songs: newCurrentPlaylist!.songs,
        },
        songs: newSongs,
      })
    }

    withViewTransition(() => {
      setCurrentPlaylistView(newCurrentPlaylist)
      setSections(updatedSections)
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    const activatorEvent = event.activatorEvent as unknown as ActivatorEvent
    const activeId = active.id as string
    const overId = over?.id as string
    const activeIndex = active.data.current?.sortable.index as number
    const overIndex = over?.data.current?.sortable.index as number

    if (activeId !== overId) {
      console.log(activatorEvent.altKey)

      // Find the albumId of the song that is being dragged
      const albumId = playlistSongs.find(
        (song) => song.id === activeId
      )?.albumId

      // Find the the song that is not being dragged
      const newSongs = playlistSongs.filter((song) => !song.isDragging)
      // Remove the first song that is being dragged
      const removedSong = newSongs.splice(
        newSongs.findIndex((song) => song.id === activeId),
        1
      )
      // Find the index of the song that is being dragged over
      let newIndex = newSongs.findIndex((song) => song.id === overId)
      if (activeIndex < overIndex) {
        newIndex++
      }

      // disable songs invisible
      const songsDragged = playlistSongs.filter((song) => {
        if (songsIdSelected.includes(song.id) && song.id !== activeId) {
          song.isDragging = false
          return song
        }
      })

      // Insert song dragged and temporalSelectedSongs in the newSongs array
      const allSongsSelected = removedSong.concat(songsDragged)
      if (songsIdSelected.length > 1) {
        newSongs.splice(newIndex, 0, ...allSongsSelected)
      } else {
        newSongs.splice(newIndex, 0, ...removedSong)
      }
      const songsWithoutCurrentAlbum = playlistSongs.filter(
        (song) => song.albumId !== albumId
      )
      const newSongsWithCurrentAlbum = [
        ...songsWithoutCurrentAlbum,
        ...newSongs,
      ]

      // set the new songs
      const newSections = sections.map((section) => {
        if (section.id === currentSectionView) {
          const newPlaylists = section.playlists.map((playlist) => {
            if (playlist.id === playlist?.id) {
              return { ...playlist, songs: newSongsWithCurrentAlbum }
            }
            return playlist
          })
          return { ...section, playlists: newPlaylists }
        }
        return section
      })

      const newCurrentPlaylist = newSections
        .find((section) => section.id === currentSectionView)
        ?.playlists.find((ply) => ply.id === playlist?.id)

      setCurrentPlaylistView(newCurrentPlaylist)
      withViewTransition(() => {
        setSections(newSections)
      })
    }
    // If the song is dragged over itself, do nothing, but returned the songs was removed temporarily
    if (activeId === overId && songsIdSelected.length > 1) {
      const newSongs = playlistSongs.filter((song) => !song.isDragging)
      // Find the albumId of the song that is being dragged
      const albumId = playlistSongs.find(
        (song) => song.id === activeId
      )?.albumId

      // Find the index of the song that is being dragged over
      const findIndex = newSongs.findIndex((song) => song.id === activeId)

      // disable songs invisible
      const songsDragged = playlistSongs.filter((song) => {
        if (song.isDragging) {
          song.isDragging = false
          return song
        }
      })

      // Restore the songs that were removed temporarily
      newSongs.splice(findIndex + 1, 0, ...songsDragged)
      const songsWithoutCurrentAlbum = playlistSongs.filter(
        (song) => song.albumId !== albumId
      )
      const newSongsWithCurrentAlbum = [
        ...songsWithoutCurrentAlbum,
        ...newSongs,
      ]
      // set the new songs
      const newSections = sections.map((section) => {
        if (section.id === currentSectionView) {
          const newPlaylists = section.playlists.map((playlist) => {
            if (playlist.id === playlist?.id) {
              return { ...playlist, songs: newSongsWithCurrentAlbum }
            }
            return playlist
          })
          return { ...section, playlists: newPlaylists }
        }
        return section
      })

      const newCurrentPlaylist = newSections
        .find((section) => section.id === currentSectionView)
        ?.playlists.find((ply) => ply.id === playlist?.id)

      setCurrentPlaylistView(newCurrentPlaylist)
      withViewTransition(() => {
        setSections(newSections)
      })
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    if (songsIdSelected.length > 1) {
      const activeId = event.active.id as string
      const playlistWithouActiveId = songsIdSelected.filter(
        (song) => song !== activeId
      )
      const playlistWithoutSelectedSongs = playlistSongs.filter(
        (song) => !playlistWithouActiveId.includes(song.id)
      )

      const temporalSongs = playlistSongs.filter((song) => {
        if (playlistWithouActiveId.includes(song.id)) {
          song.isDragging = true
          return song
        }
      })
      const newSongs = playlistWithoutSelectedSongs.concat(temporalSongs)
      // set the new songs
      const newSections = sections.map((section) => {
        if (section.id === currentSectionView) {
          const newPlaylists = section.playlists.map((playlist) => {
            if (playlist.id === playlist?.id) {
              return { ...playlist, songs: newSongs }
            }
            return playlist
          })
          return { ...section, playlists: newPlaylists }
        }
        return section
      })

      const newCurrentPlaylist = newSections
        .find((section) => section.id === currentSectionView)
        ?.playlists.find((ply) => ply.id === playlist?.id)

      setCurrentPlaylistView(newCurrentPlaylist)
      withViewTransition(() => {
        setSections(newSections)
      })
    }
  }

  // Delay in drang and drop
  const activationConstraint = {
    delay: 300,
    tolerance: 5,
  }
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint,
    }),
    useSensor(TouchSensor, {
      activationConstraint,
    })
  )
  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <table className="table-auto text-left w-[95%] divide-y divide-gray-500/20 ml-6 mr-2 mt-4">
        <thead className="">
          <tr className="text-zinc-400 text-sm">
            <th className="px-4 py-2 font-light">#</th>
            <th className="px-4 py-2 font-light">{t('playlist.title')}</th>
            <th className="px-4 py-2 font-light">{t('playlist.album')}</th>
            <th className="px-4 py-2 font-light">
              <TimeIcon />
            </th>
            <th className=""></th>
          </tr>
        </thead>

        <SortableContext items={playlistSongs.map((song) => song.id)}>
          <tbody>
            {playlistSongs.map((song, index) => (
              <DragableRow
                key={song.id}
                song={song}
                index={index}
                playSong={playSong}
                deleteSong={deleteSong}
              />
            ))}
          </tbody>
        </SortableContext>
      </table>
      {playlistSongs.length === 0 ? (
        <h1 className="flex justify-center self-center w-full h-36 mt-20">
          {t('playlist.empty')}
        </h1>
      ) : (
        ''
      )}
    </DndContext>
  )
}
