import { NetworkScanner } from '../scanner';
import { ExternalAdapter } from './externalAdapter';
import { BatteryManager } from '../system/batteryManager';

export class MobileScanner {
  private static instance: MobileScanner;
  private adapter = ExternalAdapter.getInstance();
  private batteryManager = BatteryManager.getInstance();
  private scanner = NetworkScanner.getInstance();

  private constructor() {}

  static getInstance(): MobileScanner {
    if (!MobileScanner.instance) {
      MobileScanner.instance = new MobileScanner();
    }
    return MobileScanner.instance;
  }

  async initializeMobileScanning(): Promise<void> {
    // Check battery status and optimize settings
    const batteryStatus = await this.batteryManager.getBatteryStatus();
    const powerSaveMode = batteryStatus.level < 0.2 || batteryStatus.charging === false;

    // Configure scanner with power-optimized settings
    this.scanner.configure({
      powerSaveMode,
      useOptimized: true,
      maxConcurrentScans: powerSaveMode ? 10 : 50,
      scanTimeout: powerSaveMode ? 2000 : 1000
    });
  }

  async startPortableScan(config: PortableScanConfig): Promise<void> {
    try {
      // Initialize adapter if specified
      if (config.adapterId) {
        const connected = await this.adapter.connect(config.adapterId);
        if (!connected) {
          throw new Error('Failed to connect to external adapter');
        }
      }

      // Initialize mobile scanning optimizations
      await this.initializeMobileScanning();

      // Start the scan with mobile-optimized settings
      return this.scanner.scanNetwork(config.targets, {
        ...config,
        useOptimized: true,
        powerSaveMode: await this.batteryManager.isPowerSaveMode()
      });
    } catch (error) {
      console.error('Mobile scan failed:', error);
      throw error;
    }
  }
}

interface PortableScanConfig {
  targets: string[];
  adapterId?: string;
  scanType: 'quick' | 'full' | 'vuln';
  timeout?: number;
}