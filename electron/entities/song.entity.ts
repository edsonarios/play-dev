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
