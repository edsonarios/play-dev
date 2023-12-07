import { DeleteOptionsIcon } from '@/icons/playlist/Options'
import { PlayTableIcon } from '@/icons/playlist/PlayPause'
import { type Song } from '@/lib/data'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { formatTime } from 'electron/utils'

interface IDragableRow {
  song: Song
  index: number
  playSong: (event: any, song: Song) => void
  deleteSong: (event: any, song: Song) => void
}
export function DragableRow ({
  song,
  index,
  playSong,
  deleteSong
}: IDragableRow) {
  const { currentMusic } = usePlayerStore<StoreType>((state) => state)
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    overIndex
  } = useSortable({
    id: song.id,
    transition: {
      duration: 300,
      easing: 'cubic-bezier(.17,.67,.83,.67)'
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <tr
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      key={song.id}
      className={`border-spacing-0 text-gray-300 text-sm font-light hover:bg-white/10 overflow-hidden transition duration-300 ${
        isDragging ? 'opacity-30' : ''
      } ${overIndex === index ? 'border-2 border-green-500 ' : ''}`}
      style={style}
    >
      {/* Id or equaliser icon */}
      <td
        className={
          'relative px-4 py-2 rounded-tl-lg rounded-bl-lg w-5 hover:opacity-0'
        }
      >
        {currentMusic.song?.id === song.id &&
        currentMusic.song?.albumId === song.albumId
          ? (
          <img
            src="/equaliser-animated-green.gif"
            alt="equaliser"
            width={16}
            className=""
          />
            )
          : (
          <div className="">{index + 1}</div>
            )}
        <button
          className="absolute p-1 right-3 bottom-6 opacity-0 hover:opacity-100 bg-zinc-700 z-10 "
          onClick={(event) => {
            playSong(event, song)
          }}
        >
          {<PlayTableIcon />}
        </button>
      </td>
      {/* Title */}
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
      {/* Album name */}
      <td className="px-4 py-2">{song.album}</td>
      {/* Time duration */}
      <td className="px-4 py-2">{formatTime(song.duration)}</td>
      {/* Delete Song Button */}
      <td className="text-zinc-400 px-4 py-2 rounded-tr-lg rounded-br-lg">
        <button
          className="opacity-10 hover:opacity-100"
          onClick={(event) => { deleteSong(event, song) }}
        >
          <DeleteOptionsIcon />
        </button>
      </td>
    </tr>
  )
}
