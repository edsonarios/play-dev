import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { getRandomColor, getRandomImage } from '@/utils/random'
interface SideMenuType {
  Icon: any
  text: string
  href: string
}

export default function SideMenuItem ({ Icon, text, href }: SideMenuType) {
  const { playlists, setPlaylists, songs, setSongs } = usePlayerStore<StoreType>((state) => state)
  const handleSelectFolder = async () => {
    const folder = await window.electronAPI.openDirectoryDialog()
    if (folder !== undefined) {
      const nameFolder = folder.directoryPath.split('/')
      const titleFolder = nameFolder[nameFolder.length - 1]
      const Newplaylists = playlists
      const randomImage = getRandomImage()
      const newPlaylistUUID = window.crypto.randomUUID()
      Newplaylists.push({
        id: newPlaylistUUID,
        albumId: newPlaylistUUID,
        title: titleFolder,
        color: getRandomColor(),
        cover: randomImage,
        artists: ['artists']
      })
      setPlaylists(Newplaylists)
      const newSongs = songs
      folder.files.forEach((file) => {
        newSongs.push({
          id: file.id,
          albumId: newPlaylistUUID,
          title: file.name,
          directoryPath: folder.directoryPath,
          image: randomImage,
          artists: [titleFolder],
          album: titleFolder,
          duration: file.duration,
          format: ''
        })
      })
      setSongs(newSongs)
    }
  }

  return (
<li>
      <a
        className='flex gap-4 text-zinc-400 hover:text-zinc-100 items-center py-3 px-5 font-medium transition duration-300'
        href={href}
        onClick={handleSelectFolder}
      >
        <Icon />
        {text}
      </a>
</li>
  )
}
