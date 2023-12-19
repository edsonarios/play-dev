import { Slider } from './Slider'
import { type StoreType, usePlayerStore } from '@/store/playerStore'

export function SongControl () {
  const { setSongCurrentTime, localSongCurrentTime, durationSong } = usePlayerStore<StoreType>(state => state)

  const formatTime = (time: any) => {
    if (time == null) return '0:00'

    const seconds = Math.floor(time % 60)
    const minutes = Math.floor(time / 60)

    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const duration = durationSong ?? 0

  return (
    <div className='flex gap-x-3 text-xs pt-2'>
      <span className='opacity-50 w-12 text-right'>
        {formatTime(localSongCurrentTime)}
      </span>

      <Slider
        value={[localSongCurrentTime]}
        max={duration}
        min={0}
        className='w-[600px]'
        onValueChange={(value) => {
          const [newCurrentTime] = value
          setSongCurrentTime(newCurrentTime)
        }}
      />

      <span className='opacity-50 w-12'>
        {duration !== 0 ? formatTime(duration) : '0:00'}
      </span>
    </div>
  )
}
