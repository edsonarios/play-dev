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
import { Sections } from '@/lib/entities/sections.entity'
import { withViewTransition } from '@/utils/transition'

export default function Header () {
  const { t } = useTranslation()
  const { setPlaylistView, modeColor, setModeColor, sections, setSections } =
    usePlayerStore<StoreType>((state) => state)

  // Set playlist view to 0
  const handleSetPlaylist = () => {
    withViewTransition(() => {
      setPlaylistView('0')
    })
  }

  // Dark/Light mode
  const [isChecked, setIsChecked] = useState(false)
  useEffect(() => {
    setIsChecked(modeColor === 'light')
  }, [])
  const handleThemeChange = (event: any) => {
    setIsChecked(!isChecked)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const newTheme = event.target.checked ? 'light' : 'dark'
    setModeColor(newTheme)
  }

  const handleNewSection = () => {
    const newSection = new Sections({
      id: window.crypto.randomUUID(),
      title: 'New Section',
      playlists: []
    })
    setSections([...sections, newSection])
  }

  return (
    <div className="flex flex-row justify-between gap-2 w-full my-2 z-10">
      <div className="flex flex-row">
        <IconButton
          Icon={BackIcon}
          className="ml-4"
          title={t('body.back')}
          handledFunction={handleSetPlaylist}
        />
        <IconButton Icon={RightIcon} className="ml-4" title={t('body.next')} />
        <IconButton
          Icon={PlusIcon}
          className="ml-4"
          title={t('body.next')}
          handledFunction={handleNewSection}
        />
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
            onChange={handleThemeChange}
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
