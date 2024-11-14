interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  onchargingchange: EventListener;
  onchargingtimechange: EventListener;
  ondischargingtimechange: EventListener;
  onlevelchange: EventListener;
}
