import { type IPlaylist } from '../data'

export interface ISections {
  id: string
  title: string
  playlists: IPlaylist[]
}

export class Sections {
  id: string
  title: string
  playlists: IPlaylist[]

  constructor (sections: ISections) {
    this.id = sections.id
    this.title = sections.title
    this.playlists = sections.playlists
  }
}
