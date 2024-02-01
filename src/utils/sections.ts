import { type ISections } from '@/lib/entities/sections.entity'
import { type IPlaylist } from 'electron/entities/playlist.entity'

export function updateSections (sections: ISections[], sectionId: string, playlist: IPlaylist) {
  const cleanSections = sections.map(section => {
    return {
      ...section,
      playlists: section.playlists.filter(ply => ply.id !== playlist.id)
    }
  })
  return cleanSections.map(section => {
    if (section.id === sectionId) {
      return {
        ...section,
        playlists: [...section.playlists, playlist]
      }
    }
    return section
  })
}
