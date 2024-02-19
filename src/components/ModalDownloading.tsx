import { type StoreLoadingType, useLoadingStore } from '@/store/loadingStore'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function ModalDownloading () {
  const { t } = useTranslation()
  const { isLoading, setIsLoading, messageLoading } = useLoadingStore<StoreLoadingType>((state) => state)

  // Event key escape to close the modal
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'Escape') {
        setIsLoading(false)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return (
    <div>
      {isLoading && (
        <div
          className={
            'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30'
          }
        >
          <section
            onClick={(event) => {
              event.stopPropagation()
            }}
            className="relative flex flex-col bg-zinc-900 rounded-md p-6 gap-2 w-full max-w-md z-40 items-center"
          >
            <div id="spinner" className="loader"></div>
            <p className="text-lg">{messageLoading !== '' ? messageLoading : t('loading.loading')}</p>
          </section>
        </div>
      )}
    </div>
  )
}
