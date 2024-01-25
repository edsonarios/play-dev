'use client'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { useTranslation } from 'react-i18next'

export default function CurrentSong () {
  const { t } = useTranslation()
  const { currentMusic, songs, setSongRefToScroll } = usePlayerStore<StoreType>((state) => state)
  const allSongsFromPlaylist = songs.filter(
    (song) => song.albumId === currentMusic.playlist?.id
  )
  const findIndexSong = allSongsFromPlaylist.findIndex(
    (song) => song.id === currentMusic.song?.id
  )
  const { song } = currentMusic

  const handledSongFocus = () => {
    if (song === undefined) return
    setSongRefToScroll(song)
  }

  return (
    <div
      className={`
        flex items-center gap-4 relative
        overflow-hidden
      `}
    >
      <picture className="w-16 max-h-16 bg-zinc-800 rounded-md shadow-lg overflow-hidden">
        <img src={song?.image} alt={song?.title} />
      </picture>

      <button onClick={handledSongFocus} className="flex flex-col">
        <h3 className="font-semibold text-sm text-left text-css">
          {song !== undefined
            ? findIndexSong + 1 + '. ' + song?.title
            : t('controls.currentSong')}
        </h3>
        <span className="text-xs opacity-80">{song?.album}</span>
      </button>
    </div>
  )
}
