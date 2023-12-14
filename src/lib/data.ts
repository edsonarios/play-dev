import { getRandomColor } from 'electron/utils'

export interface IPlaylist {
  id: string
  albumId: string
  title: string
  color: string
  cover: string
  artists: string[]
}

export const playlists: IPlaylist[] = [
  {
    id: '1',
    albumId: '1',
    title: 'All Songs',
    color: getRandomColor(),
    cover:
      'file://C:/Users/edson/Pictures/Covers/cover1.jpg',
    artists: []
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
  'file://C:/Users/edson/Pictures/Covers/cover1.jpg',
  'file://C:/Users/edson/Pictures/Covers/cover2.jpg',
  'file://C:/Users/edson/Pictures/Covers/cover3.jpg',
  'file://C:/Users/edson/Pictures/Covers/cover4.jpg',
  'file://C:/Users/edson/Pictures/Covers/cover5.jpg',
  'file://C:/Users/edson/Pictures/Covers/cover6.jpg',
  'file://C:/Users/edson/Pictures/Covers/cover7.jpg',
  'file://C:/Users/edson/Pictures/Covers/cover8.jpg',
  'file://C:/Users/edson/Pictures/Covers/cover9.jpg',
  'file://C:/Users/edson/Pictures/Covers/cover10.jpg',
  'file://C:/Users/edson/Pictures/Covers/cover11.jpg',
  'file://C:/Users/edson/Pictures/Covers/cover12.jpg'
]
