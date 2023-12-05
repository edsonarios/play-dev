import { app, BrowserWindow, dialog, globalShortcut, ipcMain } from 'electron'
import fs from 'node:fs'
import path from 'node:path'
import musicMetadata from 'music-metadata'
import crypto from 'crypto'
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
    width: 1500,
    height: 900,
    x: 1925,
    y: 60,
    alwaysOnTop: true
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
  if (result.canceled || result.filePaths.length === 0) return []

  let directoryPath: string

  if (fs.lstatSync(result.filePaths[0]).isDirectory()) {
    directoryPath = result.filePaths[0]
  } else {
    directoryPath = path.dirname(result.filePaths[0])
  }

  try {
    const files = fs.readdirSync(directoryPath)
    const parseDirectoryPath = directoryPath.replaceAll('\\', '/')

    const songsWithMetadata = await Promise.all(files.map(async (file) => {
      const filePath = path.join(directoryPath, file)
      try {
        const metadata = await musicMetadata.parseFile(filePath)
        return {
          id: crypto.randomUUID(),
          name: file,
          duration: metadata.format.duration
        }
      } catch (error) {
        console.error(`Error to read the metadata to file: ${file}`, error)
        return null
      }
    }))
    return {
      directoryPath: parseDirectoryPath,
      files: songsWithMetadata
    }
  } catch (err) {
    console.error('Error in read the directory', err)
    return {}
  }
})
