import { type ISections } from '@/lib/data'
import { withViewTransition } from '@/utils/transition'

export const OpenFolder = async (
  sections: ISections[],
  setSections: (sections: ISections[]) => void,
  setIsLoading: (isLoading: boolean) => void,
) => {
  withViewTransition(async () => {
    setIsLoading(true)
    const folder = await window.electronAPI.openDirectoryDialog()
    if (folder?.playlist !== undefined) {
      const newSections = structuredClone(sections)
      const sectionUpdates = newSections.map((section) => {
        if (section.id === '1') {
          section.playlists.push(folder.playlist)
        }
        return section
      })
      setSections(sectionUpdates)
    }
    setIsLoading(false)
  })
}
