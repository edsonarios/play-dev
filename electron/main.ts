import { app, BrowserWindow, dialog, globalShortcut, ipcMain } from 'electron'
import fs from 'node:fs'
import path from 'node:path'
import musicMetadata from 'music-metadata'
import crypto from 'crypto'
import { getRandomColor, getRandomImage, naturalSort } from './utils'
import { allowedExtensions } from './constants'
import { Song } from './entities/song.entity'
import { Playlist } from './entities/playlist.entity'
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

function createWindow () {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    },
    // fullscreen: true,
    width: 1850,
    height: 1000,
    x: 1925,
    y: 60
    // alwaysOnTop: true
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date()).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL != null) {
    void win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    void win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

void app.whenReady().then(createWindow)

void app.whenReady().then(() => {
  // Made global shourcouts
  // globalShortcut.register('CommandOrControl+X', () => {
  //   console.log('GLobal command activate')
  // })

  globalShortcut.register('MediaPlayPause', () => {
    win?.webContents.send('media-action', 'play-pause')
  })

  globalShortcut.register('MediaNextTrack', () => {
    win?.webContents.send('media-action', 'next-track')
  })

  globalShortcut.register('MediaPreviousTrack', () => {
    win?.webContents.send('media-action', 'previous-track')
  })
})

app.on('will-quit', () => {
  // Unregister all shourcout of the app
  globalShortcut.unregisterAll()
})

// Open directory dialog
ipcMain.handle('open-directory-dialog', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openFile'] })
  if (result.canceled || result.filePaths.length === 0) return {}

  let originalDirectoryPath: string

  if (fs.lstatSync(result.filePaths[0]).isDirectory()) {
    originalDirectoryPath = result.filePaths[0]
  } else {
    originalDirectoryPath = path.dirname(result.filePaths[0])
  }

  try {
    const files = fs.readdirSync(originalDirectoryPath)

    const randomImage = getRandomImage()
    const newPlaylistUUID = crypto.randomUUID()
    const titlePlaylist = path.basename(originalDirectoryPath)
    const newPlaylist = new Playlist({
      id: newPlaylistUUID,
      albumId: newPlaylistUUID,
      title: titlePlaylist,
      color: getRandomColor(),
      cover: randomImage,
      artists: ['artist']
    })

    const songsWithMetadata = await Promise.all(
      files
        .filter(file => allowedExtensions.has(path.extname(file).toLowerCase()))
        .sort(naturalSort)
        .map(async (file) => {
          const filePath = path.join(originalDirectoryPath, file)
          const fileName = path.basename(filePath)
          const format = path.extname(filePath)

          try {
            const metadata = await musicMetadata.parseFile(filePath)
            let duration = 0
            if (metadata.format.duration !== undefined) {
              duration = metadata.format.duration
            }
            const newSong = new Song({
              id: crypto.randomUUID(),
              albumId: newPlaylistUUID,
              title: fileName,
              directoryPath: originalDirectoryPath,
              image: randomImage,
              artists: ['artist'],
              album: titlePlaylist,
              duration,
              format,
              isDragging: false
            })
            return newSong
          } catch (error) {
            console.error(`Error to read the metadata to file: ${file}`, error)
            return null
          }
        })
    )
    return {
      playlist: newPlaylist,
      songs: songsWithMetadata
    }
  } catch (err) {
    console.error('Error in read the directory', err)
    return {}
  }
})

// Get music metadata
ipcMain.handle('get-music-metadata', async (event, filePath: string[]) => {
  try {
    const songsWithMetadata = await Promise.all(
      filePath
        .filter(file => allowedExtensions.has(path.extname(file).toLowerCase()))
        .map(async (file) => {
          const folderPathParsed = file.replaceAll('\\', '/')
          const fileName = path.basename(file)
          const directoryPath = path.dirname(file)
          const nameFolder = folderPathParsed.split('/')[folderPathParsed.split('/').length - 2]
          const format = path.extname(file)
          try {
            const metadata = await musicMetadata.parseFile(file)

            let duration = 0
            if (metadata.format.duration !== undefined) {
              duration = metadata.format.duration
            }
            const newSong = new Song({
              id: crypto.randomUUID(),
              albumId: '',
              title: fileName,
              directoryPath,
              image: '',
              artists: ['artist'],
              album: nameFolder,
              duration,
              format,
              isDragging: false
            })
            return newSong
          } catch (error) {
            console.error(`Error to read the metadata to file: ${file}`, error)
            return null
          }
        })
    )
    return songsWithMetadata
  } catch (error) {
    console.error('Error to get metada', error)
    throw error
  }
})
