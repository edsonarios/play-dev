import { BackIcon } from '@/icons/header/Back'
import { RightIcon } from '@/icons/header/Righ'
import { IconButton } from './IconButton'
import { DarkIcon, LightIcon } from '@/icons/header/Theme'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { I18nComponent } from './i18n'
import { ProfileComponent } from './Profile'
import { PlusIcon } from '@/icons/aside/Library'
import { withViewTransition } from '@/utils/transition'
import { type ISections } from '@/lib/data'

export default function Header () {
  const { t } = useTranslation()
  const {
    setPlaylistView,
    playlistView,
    modeColor,
    setModeColor,
    sections,
    setSections,
    setSongsIdSelected
  } = usePlayerStore<StoreType>((state) => state)

  // Set playlist view to 0
  const handledSetPlaylist = () => {
    setSongsIdSelected([])
    withViewTransition(() => {
      setPlaylistView('0')
    })
  }

  // Dark/Light mode
  const [isChecked, setIsChecked] = useState(false)
  useEffect(() => {
    setIsChecked(modeColor === 'light')
  }, [])
  const handledThemeChange = (event: any) => {
    setIsChecked(!isChecked)
    const buttonIsCheked = event.target.checked as boolean
    const newTheme = buttonIsCheked ? 'light' : 'dark'
    setModeColor(newTheme)
  }

  const handledNewSection = () => {
    const newSection: ISections = {
      id: window.crypto.randomUUID(),
      title: 'New Section',
      playlists: []
    }
    setSections([...sections, newSection])
  }

  return (
    <div className="flex flex-row justify-between gap-2 w-full my-2 z-10">
      <div className="flex flex-row">
        <IconButton
          Icon={BackIcon}
          className="ml-4"
          title={t('body.back')}
          handledFunction={handledSetPlaylist}
        />
        <IconButton Icon={RightIcon} className="ml-4" title={t('body.next')} />
        {playlistView === '0' && <IconButton
          Icon={PlusIcon}
          className="ml-4"
          title={t('aside.newSection')}
          handledFunction={handledNewSection}
        />}
      </div>
      <div className="flex flex-row">
        <button className="bg-white rounded-full w-36 text-slate-900 font-bold text-sm border-white mr-4 hover:scale-110 transition-transform">
          {t('body.premium')}
        </button>
        <label className="swap swap-rotate mr-4" title={t('body.theme')}>
          <input
            type="checkbox"
            className="theme-controller"
            checked={isChecked}
            onChange={handledThemeChange}
          />
          <LightIcon />
          <DarkIcon />
        </label>
        <I18nComponent />
        <ProfileComponent />
      </div>
    </div>
  )
}
