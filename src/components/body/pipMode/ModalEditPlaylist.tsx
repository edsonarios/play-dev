import { CloseIcon } from '@/icons/edit/Close'
import { PencilIcon } from '@/icons/edit/Pencil'
import { colors } from '@/lib/colors'
import { covers } from '@/lib/data'
import { type IPlaylist } from '@/lib/data'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { cleanCover, cleanCovers } from '@/utils/clean'
import { updateSections } from '@/utils/sections'
import { withViewTransition } from '@/utils/transition'
import { useTranslation } from 'react-i18next'

export default function ModalEditPlaylist ({
  playlist,
  isOpen,
  setIsOpen,
  handledCloseModal,
}: {
  playlist?: IPlaylist
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  handledCloseModal: () => void
}) {
  const { t } = useTranslation()
  const {
    editTemporallyColor,
    setEditTemporallyColor,
    editTemporallyTitle,
    setEditTemporallyTitle,
    editTemporallyCover,
    setEditTemporallyCover,
    sections,
    setSections,
    editTemporallySection,
    setEditTemporallySection,
    currentSectionView,
    currentPlaylistView,
    setCurrentPlaylistView,
  } = usePlayerStore<StoreType>((state) => state)

  const handledEditPlaylist = (event: any) => {
    if (event.target.value === undefined) return
    const newTitle = event.target.value as string
    setEditTemporallyTitle(newTitle)
  }

  const handleColorChange = (event: any) => {
    const newColor = event.target.value as string
    setEditTemporallyColor(newColor)
  }

  const handleSavePlaylist = (event: any) => {
    event.preventDefault()
    const newPlaylist: IPlaylist = {
      ...currentPlaylistView!,
      title: editTemporallyTitle,
      color: editTemporallyColor,
      cover: editTemporallyCover,
    }
    const newSections = updateSections(
      sections,
      currentSectionView,
      editTemporallySection,
      newPlaylist
    )
    withViewTransition(() => {
      setEditTemporallyTitle('')
      setEditTemporallyCover([])
      setCurrentPlaylistView(newPlaylist)
      setSections(newSections)
      setIsOpen(false)
    })
  }

  const handledUploadImage = async () => {
    const image = await window.electronAPI.getImageToCover()
    if (image === '') return
    setEditTemporallyCover([image])
  }

  const coversCleaned = cleanCovers(covers)
  const handledCoverPlaylist = (newCover: string) => {
    if (newCover === undefined) return
    if (coversCleaned.includes(newCover)) {
      setEditTemporallyCover([`Covers/${newCover}`])
    } else {
      setEditTemporallyCover([newCover])
    }
  }

  const handledSection = (event: any) => {
    const newSection = event.target.value as string
    setEditTemporallySection(newSection)
  }

  return (
    <div>
      {isOpen && (
        <div
          onClick={handledCloseModal}
          className={
            'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20'
          }
        >
          <section
            onClick={(event) => {
              event.stopPropagation()
            }}
            className="relative flex flex-col bg-zinc-900 rounded-md p-6 gap-4 px-6 mt-12 mb-8"
          >
            <div className="flex justify-between">
              <h1>{t('edit.modalTitle')}</h1>
              <button
                className="flex p-2 rounded-full opacity-70 hover:bg-zinc-800 hover:opacity-100"
                onClick={handledCloseModal}
              >
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleSavePlaylist} className="flex flex-row">
              {playlist?.cover.length === 1 ||
              editTemporallyCover.length === 1 ? (
                <picture className="relative aspect-square w-64 h-64 flex-none mr-6 mt-2">
                  <img
                    src={
                      editTemporallyCover.length === 1
                        ? editTemporallyCover[0]
                        : playlist?.cover[0]
                    }
                    alt={`Cover of ${
                      playlist?.title
                    } by ${playlist?.artists.join(',')}`}
                    className="object-cover h-full rounded-md"
                  />
                  <div
                    onClick={handledUploadImage}
                    className="absolute bg-black opacity-0 hover:opacity-80 w-full h-full top-0 flex justify-center items-center flex-col"
                  >
                    <PencilIcon />
                    <h1 className="mt-6">{t('edit.choose')}</h1>
                  </div>
                </picture>
                  ) : (
                <div className="relative grid grid-cols-2 aspect-square  w-64 h-64 mr-4 mt-2">
                  {playlist?.cover.map((cover, index) => (
                    <div key={index} className="relative w-full h-full">
                      <img
                        src={cover}
                        alt={`Song ${index}`}
                        className="absolute w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  <div
                    onClick={handledUploadImage}
                    className="absolute bg-black opacity-0 hover:opacity-80 w-full h-full top-0 flex justify-center items-center flex-col"
                  >
                    <PencilIcon />
                    <h1 className="mt-6">{t('edit.choose')}</h1>
                  </div>
                </div>
                  )}
              <div className="flex flex-col">
                {/* Title */}
                <label htmlFor="title">{t('edit.title')}</label>
                <input
                  type="text"
                  id="title"
                  value={editTemporallyTitle}
                  className="p-2 rounded-md bg-zinc-800 mb-4"
                  onChange={handledEditPlaylist}
                />
                {/* Cover */}
                <label htmlFor="color" className="mb-4 flex flex-col">
                  <span>{t('edit.cover')}</span>
                  <input
                    list="options"
                    value={cleanCover(editTemporallyCover[0])}
                    onChange={(event: any) => { handledCoverPlaylist(event.target.value) }}
                    placeholder="Chooise a cover..."
                    className="p-2 rounded-md bg-zinc-800"
                  />
                  <datalist id="options" className="bg-zinc-700">
                    {coversCleaned.map((cover) => (
                      <option key={cover} value={cover}>
                        {cover}
                      </option>
                    ))}
                  </datalist>
                </label>
                {/* Color */}
                <label htmlFor="color" className="block mb-4">
                  <span className="">{t('edit.color')}</span>
                  <select
                    id="color"
                    onChange={handleColorChange}
                    className="w-full mt-1 rounded-md p-2 bg-zinc-800"
                    value={editTemporallyColor}
                  >
                    {Object.entries(colors).map(([colorName]) => (
                      <option key={colorName} value={colorName}>
                        {t(`colors.${colorName}`)}
                      </option>
                    ))}
                  </select>
                </label>
                {/* Section */}
                <label htmlFor="section" className="block mb-4">
                  <span className="">{t('edit.section')}</span>
                  <select
                    id="section"
                    onChange={handledSection}
                    className="w-full mt-1 rounded-md p-2 bg-zinc-800"
                    value={editTemporallySection}
                  >
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.title}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  className="bg-gray-200 text-black rounded-full font-bold w-32 py-3 self-end"
                  type="submit"
                >
                  {t('edit.save')}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
