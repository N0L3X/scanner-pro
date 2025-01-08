export class AntiDetection {
  private static instance: AntiDetection;
  private options: AntiDetectionOptions = {
    randomizeDelay: true,
    fragmentPackets: true,
    rotateUserAgent: true,
    minDelay: 100,
    maxDelay: 500
  };

  private constructor() {}

  static getInstance(): AntiDetection {
    if (!AntiDetection.instance) {
      AntiDetection.instance = new AntiDetection();
    }
    return AntiDetection.instance;
  }

  configure(options: Partial<AntiDetectionOptions>): void {
    this.options = { ...this.options, ...options };
  }

  getRandomDelay(): number {
    if (!this.options.randomizeDelay) return 0;
    return Math.random() * (this.options.maxDelay - this.options.minDelay) + this.options.minDelay;
  }

  async applyEvasionTechniques(scanConfig: any): Promise<any> {
    // Apply anti-detection measures to scan configuration
    return {
      ...scanConfig,
      delay: this.getRandomDelay(),
      fragmentPackets: this.options.fragmentPackets,
      userAgent: this.options.rotateUserAgent ? this.getRandomUserAgent() : undefined
    };
  }

  private getRandomUserAgent(): string {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      'Mozilla/5.0 (X11; Linux x86_64)'
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }
}

interface AntiDetectionOptions {
  randomizeDelay: boolean;
  fragmentPackets: boolean;
  rotateUserAgent: boolean;
  minDelay: number;
  maxDelay: number;
}