import { type StoreType, usePlayerStore } from '@/store/playerStore'
interface SideMenuType {
  Icon: any
  text: string
  href: string
}

export default function SideMenuItem ({ Icon, text, href }: SideMenuType) {
  const { playlists, setPlaylists, songs, setSongs } =
    usePlayerStore<StoreType>((state) => state)

  const handleSelectFolder = async () => {
    const folder = await window.electronAPI.openDirectoryDialog()
    if (folder !== undefined) {
      console.log(folder)
      const Newplaylists = playlists
      Newplaylists.push(folder.playlist)
      setPlaylists(Newplaylists)
      const newSongs = songs
      setSongs(newSongs.concat(folder.songs))
    }
  }

  return (
    <li>
      <a
        className="flex gap-4 text-zinc-400 hover:text-zinc-100 items-center py-3 px-5 font-medium transition duration-300"
        href={href}
        onClick={handleSelectFolder}
      >
        <Icon />
        {text}
      </a>
    </li>
  )
}
