import { BackIcon } from '@/icons/Back'
import { NotificationIcon } from '@/icons/Notification'
import { RightIcon } from '@/icons/Righ'
import { UserIcon } from '@/icons/User'
import 'plyr-react/plyr.css'
import { IconButton } from './IconButton'
import { DownloadIcon } from '@/icons/Download'
export default function Header () {
  return (
    <div className='flex flex-row justify-between gap-2  w-full mb-6'>
      <div className='flex flex-row'>
        <IconButton Icon={BackIcon} className='ml-4' />
        <IconButton Icon={RightIcon} className='ml-4' />
      </div>
      <div className='flex flex-row'>
        <button className='bg-white rounded-full w-36 text-slate-900 font-bold text-sm border-white mr-4 hover:scale-110 transition-transform'>
          Explore Premium
        </button>
        <button className='bg-black rounded-full w-44 font-bold text-sm mr-4 opacity-60 flex flex-row items-center justify-center hover:scale-110 transition-transform'>
          <div className='mr-2'>
          <DownloadIcon />
          </div>
          Install application
        </button>
        <IconButton Icon={NotificationIcon} className='mr-4 hover:scale-110 transition-transform' />
        <IconButton Icon={UserIcon} className='mr-4 hover:scale-110 transition-transform' />
      </div>
    </div>
  )
}
