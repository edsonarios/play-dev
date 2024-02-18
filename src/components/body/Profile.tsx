import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { UserIcon } from '@/icons/header/User'
import { useTranslation } from 'react-i18next'
import { SpotifyIcon, YoutubeIcon } from '@/icons/header/Profile'
import { type ISections } from '@/lib/data'
export function ProfileComponent () {
  const { t } = useTranslation()
  const {
    setProfile,
    profile,
    setIsLoading,
    sections,
    setSections,
  } = usePlayerStore<StoreType>((state) => state)

  // Import PLaylist from Youtube
  const handledImportYoutube = async () => {
    setIsLoading(true)
    const response = await window.electronAPI.importYoutube()
    const newSection: ISections = {
      id: window.crypto.randomUUID(),
      title: 'Youtube',
      playlists: response.playlists,
    }
    setProfile(response.profile)
    setSections([...sections, newSection])
    console.log(response)
    setIsLoading(false)
  }

  const handledImportSpotify = async () => {
    console.log('Import Spotify')
  }

  const menuOptions = [
    {
      text: t('body.importYoutube'),
      onClick: handledImportYoutube,
      icon: YoutubeIcon,
    },
    {
      text: t('body.importSpotify'),
      onClick: handledImportSpotify,
      icon: SpotifyIcon,
    },
  ]

  return (
    <div className="relative inline-block text-left mr-4">
      <div className="group text-white transition-all w-8">
        {profile === undefined ? (
          <button
            className={
              'text-zinc-300 hover:text-zinc-100 rounded-full bg-black opacity-60 p-2 mr-4 hover:scale-110 transition-transform'
            }
          >
            <UserIcon />
          </button>
        ) : (
          <picture>
            <img
              src={profile.image}
              alt={profile.email}
              title={profile.name}
              className="rounded-full"
            />
          </picture>
        )}
        <ul className="group-hover:block group-hover:animate-fade-down group-hover:animate-duration-200 hidden pt-0.5 absolute right-0 w-28">
          {menuOptions.map((option, index) => (
            <li
              key={index}
              className="rounded-md bg-black/30 hover:bg-black/70 whitespace-no-wrap inline-flex justify-start items-center w-full gap-x-2 px-3 py-2"
            >
              <option.icon />
              <button className="text-xs" onClick={option.onClick}>
                {option.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
