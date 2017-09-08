const Promise = require('bluebird');
const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const nativeImage = require('electron').nativeImage
const range = require("range");


const path = require('path')
const url = require('url')

const sharp = require('sharp');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
const changeColor = (r) => {
  const roundedCorners = new Buffer(
    `<svg><rect x="0" y="0" width="200" height="200" rx="50" ry="50" fill="rgb(${r}, ${256-r}, ${256-r})"/></svg>`
  );
  const icon = sharp(roundedCorners);
  icon.toBuffer().then(data => {
    const ni = nativeImage.createFromBuffer(data)
    app.dock.setIcon(ni);
  })
}

const getBuffer = (r) => {
  const roundedCorners = new Buffer(
    `<svg><rect x="0" y="0" width="200" height="200" rx="50" ry="50" fill="rgb(${r}, ${256 - r}, ${256 - r})"/></svg>`
  );
  const icon = sharp(roundedCorners);
  return icon.toBuffer();
}

Promise.map(range.range(0, 255), getBuffer).then(buffers => {
  let i = 0;
  setInterval(() => {
    const ni = nativeImage.createFromBuffer(buffers[i])
    app.dock.setIcon(ni);

    if (i < 255) { i++ } else { i = 0 };
  }, 33)
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
