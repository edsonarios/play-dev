import { PlayPauseIcon } from '@/icons/shorrtcuts/PlayPause'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { useTranslation } from 'react-i18next'

export default function ModalShowShortcuts () {
  const { t } = useTranslation()
  const { isShowShortcuts, setIsShowShortcuts } = usePlayerStore<StoreType>((state) => state)

  const handleCloseModal = () => {
    setIsShowShortcuts(false)
  }

  return (
    <div>
      {isShowShortcuts && (
        <div
          onClick={handleCloseModal}
          className={
            'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20'
          }
        >
          <section
            onClick={(event) => {
              event.stopPropagation()
            }}
            className="relative flex flex-col bg-zinc-900 rounded-md p-6 gap-4 px-6 w-96 items-center"
          >
            <h1>{t('controls.shortcuts')}</h1>
            <ul>
              <li className='flex flex-row gap-4'>
                <PlayPauseIcon />
                Play/Pause / Media Play/Pause
              </li>
            </ul>
          </section>
        </div>
      )}
    </div>
  )
}
