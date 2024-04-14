import { CloseIcon } from '@/icons/edit/Close'
import { type IModalStore, useModalStore } from '@/store/modals.store'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function ModalShow () {
  const { t } = useTranslation()
  const { isShow, setIsShow, messageModal } = useModalStore<IModalStore>(
    (state) => state
  )

  const handleCloseModal = () => {
    setIsShow(false)
  }

  // Event key escape to close the modal
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'Escape') {
        setIsShow(false)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return (
    <div>
      {isShow && (
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
            <header className="relative flex flex-row bg-zinc-900 rounded-t-md p-4 gap-4 px-6 justify-between">
              <h1>{t('body.soon')}</h1>
              <button
                className="flex p-2 rounded-full opacity-70 hover:bg-zinc-800 hover:opacity-100"
                onClick={handleCloseModal}
              >
                <CloseIcon />
              </button>
            </header>
            <section className="relative flex flex-col bg-zinc-800 rounded-b-md p-6 gap-4 px-6 items-center overflow-auto whitespace-pre-line">
              <p>
              {messageModal}
              </p>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
