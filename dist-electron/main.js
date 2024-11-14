import { app as n, BrowserWindow as t, ipcMain as r, screen as p } from "electron";
import { fileURLToPath as d } from "node:url";
import o from "node:path";
const s = o.dirname(d(import.meta.url));
process.env.APP_ROOT = o.join(s, "..");
const i = process.env.VITE_DEV_SERVER_URL, R = o.join(process.env.APP_ROOT, "dist-electron"), a = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = i ? o.join(process.env.APP_ROOT, "public") : a;
let e;
function l() {
  const c = p.getPrimaryDisplay().workArea.width;
  e = new t({
    title: "Battery Health Monitor",
    type: "desktop",
    icon: o.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    autoHideMenuBar: !0,
    fullscreenable: !1,
    resizable: !1,
    skipTaskbar: !0,
    // minimizable: false,
    width: 250,
    height: 250,
    x: c - 300,
    y: 50,
    // alwaysOnTop: true,
    // frame: false,
    frame: !1,
    webPreferences: {
      preload: o.join(s, "preload.mjs"),
      devTools: !0
    }
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), i ? e.loadURL(i) : e.loadFile(o.join(a, "index.html"));
}
n.on("window-all-closed", () => {
  process.platform !== "darwin" && (n.quit(), e = null);
});
n.on("activate", () => {
  t.getAllWindows().length === 0 && l();
});
r.on("warn-user", () => {
  e && (e.show(), e.setOpacity(1));
});
r.on("hide-window", () => {
  e && e.setOpacity(0);
});
n.whenReady().then(l);
export {
  R as MAIN_DIST,
  a as RENDERER_DIST,
  i as VITE_DEV_SERVER_URL
};
