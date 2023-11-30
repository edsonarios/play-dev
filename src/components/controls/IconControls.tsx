import React from 'react'

interface IconButtonProps {
  Icon: React.ElementType
  className?: string
}

export const IconControls: React.FC<IconButtonProps> = ({ Icon, className = '' }) => {
  return (
    <a
      className={`opacity-60 hover:opacity-100 ${className}`}
    >
      <Icon />
    </a>
  )
}
