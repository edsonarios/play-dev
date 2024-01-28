import { NextIcon } from '@/icons/controls/Next'
import { PreviousIcon } from '@/icons/controls/Previous'
import { CloseIcon } from '@/icons/edit/Close'
import { PlayPauseIcon } from '@/icons/shorrtcuts/PlayPause'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { useTranslation } from 'react-i18next'

export default function ModalShowShortcuts () {
  const { t } = useTranslation()
  const { isShowShortcuts, setIsShowShortcuts } = usePlayerStore<StoreType>(
    (state) => state
  )

  const handleCloseModal = () => {
    setIsShowShortcuts(false)
  }

  return (
    <div>
      {isShowShortcuts && (
        <div
          onClick={handleCloseModal}
          className={
            'fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-20'
          }
        >
          <div
            onClick={(event) => {
              event.stopPropagation()
            }}
            className="w-[600px]"
          >
            <header className="relative flex flex-row bg-zinc-900 rounded-t-md p-6 gap-4 px-6 justify-between">
              <h1>{t('controls.shortcuts')}</h1>
              <button
                className="flex p-2 rounded-full opacity-70 hover:bg-zinc-800 hover:opacity-100"
                onClick={handleCloseModal}
              >
                <CloseIcon />
              </button>
            </header>
            <section className="relative flex flex-col bg-zinc-800 rounded-b-md p-6 gap-4 px-6 items-center overflow-auto h-[500px]">
              <table className="text-left w-full ">
                <tbody>
                  <tr>
                    <td className="px-4 py-2 ">{t('controls.playPause')} :</td>
                    <td className="px-4 py-2 flex flex-row justify-center items-center">
                      {t('controls.media')}
                      <div className="border-2 rounded-md border-zinc-600 py-1 px-2 flex flex-row items-center ml-4">
                        <PlayPauseIcon />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-1 "></td>
                    <td className="px-4 py-1 flex flex-row justify-center items-center mb-2">
                      <div className="border-2 rounded-md border-zinc-600 py-1 px-2 flex flex-row items-center ml-4">
                        {t('controls.space')}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 ">{t('controls.next')} :</td>
                    <td className="px-4 py-2 flex flex-row justify-center items-center mb-2">
                      {t('controls.media')}
                      <div className="border-2 rounded-md border-zinc-600 py-1 px-2 flex flex-row items-center ml-4">
                        <NextIcon />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 ">{t('controls.previous')} :</td>
                    <td className="px-4 py-2 flex flex-row justify-center items-center mb-2">
                      {t('controls.media')}
                      <div className="border-2 rounded-md border-zinc-600 py-1 px-2 flex flex-row items-center ml-4">
                        <PreviousIcon />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 ">{t('controls.pip')} :</td>
                    <td className="px-4 py-2 flex flex-row justify-center items-center mb-2">
                      <div className="border-2 rounded-md border-zinc-600 px-2 flex flex-row items-center ml-4">
                        P
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 ">{t('controls.mute')} :</td>
                    <td className="px-4 py-2 flex flex-row justify-center items-center mb-2">
                      <div className="border-2 rounded-md border-zinc-600 py-1 px-2 flex flex-row items-center ml-4">
                        M
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 ">{t('controls.seekFB')} :</td>
                    <td className="px-4 py-2 flex flex-row justify-center items-center mb-2">
                      <div className="border-2 rounded-md border-zinc-600 py-1 px-2 flex flex-row items-center ml-4">
                        {'→'}
                      </div>
                      <div className="border-2 rounded-md border-zinc-600 py-1 px-2 flex flex-row items-center ml-4">
                        {'←'}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 ">{t('controls.seek%')} :</td>
                    <td className="px-4 py-2 flex flex-row justify-center items-center mb-2">
                      <div className="border-2 rounded-md border-zinc-600 py-1 px-2 flex flex-row items-center ml-4">
                        1 - 9
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 ">{t('controls.volumeUpDown')} :</td>
                    <td className="px-4 py-2 flex flex-row justify-center items-center mb-2">
                      <div className="border-2 rounded-md border-zinc-600 py-1 px-2 flex flex-row items-center ml-4">
                        {'↑'}
                      </div>
                      <div className="border-2 rounded-md border-zinc-600 py-1 px-2 flex flex-row items-center ml-4">
                        {'↓'}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 ">{t('controls.sppedID')} :</td>
                    <td className="px-4 py-2 flex flex-row justify-center items-center mb-2">
                      <div className="border-2 rounded-md border-zinc-600 py-1 px-2 flex flex-row items-center ml-4">
                        +
                      </div>
                      <div className="border-2 rounded-md border-zinc-600 py-1 px-2 flex flex-row items-center ml-4">
                        —
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 ">{t('controls.fullScreen')} :</td>
                    <td className="px-4 py-2 flex flex-row justify-center items-center mb-2">
                      <div className="border-2 rounded-md border-zinc-600 py-1 px-2 flex flex-row items-center ml-4">
                        F
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 ">{t('aside.folder')} :</td>
                    <td className="px-4 py-2 flex flex-row justify-center items-center mb-2">
                      <div className="border-2 rounded-md border-zinc-600 py-1 px-2 flex flex-row items-center ml-4">
                        O
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
