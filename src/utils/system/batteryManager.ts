export class BatteryManager {
  private static instance: BatteryManager;
  private battery: any = null;

  private constructor() {
    this.initBattery();
  }

  static getInstance(): BatteryManager {
    if (!BatteryManager.instance) {
      BatteryManager.instance = new BatteryManager();
    }
    return BatteryManager.instance;
  }

  private async initBattery(): Promise<void> {
    try {
      // @ts-ignore: navigator.getBattery() is not in TypeScript types
      this.battery = await navigator.getBattery();
    } catch (error) {
      console.warn('Battery API not supported:', error);
    }
  }

  async getBatteryStatus(): Promise<BatteryStatus> {
    if (!this.battery) {
      await this.initBattery();
    }

    return {
      level: this.battery?.level ?? 1,
      charging: this.battery?.charging ?? true,
      chargingTime: this.battery?.chargingTime ?? 0,
      dischargingTime: this.battery?.dischargingTime ?? 0
    };
  }

  async isPowerSaveMode(): Promise<boolean> {
    const status = await this.getBatteryStatus();
    return status.level < 0.2 || !status.charging;
  }
}

interface BatteryStatus {
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
}