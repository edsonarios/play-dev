import { colors } from './colors'

export interface Playlist {
  id: number
  albumId: number
  title: string
  color: (typeof colors)[keyof typeof colors]
  cover: string
  artists: string[]
}

export const playlists: Playlist[] = [
  {
    id: 1,
    albumId: 1,
    title: 'All Songs',
    color: colors.purple,
    cover:
      'https://vinyl.lofirecords.com/cdn/shop/products/VINYL_MORNING_COFFEE_4-min.png?v=1680526353',
    artists: []
  }
]

export interface Song {
  id: number
  albumId: number
  title: string
  directoryPath: string
  image: string
  artists: string[]
  album: string
  duration: string
  format: string
}

export const songs: Song[] = []
export const covers: string[] = [
  'https://vinyl.lofirecords.com/cdn/shop/products/VINYL_MORNING_COFFEE_4-min.png?v=1680526353',
  'https://vinyl.lofirecords.com/cdn/shop/files/2amsynth-vinyl.png?v=1693312187',
  'https://f4.bcbits.com/img/a1435058381_65.jpg',
  'https://f4.bcbits.com/img/a1962013209_16.jpg',
  'https://f4.bcbits.com/img/a2793859494_16.jpg',
  'https://f4.bcbits.com/img/a0363730459_16.jpg'
]
