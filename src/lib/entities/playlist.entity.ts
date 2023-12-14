import { type IPlaylist } from '../data'

export class Playlist {
  id: string
  albumId: string
  title: string
  color: string
  cover: string
  artists: string[]

  constructor (playlist: IPlaylist) {
    this.id = playlist.id
    this.albumId = playlist.albumId
    this.title = playlist.title
    this.color = playlist.color
    this.cover = playlist.cover
    this.artists = playlist.artists
  }
}
