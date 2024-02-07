import { type IPlaylist, type ISections } from '@/lib/data'

export function updateSections (sections: ISections[], currentSectionID: string, newSectionID: string, playlist: IPlaylist): ISections[] {
  const newSectionsToClean = structuredClone(sections)
  if (currentSectionID === newSectionID) {
    return newSectionsToClean.map(section => {
      if (section.id === newSectionID) {
        return {
          ...section,
          playlists: section.playlists.map(ply => {
            if (ply.id === playlist.id) {
              return playlist
            }
            return ply
          })
        }
      }
      return section
    })
  } else {
    const cleanSections = newSectionsToClean.map(section => {
      return {
        ...section,
        playlists: section.playlists.filter(ply => ply.id !== playlist.id)
      }
    })
    return cleanSections.map(section => {
      if (section.id === newSectionID) {
        return {
          ...section,
          playlists: [...section.playlists, playlist]
        }
      }
      return section
    })
  }
}
