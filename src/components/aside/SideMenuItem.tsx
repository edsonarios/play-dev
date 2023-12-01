import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { getRandomColor, getRandomImage } from '@/utils/random'

interface SideMenuType {
  Icon: any
  text: string
  href: string
}

export default function SideMenuItem ({ Icon, text, href }: SideMenuType) {
  const { playlist, setPlaylist, songs, setSongs } = usePlayerStore<StoreType>((state) => state)
  const handleSelectFolder = async () => {
    const folderPath = await window.electronAPI.openDirectoryDialog()
    if (folderPath !== undefined) {
      const nameFolder = folderPath.parseDirectoryPath.split('/')
      const titleFolder = nameFolder[nameFolder.length - 1]
      const Newplaylists = playlist
      const randomImage = getRandomImage()
      Newplaylists.push({
        id: playlist.length + 1,
        albumId: playlist.length + 1,
        title: titleFolder,
        color: getRandomColor(),
        directoryPath: folderPath.parseDirectoryPath,
        cover: randomImage,
        artists: ['artists']
      })
      setPlaylist(Newplaylists)
      const newSongs = songs
      folderPath.files.forEach((file: string, index: number) => {
        newSongs.push({
          id: index + 1,
          albumId: playlist.length,
          title: file,
          image: randomImage,
          artists: [titleFolder],
          album: titleFolder,
          duration: '1:30',
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
