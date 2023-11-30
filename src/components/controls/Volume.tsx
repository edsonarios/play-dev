import {
  VolumeFullIcon,
  VolumeLowIcon,
  VolumeMediumIcon,
  VolumeSilenceIcon
} from '@/icons/controls/Volume'
import { Slider } from './Slider'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { useRef } from 'react'

export function Volume () {
  const { setVolume, volume } = usePlayerStore<StoreType>((state) => state)
  const previousVolumeRef = useRef(volume)

  const isVolumeSilenced = volume < 0.01

  const handleClickVolumen = () => {
    if (isVolumeSilenced) {
      setVolume(previousVolumeRef.current)
    } else {
      previousVolumeRef.current = volume
      setVolume(0)
    }
  }

  const getVolumeIcon = () => {
    if (isVolumeSilenced) {
      return <VolumeSilenceIcon />
    } else if (volume < 0.3) {
      return <VolumeLowIcon />
    } else if (volume < 0.7) {
      return <VolumeMediumIcon />
    } else {
      return <VolumeFullIcon />
    }
  }

  return (
    <div className='flex justify-center gap-x-2 text-white'>
      <button
        className='opacity-70 hover:opacity-100 transition'
        onClick={handleClickVolumen}
      >
        {getVolumeIcon()}
      </button>

      <Slider
        defaultValue={[100]}
        max={100}
        min={0}
        value={[volume * 100]}
        className='w-[95px]'
        onValueChange={(value: any) => {
          const [newVolume] = value
          const volumeValue = newVolume / 100
          setVolume(volumeValue)
        }}
      />
    </div>
  )
}
