export class DosProtection {
  private static instance: DosProtection;
  private options = {
    maxConcurrentScans: 100,
    scanInterval: 1000,
    maxPortsPerSecond: 100,
    cooldownPeriod: 5000
  };

  private activeScans = 0;
  private lastScanTime: number = 0;
  private portsScanned = 0;

  private constructor() {}

  static getInstance(): DosProtection {
    if (!DosProtection.instance) {
      DosProtection.instance = new DosProtection();
    }
    return DosProtection.instance;
  }

  configure(options: Partial<typeof DosProtection.prototype.options>): void {
    this.options = { ...this.options, ...options };
  }

  async checkScanAllowed(): Promise<boolean> {
    const now = Date.now();
    
    // Check concurrent scans
    if (this.activeScans >= this.options.maxConcurrentScans) {
      throw new Error('Too many concurrent scans');
    }

    // Check scan interval
    if (now - this.lastScanTime < this.options.scanInterval) {
      throw new Error('Scanning too frequently');
    }

    // Check port rate
    if (this.portsScanned >= this.options.maxPortsPerSecond) {
      await new Promise(resolve => setTimeout(resolve, this.options.cooldownPeriod));
      this.portsScanned = 0;
    }

    return true;
  }

  startScan(): void {
    this.activeScans++;
    this.lastScanTime = Date.now();
  }

  endScan(): void {
    this.activeScans--;
  }

  incrementPortsScanned(count: number): void {
    this.portsScanned += count;
  }
}