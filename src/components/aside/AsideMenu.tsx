import { HomeIcon } from '@/icons/aside/Home'
import { LibraryIcon, PlusIcon } from '@/icons/aside/Library'
import { playlists as libPlaylist, songs as libSongs } from '../../lib/data'
import SideMenuCard from './SideMenuCard'
import SideMenuItem from './SideMenuItem'
import { useEffect } from 'react'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { FolderIcon } from '@/icons/aside/Folder'
import { Playlist } from '@/lib/entities/playlist.entity'
import { getRandomColor, getRandomImage } from '@/utils/random'

export default function AsideMenu () {
  const { playlists, setPlaylists, setSongs, songs } = usePlayerStore<StoreType>((state) => state)

  useEffect(() => {
    setPlaylists(libPlaylist)
    setSongs(libSongs)
  }, [])

  const handleSelectFolder = async () => {
    const folder = await window.electronAPI.openDirectoryDialog()
    if (folder?.playlist !== undefined) {
      const Newplaylists = playlists
      Newplaylists.push(folder.playlist)
      setPlaylists(Newplaylists)
      const newSongs = songs
      setSongs(newSongs.concat(folder.songs))
    }
  }

  const handledNewPlaylist = () => {
    const newPlaylist = new Playlist({
      id: window.crypto.randomUUID(),
      albumId: '',
      title: 'New Playlist',
      color: getRandomColor(),
      cover: getRandomImage(),
      artists: []
    })
    const currentPlaylists = playlists
    currentPlaylists.push(newPlaylist)
    setPlaylists(currentPlaylists)
  }

  return (
    <nav className='flex flex-col flex-1 gap-2'>
      <div className='bg-zinc-900 rounded-lg p-2'>
        <ul>
          <SideMenuItem Icon={HomeIcon} text='Home' href='#' />
          <SideMenuItem Icon={FolderIcon} text='Open Folder' href='#' handledFunction={handleSelectFolder} />
        </ul>
      </div>

      <div className='bg-zinc-900 rounded-lg p-2 flex-1'>
        <ul>
          <div className='flex justify-between'>
            <SideMenuItem Icon={LibraryIcon} text='Your Library' href='#' />
            <button className='self-center mt-2 p-2 rounded-full opacity-70 hover:bg-zinc-800 hover:opacity-100'
            onClick={handledNewPlaylist}
            >
              <PlusIcon />
            </button>
          </div>
          {playlists.length > 0 && playlists.map((playlist) => (
            <div key={playlist.id}>
              <SideMenuCard playlist={playlist} />
            </div>
          ))}
        </ul>
      </div>
    </nav>
  )
}
