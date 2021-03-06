const path = require('path')

const { app, BrowserWindow, Menu } = require('electron')
const log = require('electron-log')
const { autoUpdater } = require('electron-updater')

app.setAppUserModelId('xxgjzftd.tool')

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')

let template: any[] = []

let win: any

function sendStatusToWindow (text: string) {
  log.info(text)
  win.webContents.send('message', text)
}

function createDefaultWindow () {
  win = new BrowserWindow()
  win.webContents.openDevTools()
  win.on(
    'closed',
    () => {
      win = null
    }
  )
  win.loadURL(`file://${path.resolve(__dirname, '../src/version.html')}#v${app.getVersion()}`)
  return win
}

autoUpdater.on(
  'checking-for-update',
  () => {
    sendStatusToWindow('Checking for update...')
  }
)

autoUpdater.on(
  'update-available',
  () => {
    sendStatusToWindow('Update available.')
  }
)
autoUpdater.on(
  'update-not-available',
  () => {
    sendStatusToWindow('Update not available.')
    win.loadFile('./src/index.html')
  }
)
autoUpdater.on(
  'error',
  () => {
    sendStatusToWindow('Error in auto-updater.')
  }
)
autoUpdater.on(
  'download-progress',
  () => {
    sendStatusToWindow('Download progress...')
  }
)
autoUpdater.on(
  'update-downloaded',
  () => {
    sendStatusToWindow('Update downloaded; will install in 5 seconds')
  }
)

app.on(
  'ready',
  () => {
    // const menu = Menu.buildFromTemplate(template)
    // Menu.setApplicationMenu(menu)
    createDefaultWindow()
  }
)

app.on(
  'window-all-closed',
  () => {
    app.quit()
  }
)

autoUpdater.on(
  'update-downloaded',
  () => {
    autoUpdater.quitAndInstall()
  }
)

app.on(
  'ready', function () {
    autoUpdater.checkForUpdates()
  }
)
