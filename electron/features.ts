import fs from 'node:fs'
import { getRandomColor, getRandomImage, naturalSort } from './utils'
import path from 'node:path'
import { allowedExtensions } from './constants'
import musicMetadata from 'music-metadata'
import { type ISong } from './entities/song.entity'
import { type IPlaylist } from './entities/playlist.entity'
import crypto from 'node:crypto'

export async function getPlaylistFromDirectory (directory: string) {
  try {
    const files = fs.readdirSync(directory)
    const randomImage = getRandomImage()
    const newPlaylistUUID = crypto.randomUUID()
    const titlePlaylist = path.basename(directory)

    const songsWithMetadata = await Promise.all(
      files
        .filter(file => allowedExtensions.has(path.extname(file).toLowerCase()))
        .sort(naturalSort)
        .map(async (file) => {
          const filePath = path.join(directory, file)
          const fileName = path.basename(filePath)
          const format = path.extname(filePath)

          try {
            const metadata = await musicMetadata.parseFile(filePath)
            let duration = 0
            if (metadata.format.duration !== undefined) {
              duration = metadata.format.duration
            }
            const newSong: ISong = {
              id: crypto.randomUUID(),
              albumId: newPlaylistUUID,
              title: fileName,
              directoryPath: directory,
              image: randomImage,
              artists: ['artist'],
              album: titlePlaylist,
              duration,
              format,
              isDragging: false
            }
            return newSong
          } catch (error) {
            console.error(`Error to read the metadata to file: ${file}`, error)
          }
        })
    )

    const newPlaylist: IPlaylist = {
      id: newPlaylistUUID,
      albumId: newPlaylistUUID,
      title: titlePlaylist,
      color: getRandomColor(),
      cover: [randomImage],
      artists: ['artist'],
      songs: songsWithMetadata as ISong[]
    }
    return newPlaylist
  } catch (error) {
    console.error('Error in read the directory', error)
    return {}
  }
}
