import { loadSettings, saveSettings, resetSettings } from "./settings";
import { BotConfig } from "./botConfig";
import { Strings } from "./strings";
import * as Electron from "electron";
import * as path from "path";
import * as url from "url";

// Module to control application life.
const app = Electron.app
// Module to create native browser window.
const BrowserWindow = Electron.BrowserWindow

let tray: Electron.Tray = null
let menu: Electron.Menu = null

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow;

let settings;
const settingsFileName: string = "settings.json";

let locale: string;
let isQuitting: boolean = false;

const isWindowOffScreen = function(windowBounds: Electron.Rectangle): boolean {
  const nearestDisplay = Electron.screen.getDisplayMatching(windowBounds).workArea;
  return (
      windowBounds.x > (nearestDisplay.x + nearestDisplay.width) ||
      (windowBounds.x + windowBounds.width) < nearestDisplay.x ||
      windowBounds.y > (nearestDisplay.y + nearestDisplay.height) ||
      (windowBounds.y + windowBounds.height) < nearestDisplay.y
  );
}

function createWindow () {
  //resetSettings(settingsFileName); //DEBUG
  
  settings = loadSettings(settingsFileName);
  locale = app.getLocale();

  const windowTitle = BotConfig.bot.botName || "Chatbot"
  
  let initPosition: Electron.Rectangle = {
    width: settings.windowState.width || 0,
    height: settings.windowState.height || 0,
    x: settings.windowState.left || 0,
    y: settings.windowState.top || 0,
  }

  if (isWindowOffScreen(initPosition)) {
    let display = Electron.screen.getAllDisplays().find(display => display.id === settings.windowState.displayId);
    display = display || Electron.screen.getDisplayMatching(initPosition);
    initPosition.x = display.workArea.x;
    initPosition.y = display.workArea.y;
  };

  // Create the browser window.
  mainWindow = new BrowserWindow(
    {
      width: settings.windowState.width,
      height: settings.windowState.height, 
      x: initPosition.x, 
      y: initPosition.y,
      title: windowTitle,
      icon: path.join(__dirname, "..", "assets", "icon.ico"),
      show: false
    }
  )

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  if (BotConfig.devMode)
    mainWindow.webContents.openDevTools()

  mainWindow.on("ready-to-show", function() {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on("minimize", function (event: Electron.Event) {
    // what to do when clicked the "minimize" button
  });

  mainWindow.on("close", function(event: Electron.Event) {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.on("resize", () => { saveWindowState(); });
  mainWindow.on("move", () => { saveWindowState(); });

  function saveWindowState() {
    const bounds = mainWindow.getBounds();

    settings.windowState.width = bounds.width;
    settings.windowState.height = bounds.height;
    settings.windowState.left = bounds.x;
    settings.windowState.top = bounds.y;

    saveSettings(settingsFileName, settings);
  }

  // open links in the default web browser instead of new Electron window
  mainWindow.webContents.on("new-window", function(event, url) {
    event.preventDefault();
    Electron.shell.openExternal(url);
  });

  const contextMenu = Electron.Menu.buildFromTemplate([
    { label: Strings(locale).open, click: function() { mainWindow.show(); } },
    { type: "separator" },
    { label: Strings(locale).quit, click: function() {
      isQuitting = true;
      app.quit();
     } }
  ]);
  
  let image = Electron.nativeImage.createFromPath(path.join(__dirname, "..", "assets", 'icon.ico'));
  tray = new Electron.Tray(image);
  
  tray.setToolTip(windowTitle);
  tray.setContextMenu(contextMenu);
  tray.addListener("click", function() {
    mainWindow.show();
  });

  // MacOS
  if (process.platform === "darwin") {
    Electron.Menu.setApplicationMenu(contextMenu)
  }
  else {
    Electron.Menu.setApplicationMenu(null)
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

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
