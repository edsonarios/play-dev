import { app, BrowserWindow, dialog, globalShortcut, ipcMain, Menu, MenuItem } from 'electron'
import fs from 'node:fs'
import path from 'node:path'
import musicMetadata from 'music-metadata'
import crypto from 'crypto'
import { improveCovers } from './utils'
import { allowedExtensions } from './constants'
import { type ISong } from './entities/song.entity'
import { type ISize } from './entities/size.entity'
import { authenticate, getDatasFromYoutube, getProfile } from './youtube'
import { autoUpdater } from 'electron-updater'
import { getPlaylistFromDirectory } from './features'

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true
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

// Path to save the previous window state
const windowStatePath = path.join(app.getPath('userData'), 'window-state.json')

function createWindow () {
  // Load the previous state to set the window position and size
  let windowState: ISize = {}
  try {
    windowState = JSON.parse(fs.readFileSync(windowStatePath, 'utf-8'))
  } catch (err) {
    windowState = { x: 0, y: 0, width: 800, height: 600 }
  }

  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'icon-played.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    },
    x: windowState.x,
    y: windowState.y
    // x: 1912,
    // y: 16,
    // width: 1898,
    // height: 1026,
  })
  win.maximize()

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date()).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL != null) {
    void win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    void win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
  win.on('close', (_event) => {
    if (win !== null) {
      const { x, y, width, height } = win.getBounds()
      fs.writeFileSync(windowStatePath, JSON.stringify({ x, y, width, height }))
    }
    win = null
    app.quit()
  })
  createMenu()
  // win.webContents.openDevTools()
}

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

  win?.on('enter-full-screen', () => {
    win?.setMenuBarVisibility(false)
  })

  win?.on('leave-full-screen', () => {
    win?.setMenuBarVisibility(true)
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

  // Send the current status to UI
  win?.webContents.send('electron-status-loading', 'loading.loadingSongs')

  let originalDirectoryPath: string
  if (fs.lstatSync(result.filePaths[0]).isDirectory()) {
    originalDirectoryPath = result.filePaths[0]
  } else {
    originalDirectoryPath = path.dirname(result.filePaths[0])
  }
  try {
    const newPlaylist = await getPlaylistFromDirectory(originalDirectoryPath)
    return {
      playlist: newPlaylist
    }
  } catch (err) {
    console.error('Error in read the directory', err)
    return {}
  }
})

// Get Playlists from directories
ipcMain.handle('get-playlist-from-directory', async (_event, filePath: string[]) => {
  const directoriesCleaned: string[] = []
  new Set(filePath.map(file => {
    if (path.extname(file).length === 0) {
      return file
    }
  })).forEach(directory => {
    if (directory !== undefined) {
      directoriesCleaned.push(directory)
    }
  })
  return await Promise.all(directoriesCleaned.map(async (directory) => {
    return await getPlaylistFromDirectory(directory)
  })
  )
})

export async function getMusicMetadata (filesPath: string[]) {
  try {
    const songsWithMetadata = await Promise.all(
      filesPath
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
            const newSong: ISong = {
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
            }
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
}

// Get music metadata
ipcMain.handle('get-music-metadata', async (_event, filePath: string[]) => {
  if (filePath === undefined) return []
  return await getMusicMetadata(filePath)
})

// Get image to cover in playlist
ipcMain.handle('get-image-to-cover', async (_event) => {
  const result = await dialog.showOpenDialog({ properties: ['openFile'] })
  if (result.canceled || result.filePaths.length === 0) return ''
  return 'file://' + result.filePaths[0].replaceAll('\\', '/')
})

// Edit options of the app
function createMenu () {
  const menu = Menu.getApplicationMenu()
  if (menu !== null) {
    menu.items.forEach(item => {
      if (item.label === 'File' && item.submenu !== undefined) {
        item.submenu.insert(0, new MenuItem({
          label: 'Export Configuration',
          click: () => {
            win?.webContents.send('trigger-export-config')
          }
        }))
        item.submenu.insert(1, new MenuItem({
          label: 'Import Configuration',
          click: () => {
            importConfig()
          }
        }))
        item.submenu.insert(2, new MenuItem({ type: 'separator' }))
      }
      if (item.label === 'Help' && item.submenu !== undefined) {
        item.submenu.insert(0, new MenuItem({
          label: 'Check for updates',
          click: () => {
            checkForUpdates()
          }
        }))
      }
    })

    Menu.setApplicationMenu(menu)
  }
}

// Export config from store in a file .json
ipcMain.handle('export-config', async (_event, config) => {
  if (win === null) return
  const response = dialog.showSaveDialogSync(win, {
    title: 'Export Configuration',
    defaultPath: 'MyPlaylist.json',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  })
  if (response !== undefined) {
    fs.writeFileSync(response, config)
    return true
  }
})

// Import config from file .json
function importConfig () {
  const result = dialog.showOpenDialogSync({
    title: 'Import Configuration',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  })
  if (result === undefined || result.length === 0) return
  const config = fs.readFileSync(result[0], { encoding: 'utf-8' })
  win?.webContents.send('trigger-import-config', config)
}

// Import playlists from youtube
ipcMain.handle('import-youtube', async () => {
  try {
    await authenticate()

    // Send the current status to UI
    win?.webContents.send('electron-status-loading', 'loading.loadingPlaylists')

    const profile = await getProfile()
    const playlistsWithSongs = await getDatasFromYoutube()
    const playlistsWithCovers = improveCovers(playlistsWithSongs.playlistsPlayed)
    // fs.writeFileSync('playlistWithSongs.json', JSON.stringify(playlistsWithSongs))
    // fs.writeFileSync('playlistWithCovers.json', JSON.stringify(playlistsWithCovers))
    const data = {
      profile,
      playlists: playlistsWithCovers,
    }
    return data
  } catch (error) {
    console.error('Error to get youtube datas', error)
    throw error
  }
})

// Check for updates
function checkForUpdates () {
  void autoUpdater.checkForUpdates()

  autoUpdater.on('update-available', () => {
    void dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: 'A new version is available. Do you want to update now?',
      buttons: ['Update', 'Later']
    }).then(result => {
      if (result.response === 0) {
        void autoUpdater.downloadUpdate()
      }
    })
  })

  autoUpdater.on('update-not-available', () => {
    void dialog.showMessageBox({
      type: 'info',
      title: 'No Updates',
      message: 'Current version is up-to-date.'
    })
  })

  autoUpdater.on('update-downloaded', () => {
    void dialog.showMessageBox({
      type: 'info',
      title: 'Update Ready',
      message: 'Update downloaded, application will be quit for update...'
    }).then(() => {
      autoUpdater.quitAndInstall()
    })
  })

  autoUpdater.on('download-progress', (progressObj) => {
    win?.webContents.send('update-download-progress', progressObj)
  })
}

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', async (_event, commandLine, _workingDirectory) => {
    if (win !== null) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
    const songsWithMetadata = await extractPathFromArguments(commandLine)
    if (songsWithMetadata !== null) {
      console.log('open-file1', songsWithMetadata)
      win?.webContents.send('open-file', songsWithMetadata)
    }
  })
}

async function extractPathFromArguments (argv: string []) {
  if (argv.length > 2) {
    return await getMusicMetadata(argv.slice(2))
  }
}
