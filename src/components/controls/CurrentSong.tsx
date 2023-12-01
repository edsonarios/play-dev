'use client'
import { type StoreType, usePlayerStore } from '@/store/playerStore'

export default function CurrentSong () {
  const { currentMusic } = usePlayerStore<StoreType>((state) => state)
  const { song } = currentMusic
  const message = 'No song selected'
  return (
    <div
      className={`
        flex items-center gap-4 relative
        overflow-hidden
      `}
    >
      <picture className='w-16 max-h-16 bg-zinc-800 rounded-md shadow-lg overflow-hidden'>
        <img src={song?.image} alt={song?.title} />
      </picture>

      <div className='flex flex-col'>
        <h3 className='font-semibold text-sm block'>{song !== undefined ? (song?.id + ' ' + song?.title) : message}</h3>
        <span className='text-xs opacity-80'>{song?.artists?.join(', ')}</span>
      </div>
    </div>
  )
}
