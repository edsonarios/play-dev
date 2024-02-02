import { getRandomColor } from 'electron/utils'

export interface IPlaylist {
  id: string
  albumId: string
  title: string
  color: string
  cover: string[]
  artists: string[]
  songs: ISong[]
}

export const playlists: IPlaylist[] = [
  {
    id: '1',
    albumId: '1',
    title: 'All Songs',
    color: getRandomColor(),
    cover:
      ['Covers/cover1.jpg'],
    artists: [],
    songs: []
  }
]

export interface ISong {
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
}

export const songs: ISong[] = []
export const covers: string[] = [
  'Covers/cover1.jpg',
  'Covers/cover2.jpg',
  'Covers/cover3.jpg',
  'Covers/cover4.jpg',
  'Covers/cover5.jpg',
  'Covers/cover6.jpg',
  'Covers/cover7.jpg',
  'Covers/cover8.jpg',
  'Covers/cover9.jpg',
  'Covers/cover10.jpg',
  'Covers/cover11.jpg',
  'Covers/cover12.jpg'
]
