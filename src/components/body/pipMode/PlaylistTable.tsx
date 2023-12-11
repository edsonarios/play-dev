/* eslint-disable array-callback-return */
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
  type DragStartEvent
} from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { DragableRow } from './DragableRow'

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
  const {
    setCurrentMusic,
    setCopyCurrentMusic,
    randomPlaylist,
    setIsPlaying,
    songs,
    setSongs,
    songsIdSelected
  } = usePlayerStore<StoreType>((state) => state)

  const playSong = (event: any, toPlaySong: ISong) => {
    event.stopPropagation()
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

  const deleteSong = (event: any, toDeleteSong: ISong) => {
    event.stopPropagation()
    event.preventDefault()
    const newPlaylistSongs = songs.filter(
      (song) => song.id !== toDeleteSong.id
    )
    setSongs(newPlaylistSongs)
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

      const newSongs = playlistSongs.filter((song) => !song.isDragging)
      // Remove the song that is being dragged
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
      const songsWithoutCurrentAlbum = songs.filter(
        (song) => song.albumId !== albumId
      )
      const newSongsWithCurrentAlbum = [
        ...songsWithoutCurrentAlbum,
        ...newSongs
      ]
      setSongs(newSongsWithCurrentAlbum)
    }
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
      const songsWithoutCurrentAlbum = songs.filter(
        (song) => song.albumId !== albumId
      )
      const newSongsWithCurrentAlbum = [
        ...songsWithoutCurrentAlbum,
        ...newSongs
      ]
      setSongs(newSongsWithCurrentAlbum)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    if (songsIdSelected.length > 1) {
      const activeId = event.active.id as string
      const playlistWithouActiveId = songsIdSelected.filter(song => song !== activeId)
      const playlistWithoutSelectedSongs = songs.filter(
        (song) => !playlistWithouActiveId.includes(song.id)
      )

      const temporalSongs = songs.filter((song) => {
        if (playlistWithouActiveId.includes(song.id)) {
          song.isDragging = true
          return song
        }
      })
      setSongs(playlistWithoutSelectedSongs.concat(temporalSongs))
    }
  }

  // Delay in drang and drop
  const activationConstraint = {
    delay: 150,
    tolerance: 5
  }
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint
    }),
    useSensor(TouchSensor, {
      activationConstraint
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
            <th className="px-4 py-2 font-light">Title</th>
            <th className="px-4 py-2 font-light">Álbum</th>
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
    </DndContext>
  )
}
