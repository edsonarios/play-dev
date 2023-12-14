import { CloseIcon } from '@/icons/aside/Library'
import { colors } from '@/lib/colors'
import { type Playlist } from '@/lib/entities/playlist.entity'
import { type StoreType, usePlayerStore } from '@/store/playerStore'

export default function ModalEditPlaylist ({
  playlist,
  isOpen,
  setIsOpen,
  handledCloseModal
}: {
  playlist?: Playlist
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  handledCloseModal: () => void
}) {
  const { playlists, setPlaylists, editTemporallyColor, setEditTemporallyColor, editTemporallyTitle, setEditTemporallyTitle, currentMusic, setCurrentMusic } =
    usePlayerStore<StoreType>((state) => state)

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
          color: editTemporallyColor
        }
        if (currentMusic.playlist?.id === playlist.id) {
          setCurrentMusic({ ...currentMusic, playlist: newItem })
        }
        return newItem
      }
      return item
    })
    setPlaylists(newPlaylists)
    setEditTemporallyTitle('')
    setIsOpen(false)
  }

  return (
    <div
      onClick={handledCloseModal}
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 
      ${isOpen ? '' : 'hidden'}`}
    >
      <section
        onClick={(event) => { event.stopPropagation() }}
        className="relative flex flex-col bg-zinc-900 rounded-md p-6 gap-8 px-6 mt-12 mb-8">
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
          <picture className="aspect-square w-52 h-52 flex-none mr-4">
            <img
              src={playlist?.cover}
              alt={`Cover of ${playlist?.title}`}
              className="object-cover w-full h-full shadow-lg rounded-md"
            />
          </picture>

          <div className="flex flex-col">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={editTemporallyTitle}
              className="p-2 rounded-md bg-zinc-800 mb-6"
              onChange={handledEditPlaylist}
            />

            <label htmlFor="color" className="block mb-6">
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
  )
}
