import { useRef, useState } from 'react'
import {
  VolumeFullIcon,
  VolumeLowIcon,
  VolumeMediumIcon,
  VolumeSilenceIcon
} from '@/icons/controls/Volume'
import { Slider } from './Slider'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { SpeedIcon } from '@/icons/controls/Speed'
import { PictureInPictureOffIcon } from '@/icons/controls/PictureInPicture'
import { speedOptions } from '@/utils/constants'
import { useTranslation } from 'react-i18next'
import { ShortCutsIcon } from '@/icons/controls/Shortcuts'

export function ControlsRight () {
  const { t } = useTranslation()
  const {
    setVolume,
    volume,
    speed,
    setSpeed,
    pictureInPicture,
    setPictureInPicture,
    isShowShortcuts,
    setIsShowShortcuts
  } = usePlayerStore<StoreType>((state) => state)
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

  // Speed Options
  const [showSpeedOptions, setShowSpeedOptions] = useState(false)

  const toggleSpeedOptions = () => {
    setShowSpeedOptions(!showSpeedOptions)
  }

  const handleSpeedChange = (speed: number) => {
    setSpeed(speed)
    setShowSpeedOptions(false)
  }

  const handlePictureInPicture = () => {
    setPictureInPicture(!pictureInPicture)
  }

  const showIconPictureInPicture = () => {
    if (pictureInPicture) {
      return <PictureInPictureOffIcon />
    } else {
      return <PictureInPictureOffIcon />
    }
  }

  const handleShowShortcuts = () => {
    setIsShowShortcuts(true)
  }

  return (
    <div className="flex justify-center gap-x-2 text-white">
      <button
        className={`mr-2 opacity-60 hover:opacity-100 transition ${
          isShowShortcuts ? 'text-green-400' : ''
        }`}
        title={t('controls.shortcuts')}
        onClick={handleShowShortcuts}
      >
        <ShortCutsIcon />
      </button>
      <div className="relative inline-block">
        <button
          className="bg-white rounded-full w-26 text-slate-900 text-sm border-white mr-4 hover:scale-110 flex flex-row items-center justify-center cursor-pointer opacity-70 hover:opacity-100 transition"
          onClick={toggleSpeedOptions}
        >
          <div className="mx-1">
            <SpeedIcon />
          </div>
          <div className="text-sm mr-2">{t('controls.speed')} {speed}x</div>
        </button>

        {showSpeedOptions && (
          <div className="absolute bottom-full mb-1 bg-white border border-gray-300 rounded shadow-lg transform -translate-x-1/2 left-1/2 text-slate-900 opacity-90">
            {speedOptions.map((speed) => (
              <div
                key={speed}
                className="px-4 py-2 hover:bg-green-200 cursor-pointer"
                onClick={() => {
                  handleSpeedChange(speed)
                }}
              >
                {speed}x
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        className="opacity-70 hover:opacity-100 transition"
        title={t('controls.mute')}
        onClick={handleClickVolumen}
      >
        {getVolumeIcon()}
      </button>

      <Slider
        defaultValue={[100]}
        max={100}
        min={0}
        value={[volume * 100]}
        className="w-[95px]"
        onValueChange={(value: any) => {
          const [newVolume] = value
          const volumeValue = newVolume / 100
          setVolume(volumeValue)
        }}
      />

      <button
        className={`ml-2 opacity-60 hover:opacity-100 transition ${
          pictureInPicture ? 'text-green-400' : ''
        }`}
        title={t('controls.pip')}
        onClick={handlePictureInPicture}
      >
        {showIconPictureInPicture()}
      </button>
    </div>
  )
}
