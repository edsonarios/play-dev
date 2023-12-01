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
    const folderPath = await window.electronAPI.openDirectoryDialog()
    if (folderPath !== undefined) {
      const nameFolder = folderPath.parseDirectoryPath.split('/')
      const titleFolder = nameFolder[nameFolder.length - 1]
      const Newplaylists = playlists
      const randomImage = getRandomImage()
      Newplaylists.push({
        id: playlists.length + 1,
        albumId: playlists.length + 1,
        title: titleFolder,
        color: getRandomColor(),
        cover: randomImage,
        artists: ['artists']
      })
      setPlaylists(Newplaylists)
      const newSongs = songs
      folderPath.files.forEach((file: string, index: number) => {
        newSongs.push({
          id: index + 1,
          albumId: playlists.length,
          title: file,
          directoryPath: folderPath.parseDirectoryPath,
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
