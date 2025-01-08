import { EventEmitter } from '../eventEmitter';

export class ExternalAdapter extends EventEmitter {
  private static instance: ExternalAdapter;
  private connected = false;
  private deviceInfo: DeviceInfo | null = null;

  private constructor() {
    super();
  }

  static getInstance(): ExternalAdapter {
    if (!ExternalAdapter.instance) {
      ExternalAdapter.instance = new ExternalAdapter();
    }
    return ExternalAdapter.instance;
  }

  async detectAdapters(): Promise<DeviceInfo[]> {
    try {
      // Use Web USB API to detect compatible network adapters
      const devices = await navigator.usb.getDevices();
      return devices.map(device => ({
        id: device.serialNumber || '',
        name: device.productName || 'Unknown Device',
        type: this.getAdapterType(device.productId),
        capabilities: this.getCapabilities(device.productId)
      }));
    } catch (error) {
      console.error('Failed to detect adapters:', error);
      return [];
    }
  }

  async connect(deviceId: string): Promise<boolean> {
    try {
      const devices = await this.detectAdapters();
      const device = devices.find(d => d.id === deviceId);
      
      if (device) {
        this.deviceInfo = device;
        this.connected = true;
        this.emit('connected', device);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Connection failed:', error);
      return false;
    }
  }

  private getAdapterType(productId: number): string {
    // Map product IDs to adapter types
    const adapterTypes: Record<number, string> = {
      0x9020: 'USB-Ethernet',
      0x9021: 'WiFi-Adapter',
      0x9022: 'Bluetooth-Adapter'
    };
    return adapterTypes[productId] || 'Unknown';
  }

  private getCapabilities(productId: number): string[] {
    // Map product IDs to capabilities
    const capabilities: Record<number, string[]> = {
      0x9020: ['packet-injection', 'monitor-mode'],
      0x9021: ['wifi-scanning', '5ghz-support'],
      0x9022: ['ble-scanning', 'classic-bluetooth']
    };
    return capabilities[productId] || [];
  }

  isConnected(): boolean {
    return this.connected;
  }

  getDeviceInfo(): DeviceInfo | null {
    return this.deviceInfo;
  }
}

interface DeviceInfo {
  id: string;
  name: string;
  type: string;
  capabilities: string[];
}