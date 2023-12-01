import { colors } from './colors'

export interface Playlist {
  id: number
  albumId: number
  title: string
  color: (typeof colors)[keyof typeof colors]
  directoryPath: string
  cover: string
  artists: string[]
}

export const playlists: Playlist[] = [
  {
    id: 1,
    albumId: 1,
    title: 'Chill Lo-Fi Music',
    color: colors.purple,
    directoryPath: 'D:/Musica/Anime',
    cover:
      'https://vinyl.lofirecords.com/cdn/shop/products/VINYL_MORNING_COFFEE_4-min.png?v=1680526353',
    artists: ['NoSpirit', 'Casiio']
  },
  {
    id: 2,
    albumId: 2,
    title: 'Movies Songs',
    color: colors.green,
    directoryPath: 'D:/Musica/Peliculas',
    cover:
      'https://vinyl.lofirecords.com/cdn/shop/files/2amsynth-vinyl.png?v=1693312187',
    artists: ['Hans Zimer', 'Tenicius D', 'La la land']
  }
]

export interface Song {
  id: number
  albumId: number
  title: string
  image: string
  artists: string[]
  album: string
  duration: string
  format: string
}

export const songs: Song[] = [
  {
    id: 1,
    albumId: 1,
    title: 'Summertime Render - Op 2',
    image: 'https://vinyl.lofirecords.com/cdn/shop/products/VINYL_MORNING_COFFEE_4-min.png?v=1680526353',
    artists: ['Anime'],
    album: 'Chill Lo-Fi Music',
    duration: '1:30',
    format: 'mp4'
  },
  {
    id: 2,
    albumId: 1,
    title: 'Shrek Yo Quiero Un Heroe Video',
    image: 'https://vinyl.lofirecords.com/cdn/shop/products/VINYL_MORNING_COFFEE_4-min.png?v=1680526353',
    artists: ['Anime'],
    album: 'Chill Lo-Fi Music',
    duration: '1:30',
    format: 'mp4'
  },
  {
    id: 3,
    albumId: 1,
    title: 'Vinland Saga Opening 1',
    image: 'https://vinyl.lofirecords.com/cdn/shop/products/VINYL_MORNING_COFFEE_4-min.png?v=1680526353',
    artists: ['Anime'],
    album: 'Chill Lo-Fi Music',
    duration: '4:03',
    format: 'mp4'
  },
  {
    id: 4,
    albumId: 1,
    title: 'Ousama Ranking - Op 2',
    image: 'https://vinyl.lofirecords.com/cdn/shop/products/VINYL_MORNING_COFFEE_4-min.png?v=1680526353',
    artists: ['Anime'],
    album: 'Chill Lo-Fi Music',
    duration: '1:30',
    format: 'mp4'
  },
  {
    id: 5,
    albumId: 1,
    title: 'Made in Abyss - Op 2',
    image: 'https://vinyl.lofirecords.com/cdn/shop/products/VINYL_MORNING_COFFEE_4-min.png?v=1680526353',
    artists: ['Anime'],
    album: 'Chill Lo-Fi Music',
    duration: '1:30',
    format: 'mp4'
  },
  {
    id: 1,
    albumId: 2,
    title: 'Batman - Im not a hero',
    image: 'https://vinyl.lofirecords.com/cdn/shop/files/2amsynth-vinyl.png?v=1693312187',
    artists: ['Peliculas Songs'],
    album: 'Midnight Tales',
    duration: '05:24',
    format: 'mp4'
  },
  {
    id: 2,
    albumId: 2,
    title: 'El Dador de Recuerdos - Escena - Piano (The Giver) - 720p',
    image: 'https://vinyl.lofirecords.com/cdn/shop/files/2amsynth-vinyl.png?v=1693312187',
    artists: ['Peliculas Songs'],
    album: 'Midnight Tales',
    duration: '01:11',
    format: 'mp4'
  },
  {
    id: 3,
    albumId: 2,
    title: 'El Origen de Juego de Tronos - CANCIÓN Parodia - Destripando la Historia - 720p',
    image: 'https://vinyl.lofirecords.com/cdn/shop/files/2amsynth-vinyl.png?v=1693312187',
    artists: ['Peliculas Songs'],
    album: 'Midnight Tales',
    duration: '02:20',
    format: 'mp4'
  },
  {
    id: 4,
    albumId: 2,
    title: 'Hans Zimmer live Pirates At Worlds End Premiere',
    image: 'https://vinyl.lofirecords.com/cdn/shop/files/2amsynth-vinyl.png?v=1693312187',
    artists: ['Peliculas Songs'],
    album: 'Midnight Tales',
    duration: '01:50',
    format: 'mp4'
  },
  {
    id: 5,
    albumId: 2,
    title: 'La La Land -  John Legend  - Start a Fire',
    image: 'https://vinyl.lofirecords.com/cdn/shop/files/2amsynth-vinyl.png?v=1693312187',
    artists: ['Peliculas Songs'],
    album: 'Midnight Tales',
    duration: '02:00',
    format: 'mp4'
  },
  {
    id: 6,
    albumId: 2,
    title: 'Pirataas del caribe - Parley',
    image: 'https://vinyl.lofirecords.com/cdn/shop/files/2amsynth-vinyl.png?v=1693312187',
    artists: ['Peliculas Songs'],
    album: 'Midnight Tales',
    duration: '02:26',
    format: 'mp4'
  },
  {
    id: 7,
    albumId: 2,
    title: 'Piratas del caribe - One Day',
    image: 'https://vinyl.lofirecords.com/cdn/shop/files/2amsynth-vinyl.png?v=1693312187',
    artists: ['Peliculas Songs'],
    album: 'Midnight Tales',
    duration: '03:40',
    format: 'mp4'
  },
  {
    id: 8,
    albumId: 2,
    title: 'Piratas del Caribe - The Kracken',
    image: 'https://vinyl.lofirecords.com/cdn/shop/files/2amsynth-vinyl.png?v=1693312187',
    artists: ['Peliculas Songs'],
    album: 'Midnight Tales',
    duration: '01:17',
    format: 'mp4'
  },
  {
    id: 9,
    albumId: 2,
    title: 'Piratas del Caribe - Up Is Down',
    image: 'https://vinyl.lofirecords.com/cdn/shop/files/2amsynth-vinyl.png?v=1693312187',
    artists: ['Peliculas Songs'],
    album: 'Midnight Tales',
    duration: '03:45',
    format: 'mp4'
  },
  {
    id: 10,
    albumId: 2,
    title: 'Tenicius D - Diablo Song',
    image: 'https://vinyl.lofirecords.com/cdn/shop/files/2amsynth-vinyl.png?v=1693312187',
    artists: ['Peliculas Songs'],
    album: 'Midnight Tales',
    duration: '3:42',
    format: 'mp4'
  }
]
export const covers: string[] = [
  'https://vinyl.lofirecords.com/cdn/shop/products/VINYL_MORNING_COFFEE_4-min.png?v=1680526353',
  'https://vinyl.lofirecords.com/cdn/shop/files/2amsynth-vinyl.png?v=1693312187',
  'https://f4.bcbits.com/img/a1435058381_65.jpg',
  'https://f4.bcbits.com/img/a1962013209_16.jpg',
  'https://f4.bcbits.com/img/a2793859494_16.jpg',
  'https://f4.bcbits.com/img/a0363730459_16.jpg'
]
