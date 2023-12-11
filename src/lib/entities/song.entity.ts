import { type ISong } from '../data'

export class Song {
  id: string
  albumId: string
  title: string
  directoryPath: string
  image: string
  artists: string[]
  album: string
  duration: number
  format: string
  isDragging: boolean
  constructor (song: ISong) {
    this.id = song.id
    this.albumId = song.albumId
    this.title = song.title
    this.directoryPath = song.directoryPath
    this.image = song.image
    this.artists = song.artists
    this.album = song.album
    this.duration = song.duration
    this.format = song.format
    this.isDragging = song.isDragging
  }
}
