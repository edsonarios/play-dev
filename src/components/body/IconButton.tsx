import React from 'react'

interface IconButtonProps {
  Icon: React.ElementType
  className?: string
}

export const IconButton: React.FC<IconButtonProps> = ({ Icon, className = '' }) => {
  return (
    <a
      className={`text-zinc-300 hover:text-zinc-100 rounded-full bg-black opacity-60 p-2 ${className}`}
    >
      <Icon />
    </a>
  )
}
