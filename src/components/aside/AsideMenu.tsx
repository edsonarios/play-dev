import { HomeIcon } from '@/icons/Home'
import { SearchIcon } from '@/icons/Search'
import { LibraryIcon } from '@/icons/Library'
import { playlists } from '../../lib/data'
import SideMenuCard from './SideMenuCard'
import SideMenuItem from './SideMenuItem'

export default function AsideMenu () {
  return (
    <nav className='flex flex-col flex-1 gap-2'>
      <div className='bg-zinc-900 rounded-lg p-2'>
        <ul>
          <SideMenuItem Icon={HomeIcon} text='Home' href='#' />
          <SideMenuItem Icon={SearchIcon} text='Search' href='#' />
        </ul>
      </div>

      <div className='bg-zinc-900 rounded-lg p-2 flex-1'>
        <ul>
          <SideMenuItem Icon={LibraryIcon} text='Your Library' href='#' />
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
