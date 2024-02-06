import { type IPlaylist, type ISections } from '@/lib/data'

export function updateSections (sections: ISections[], sectionID: string, playlist: IPlaylist): ISections[] {
  const newSectionsToClean = structuredClone(sections)
  const cleanSections = newSectionsToClean.map(section => {
    return {
      ...section,
      playlists: section.playlists.filter(ply => ply.id !== playlist.id)
    }
  })
  return cleanSections.map(section => {
    if (section.id === sectionID) {
      return {
        ...section,
        playlists: [...section.playlists, playlist]
      }
    }
    return section
  })
}
