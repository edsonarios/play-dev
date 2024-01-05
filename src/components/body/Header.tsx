import { BackIcon } from '@/icons/header/Back'
import { NotificationIcon } from '@/icons/header/Notification'
import { RightIcon } from '@/icons/header/Righ'
import { UserIcon } from '@/icons/header/User'
import 'plyr-react/plyr.css'
import { IconButton } from './IconButton'
import { DarkIcon, LightIcon } from '@/icons/header/Theme'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { useEffect, useState } from 'react'
export default function Header () {
  const { setPlaylistView, modeColor, setModeColor, playlists, setPlaylists, songs, setSongs, profile, setProfile } =
    usePlayerStore<StoreType>((state) => state)

  // Set playlist view to 0
  const handleSetPlaylist = () => {
    setPlaylistView('0')
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

  // Import PLaylist from Youtube
  const handledImportYoutube = async () => {
    console.log('Import Youtube')
    const response = await window.electronAPI.importYoutube()
    const newPlaylists = [...playlists, ...response.playlists]
    const newSongs = [...songs, ...response.songs]
    setProfile(response.profile)
    setPlaylists(newPlaylists)
    setSongs(newSongs)
    console.log(response)
  }

  return (
    <div className="flex flex-row justify-between gap-2  w-full mb-6">
      <div className="flex flex-row">
        <IconButton
          Icon={BackIcon}
          className="ml-4"
          handledFunction={handleSetPlaylist}
        />
        <IconButton Icon={RightIcon} className="ml-4" />
      </div>
      <div className="flex flex-row">
        <button className="bg-white rounded-full w-36 text-slate-900 font-bold text-sm border-white mr-4 hover:scale-110 transition-transform z-10">
          Explore Premium
        </button>
        <label className="swap swap-rotate mr-4">
          <input
            type="checkbox"
            className="theme-controller"
            checked={isChecked}
            onChange={handleThemeChange}
          />
          <LightIcon />
          <DarkIcon />
        </label>
        <IconButton
          Icon={NotificationIcon}
          className="mr-4 hover:scale-110 transition-transform"
        />
        {profile === undefined
          ? (
          <IconButton
            Icon={UserIcon}
            className="mr-4 hover:scale-110 transition-transform"
            handledFunction={handledImportYoutube}
          />)
          : (<picture className="w-8 mr-4 transition-transform" title='Edson'>
            <img
              src={profile.image}
              alt={profile.email}
              title={profile.name}
              className="object-cover w-full h-full shadow-lg rounded-full hover:scale-120"
            />
          </picture>)
        }
      </div>
    </div>
  )
}
