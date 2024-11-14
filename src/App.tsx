import { useState } from "react";
import charge1 from "./assets/charge1.svg";
import charge2 from "./assets/charge2.svg";
import charge3 from "./assets/charge3.svg";
import charge4 from "./assets/charge4.svg";
import charging from "./assets/charging.svg";
import "./App.css";

declare global {
  interface Navigator {
    getBattery(): Promise<BatteryManager>;
  }
}


const CHARGE_OK_COLOR = "#8dff58";
const CHARGE_LOW_COLOR = "#ff3c3c";

function App() {
  const [count, setCount] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [icon, setIcon] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [iconColor, setIconColor] = useState<string>(CHARGE_OK_COLOR);

  navigator.getBattery().then((battery) => {
    function updateBatteryStatus() {
      const batteryLevel = Math.floor(battery.level * 100);
      const isCharging_state = battery.charging;

      let batteryIcon: string | null;
      console.log(battery.level)
      if (isCharging_state) {
        batteryIcon = charging;
      } else {
        batteryIcon =
          batteryLevel > 90
            ? charge4
            : batteryLevel > 70
            ? charge3
            : batteryLevel > 50
            ? charge2
            : charge1;
      }

      if (batteryLevel <= 10 && !isCharging_state) {
        setMessage("Battery is low");
        setIconColor(CHARGE_LOW_COLOR);
        if (typeof window.ipcRenderer !== "undefined") {
          window.ipcRenderer.send("warn-user");
        }
      }

      if (batteryLevel >= 90 && isCharging_state) {
        setMessage("Battery is fully charged");
        setIconColor(CHARGE_OK_COLOR);
        if (typeof window.ipcRenderer !== "undefined") {
          window.ipcRenderer.send("warn-user");
        }
      }

      setIcon(batteryIcon);
      setCount(batteryLevel);
      setIsCharging(isCharging);
    }

    battery.addEventListener("levelchange", updateBatteryStatus);
    battery.addEventListener("chargingchange", updateBatteryStatus);

    updateBatteryStatus();
  });

  return (
    <div
      className="main"
     style={{ backgroundColor: iconColor }}
    >
      {icon && <img src={icon} alt="battery" />}
      <p>{count}%</p>
      <div>
        <span>{message}</span>
      </div>
      <button onClick={() => window.ipcRenderer.send("hide-window")}>
        Hide
      </button>
    </div>
  );
}

export default App;
