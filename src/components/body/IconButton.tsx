import React from 'react'

interface IconButtonProps {
  Icon: React.ElementType
  className?: string
  title?: string
  handledFunction?: () => void
}

export const IconButton: React.FC<IconButtonProps> = ({ Icon, className = '', title = '', handledFunction }) => {
  return (
    <button
      className={`text-zinc-300 hover:text-zinc-100 rounded-full bg-black opacity-60 p-2 ${className}`}
      title={title}
      onClick={handledFunction}
    >
      <Icon />
    </button>
  )
}
