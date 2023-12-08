import { TimeIcon } from '@/icons/Time'
import { type Playlist, type Song } from '@/lib/data'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { shuffleSongsWithCurrentSong } from '@/utils/random'
import {
  DndContext,
  useSensors,
  type DragEndEvent,
  useSensor,
  MouseSensor,
  TouchSensor
} from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { DragableRow } from './DragableRow'

interface PlayListTable {
  playlist: Playlist | undefined
  playlistSongs: Song[]
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
    setSongs
  } = usePlayerStore<StoreType>((state) => state)

  const playSong = (event: any, toPlaySong: Song) => {
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

  const deleteSong = (event: any, toDeleteSong: Song) => {
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
    if (activeId !== overId) {
      console.log(
        activatorEvent.shiftKey,
        activatorEvent.ctrlKey,
        activatorEvent.altKey
      )
      const activeIndex = active.data.current?.sortable.index as number
      const overIndex = over?.data.current?.sortable.index as number
      const albumId = playlistSongs.find(
        (song) => song.id === activeId
      )?.albumId
      const newSongs = [...playlistSongs]
      const removedSong = newSongs.splice(
        newSongs.findIndex((song) => song.id === activeId),
        1
      )
      let newIndex = newSongs.findIndex((song) => song.id === overId)
      if (activeIndex < overIndex) {
        newIndex++
      }
      newSongs.splice(newIndex, 0, removedSong[0])
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
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
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
