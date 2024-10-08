import { CardPauseIcon } from '../icons/card/Pause'
import { CardPlayIcon } from '../icons/card/Play'
import { usePlayerStore } from '../store/playerStore'
import { type IPlaylist } from '@/lib/data'
import { shuffleSongs } from '../utils/random'
interface CardPlayButtonType {
  playlist: IPlaylist | undefined
  size?: string
}
export function CardPlayButton ({
  playlist,
  size = 'small'
}: CardPlayButtonType) {
  const {
    setCurrentMusic,
    currentMusic,
    setIsPlaying,
    isPlaying,
    randomPlaylist
  } = usePlayerStore((state) => state)
  const handleCardPlayPauseButton = (event: any) => {
    event.stopPropagation()
    if (playlist === undefined || playlist.songs.length === 0) return
    let playListSongs = playlist.songs
    if (
      playlist !== undefined &&
      currentMusic.playlist?.id === playlist.id &&
      currentMusic.song !== undefined
    ) {
      setIsPlaying(!isPlaying)
      return
    }

    if (randomPlaylist) {
      playListSongs = shuffleSongs(playListSongs)
    }
    setCurrentMusic({
      playlist,
      song: playListSongs[0],
      songs: playListSongs
    })
  }

  const iconClassName = size === 'small' ? 'w-3 h-3' : 'w-5 h-5'

  return (
    <button
      onClick={handleCardPlayPauseButton}
      className="card-play-button rounded-full bg-green-500 p-3 hover:scale-110 transition hover:bg-green-400"
    >
      {currentMusic.playlist?.id === playlist?.id && isPlaying
        ? (
        <CardPauseIcon className={iconClassName} />
          )
        : (
        <CardPlayIcon className={iconClassName} />
          )}
    </button>
  )
}
