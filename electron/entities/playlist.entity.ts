interface Color {
  accent: string
  dark: string
}

export type IColorRecord = Record<string, Color>

export const colors: IColorRecord = {
  red: { accent: '#da2735', dark: '#7f1d1d' },
  orange: { accent: '#cc5400', dark: '#7c2d12' },
  yellow: { accent: '#ffae00', dark: '#78350f' },
  green: { accent: '#21c872', dark: '#14532d' },
  teal: { accent: '#2ee9d7', dark: '#134e4a' },
  blue: { accent: '#1e3a8a', dark: '#1e3a8a' },
  indigo: { accent: '#394bd5', dark: '#312e81' },
  purple: { accent: '#df24ff', dark: '#581c87' },
  pink: { accent: '#f33b73', dark: '#831843' },
  emerald: { accent: '#0c6e54', dark: '#064e3b' },
  rose: { accent: '#ed2377', dark: '#871b48' },
  gray: { accent: '#7F7F7F', dark: '#535353' }
}

export interface IPlaylist {
  id: string
  albumId: string
  title: string
  color: (typeof colors)[keyof typeof colors]
  cover: string
  artists: string[]
}

export class Playlist {
  id: string
  albumId: string
  title: string
  color: (typeof colors)[keyof typeof colors]
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

export const covers: string[] = [
  'https://vinyl.lofirecords.com/cdn/shop/products/VINYL_MORNING_COFFEE_4-min.png?v=1680526353',
  'https://vinyl.lofirecords.com/cdn/shop/files/2amsynth-vinyl.png?v=1693312187',
  'https://f4.bcbits.com/img/a1435058381_65.jpg',
  'https://f4.bcbits.com/img/a1962013209_16.jpg',
  'https://f4.bcbits.com/img/a2793859494_16.jpg',
  'https://f4.bcbits.com/img/a0363730459_16.jpg'
]
