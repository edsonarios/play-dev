import { withViewTransition } from '@/utils/transition'
import { Progress } from '@nextui-org/react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface IDowloadProgress {
  bytesPerSecond: number
  percent: number
  transferred: number
  total: number
}

export default function ModalUpdateStatus () {
  const { t } = useTranslation()
  const [updateDownload, setUpdateDownload] = useState<IDowloadProgress | null>(
    null
  )

  const updateDownloadProgress = useCallback(
    (_event: any, action: IDowloadProgress) => {
      withViewTransition(() => {
        setUpdateDownload(action)
      })
    },
    []
  )

  useEffect(() => {
    window.electronAPI.receive(
      'update-download-progress',
      updateDownloadProgress
    )
    return () => {
      window.electronAPI.removeListener(
        'update-download-progress',
        updateDownloadProgress
      )
    }
  }, [])

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  return (
    <div>
      {updateDownload !== null && (
        <div
          className={
            'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30'
          }
        >
          <section
            onClick={(event) => {
              event.stopPropagation()
            }}
            className="relative flex flex-col bg-zinc-900 rounded-md p-6 gap-2 w-full max-w-md"
          >
            <p className="text-xl">{t('update.title')}</p>
            <p className="text-xs">
              {t('update.speed')} {formatBytes(updateDownload.bytesPerSecond)}/s
            </p>
            <p className="text-xs">
              {t('update.transferred')}{' '}
              {formatBytes(updateDownload.transferred)} /{' '}
              {formatBytes(updateDownload.total)}
            </p>
            <Progress
              aria-label="Downloading..."
              size="md"
              value={updateDownload.percent}
              showValueLabel={true}
              className="max-w-md"
            />
          </section>
        </div>
      )}
    </div>
  )
}
