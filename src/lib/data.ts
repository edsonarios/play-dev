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
    title: 'Chill Lo-Fi Music',
    color: colors.purple,
    cover:
      'https://vinyl.lofirecords.com/cdn/shop/products/VINYL_MORNING_COFFEE_4-min.png?v=1680526353',
    artists: ['NoSpirit', 'Casiio']
  },
  {
    id: 2,
    albumId: 2,
    title: 'Movies Songs',
    color: colors.green,
    cover:
      'https://vinyl.lofirecords.com/cdn/shop/files/2amsynth-vinyl.png?v=1693312187',
    artists: ['Hans Zimer', 'Tenicius D', 'La la land']
  },
  {
    id: 3,
    albumId: 3,
    title: 'Study Session',
    color: colors.rose,
    cover:
      'https://f4.bcbits.com/img/a1435058381_65.jpg',
    artists: ['Tenno', 'xander', 'Team Astro']
  },
  {
    id: 4,
    albumId: 4,
    title: 'Blue Note Study Time',
    color: colors.blue,
    cover:
      'https://f4.bcbits.com/img/a1962013209_16.jpg',
    artists: ['Raimu', 'Yasumu']
  },
  {
    id: 5,
    albumId: 5,
    title: 'Chau Saura Session',
    color: colors.purple,
    cover:
      'https://f4.bcbits.com/img/a2793859494_16.jpg',
    artists: ['Chau Saura', 'amies', 'kyu']
  },
  {
    id: 6,
    albumId: 6,
    title: 'Like a Necessity',
    color: colors.orange,
    cover:
      'https://f4.bcbits.com/img/a0363730459_16.jpg',
    artists: ['WFS', 'Nadav Cohen']
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
  },
  {
    id: 1,
    albumId: 3,
    title: 'Lunar',
    image: 'https://f4.bcbits.com/img/a1435058381_65.jpg',
    artists: ['Tenno'],
    album: 'Study Session',
    duration: '3:40',
    format: 'mp3'
  },
  {
    id: 2,
    albumId: 3,
    title: 'Go go go!',
    image: 'https://f4.bcbits.com/img/a1435058381_65.jpg',
    artists: ['Tenno'],
    album: 'Study Session',
    duration: '3:20',
    format: 'mp3'
  },
  {
    id: 3,
    albumId: 3,
    title: 'Keep focus!',
    image: 'https://f4.bcbits.com/img/a1435058381_65.jpg',
    artists: ['Tenno'],
    album: 'Study Session',
    duration: '2:40',
    format: 'mp3'
  },
  {
    id: 4,
    albumId: 3,
    title: 'JavaScript is the way',
    image: 'https://f4.bcbits.com/img/a1435058381_65.jpg',
    artists: ['Tenno'],
    album: 'Study Session',
    duration: '3:10',
    format: 'mp3'
  },
  {
    id: 5,
    albumId: 3,
    title: 'No more TypeScript for me',
    image: 'https://f4.bcbits.com/img/a1435058381_65.jpg',
    artists: ['Tenno'],
    album: 'Study Session',
    duration: '2:10',
    format: 'mp3'
  },
  {
    id: 1,
    albumId: 4,
    title: 'Lunar',
    image: 'https://f4.bcbits.com/img/a1962013209_16.jpg',
    artists: ['Tenno'],
    album: 'Study Session',
    duration: '3:40',
    format: 'mp3'
  },
  {
    id: 2,
    albumId: 4,
    title: 'Go go go!',
    image: 'https://f4.bcbits.com/img/a1962013209_16.jpg',
    artists: ['Tenno'],
    album: 'Study Session',
    duration: '3:20',
    format: 'mp3'
  },
  {
    id: 3,
    albumId: 4,
    title: 'Keep focus!',
    image: 'https://f4.bcbits.com/img/a1962013209_16.jpg',
    artists: ['Tenno'],
    album: 'Study Session',
    duration: '2:40',
    format: 'mp3'
  },
  {
    id: 4,
    albumId: 4,
    title: 'JavaScript is the way',
    image: 'https://f4.bcbits.com/img/a1962013209_16.jpg',
    artists: ['Tenno'],
    album: 'Study Session',
    duration: '3:10',
    format: 'mp3'
  },
  {
    id: 5,
    albumId: 4,
    title: 'No more TypeScript for me',
    image: 'https://f4.bcbits.com/img/a1962013209_16.jpg',
    artists: ['Tenno'],
    album: 'Study Session',
    duration: '2:10',
    format: 'mp3'
  },
  {
    id: 1,
    albumId: 5,
    title: 'Moonlit Walk',
    image: 'https://f4.bcbits.com/img/a2793859494_16.jpg',
    artists: ['LoFi Dreamer'],
    album: 'Chill Lo-Fi Music',
    duration: '3:12',
    format: 'mp3'
  },
  {
    id: 2,
    albumId: 5,
    title: 'Coffee Daze',
    image: 'https://f4.bcbits.com/img/a2793859494_16.jpg',
    artists: ['LoFi Dreamer'],
    album: 'Chill Lo-Fi Music',
    duration: '4:07',
    format: 'mp3'
  },
  {
    id: 3,
    albumId: 5,
    title: 'Skyline Serenade',
    image: 'https://f4.bcbits.com/img/a2793859494_16.jpg',
    artists: ['LoFi Dreamer'],
    album: 'Chill Lo-Fi Music',
    duration: '3:50',
    format: 'mp3'
  },
  {
    id: 4,
    albumId: 5,
    title: 'Urban Echoes',
    image: 'https://f4.bcbits.com/img/a2793859494_16.jpg',
    artists: ['LoFi Dreamer'],
    album: 'Chill Lo-Fi Music',
    duration: '3:30',
    format: 'mp3'
  },
  {
    id: 5,
    albumId: 5,
    title: "Night's End",
    image: 'https://f4.bcbits.com/img/a2793859494_16.jpg',
    artists: ['LoFi Dreamer'],
    album: 'Chill Lo-Fi Music',
    duration: '4:20',
    format: 'mp3'
  }
]
