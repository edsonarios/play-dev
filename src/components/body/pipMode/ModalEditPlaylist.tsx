import { CloseIcon } from '@/icons/edit/Close'
import { PencilIcon } from '@/icons/edit/Pencil'
import { colors } from '@/lib/colors'
import { type Playlist } from '@/lib/entities/playlist.entity'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { updateSections } from '@/utils/sections'
import { withViewTransition } from '@/utils/transition'
import { type IPlaylist } from 'electron/entities/playlist.entity'

export default function ModalEditPlaylist ({
  playlist,
  isOpen,
  setIsOpen,
  handledCloseModal
}: {
  playlist?: IPlaylist
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  handledCloseModal: () => void
}) {
  const {
    playlists,
    setPlaylists,
    editTemporallyColor,
    setEditTemporallyColor,
    editTemporallyTitle,
    setEditTemporallyTitle,
    currentMusic,
    setCurrentMusic,
    editTemporallyCover,
    setEditTemporallyCover,
    sections,
    setSections,
    editTemporallySection,
    setEditTemporallySection
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
    if (playlist === undefined) return
    const newPlaylists = playlists.map((item) => {
      if (item.id === playlist.id) {
        const newItem: Playlist = {
          ...item,
          title: editTemporallyTitle,
          color: editTemporallyColor,
          cover: editTemporallyCover
        }
        if (currentMusic.playlist?.id === playlist.id) {
          setCurrentMusic({ ...currentMusic, playlist: newItem })
        }
        return newItem
      }
      return item
    })
    const newSections = updateSections(sections, editTemporallySection, playlist)
    withViewTransition(() => {
      setPlaylists(newPlaylists)
      setEditTemporallyTitle('')
      setEditTemporallyCover([])
      setIsOpen(false)
      setSections(newSections)
    })
  }

  const handledUploadImage = async () => {
    const image = await window.electronAPI.getImageToCover()
    if (image === '') return
    setEditTemporallyCover([image])
  }

  const handledCoverPlaylist = (event: any) => {
    if (event.target.value === undefined) return
    const newCover = event.target.value as string
    setEditTemporallyCover([newCover])
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
              <h1>Edit Playlist</h1>
              <button
                className="flex p-2 rounded-full opacity-70 hover:bg-zinc-800 hover:opacity-100"
                onClick={handledCloseModal}
              >
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleSavePlaylist} className="flex flex-row">
              {playlist?.cover.length === 1 || editTemporallyCover.length === 1
                ? (
                <picture className="relative aspect-square w-64 h-64 flex-none mr-6 mt-2">
                  <img
                    src={editTemporallyCover.length === 1 ? editTemporallyCover[0] : playlist?.cover[0]}
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
                    <h1 className="mt-6">Chooise image</h1>
                  </div>
                </picture>
                  )
                : (
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
                    <h1 className="mt-6">Chooise image</h1>
                  </div>
                </div>
                  )}
              <div className="flex flex-col">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={editTemporallyTitle}
                  className="p-2 rounded-md bg-zinc-800 mb-4"
                  onChange={handledEditPlaylist}
                />

                <label htmlFor="title">Cover</label>
                <input
                  type="text"
                  id="title"
                  value={editTemporallyCover[0]}
                  className="p-2 rounded-md bg-zinc-800 mb-4"
                  onChange={handledCoverPlaylist}
                />

                <label htmlFor="color" className="block mb-4">
                  <span className="">Color</span>
                  <select
                    id="color"
                    onChange={handleColorChange}
                    className="w-full mt-1 rounded-md p-2 bg-zinc-800"
                    value={editTemporallyColor}
                  >
                    {Object.entries(colors).map(([colorName]) => (
                      <option key={colorName} value={colorName}>
                        {colorName.charAt(0).toUpperCase() + colorName.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>

                <label htmlFor="color" className="block mb-4">
                  <span className="">Section</span>
                  <select
                    id="color"
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
                  Save
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
