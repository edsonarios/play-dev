import { type StoreType, usePlayerStore } from '@/store/playerStore'
import React from 'react'

interface IconButtonProps {
  Icon: React.ElementType
  className?: string
}

export const IconButton: React.FC<IconButtonProps> = ({ Icon, className = '' }) => {
  const { setPlaylistView } = usePlayerStore<StoreType>((state) => state)

  const handleSetPlaylist = () => {
    setPlaylistView(0)
  }
  return (
    <button
      className={`text-zinc-300 hover:text-zinc-100 rounded-full bg-black opacity-60 p-2 ${className}`}
      onClick={handleSetPlaylist}
    >
      <Icon />
    </button>
  )
}
