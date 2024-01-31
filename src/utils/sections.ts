import { type ISections } from '@/lib/entities/sections.entity'
import { type IPlaylist } from 'electron/entities/playlist.entity'

export function updateSections (sections: ISections[], sectionId: string, playlist: IPlaylist) {
  return sections.map(section => {
    if (section.id === sectionId) {
      return {
        ...section,
        playlists: [...section.playlists, playlist]
      }
    }
    return section
  })
}
