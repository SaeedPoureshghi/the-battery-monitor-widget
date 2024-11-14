import { app, BrowserWindow, ipcMain, screen } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  const primaryScreen = screen.getPrimaryDisplay();
  const window_width = primaryScreen.workArea.width;
  win = new BrowserWindow({
    title: "Battery Health Monitor",
    type: "desktop",
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    autoHideMenuBar: true,
    fullscreenable: false,
    resizable: false,
    skipTaskbar: true,
    // minimizable: false,
    width: 250,
    height: 250,
    x: window_width - 300,
    y: 50,
    // alwaysOnTop: true,
    // frame: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      devTools: true
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
ipcMain.on("warn-user", () => {
  if (win) {
    win.show();
    win.setOpacity(1);
  }
});
ipcMain.on("hide-window", () => {
  if (win) {
    win.setOpacity(0);
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
