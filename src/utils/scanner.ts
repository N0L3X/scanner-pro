import { EventEmitter } from './eventEmitter';
import { Logger } from './logger';
import { NetworkAnonymizer } from './security/anonymizer';
import { AntiDetection } from './security/antiDetection';
import { DosProtection } from './security/dosProtection';
import { executeScan, quickPortScan } from './tauriBridge';
import type { ScannerSettings } from '../components/ScannerSettings';
import type { ScanResult } from './types';

export class NetworkScanner extends EventEmitter {
  private static instance: NetworkScanner | null = null;
  private logger = Logger.getInstance();
  private anonymizer = NetworkAnonymizer.getInstance();
  private antiDetection = AntiDetection.getInstance();
  private dosProtection = DosProtection.getInstance();

  private constructor() {
    super();
  }

  static getInstance(): NetworkScanner {
    if (!NetworkScanner.instance) {
      NetworkScanner.instance = new NetworkScanner();
    }
    return NetworkScanner.instance;
  }

  async scanNetwork(targets: string[], settings: ScannerSettings): Promise<ScanResult[]> {
    try {
      await this.dosProtection.checkScanAllowed();
      const secureSettings = await this.antiDetection.applyEvasionTechniques(settings);

      if (settings.nmapFeatures.advanced.fragmentPackets) {
        await this.anonymizer.enableAnonymization();
      }

      this.dosProtection.startScan();

      // Try Nmap scan first, fallback to JS implementation
      try {
        const results = await Promise.all(
          targets.map(target => executeScan(target, secureSettings))
        );
        return results;
      } catch (nmapError) {
        this.logger.warn('Nmap scan failed, falling back to JS implementation:', nmapError);
        return this.fallbackJsScan(targets, secureSettings);
      }
    } catch (error) {
      this.logger.error('Scan failed:', error);
      throw error;
    } finally {
      this.dosProtection.endScan();
      if (settings.nmapFeatures.advanced.fragmentPackets) {
        await this.anonymizer.disableAnonymization();
      }
    }
  }

  private async fallbackJsScan(targets: string[], settings: ScannerSettings): Promise<ScanResult[]> {
    return Promise.all(
      targets.map(async (target) => {
        const ports = [];
        for (let port = 1; port <= 1024; port++) {
          if (await this.quickScan(target, port)) {
            ports.push({
              port,
              status: 'open',
              service: await this.detectService(target, port)
            });
          }
        }
        return {
          target,
          timestamp: new Date().toISOString(),
          ports
        };
      })
    );
  }

  async quickScan(target: string, port: number): Promise<boolean> {
    try {
      return await quickPortScan(target, port);
    } catch (error) {
      this.logger.error('Quick scan failed:', error);
      return false;
    }
  }

  private async detectService(target: string, port: number): Promise<{ name: string } | null> {
    // Basic service detection based on common ports
    const commonPorts: Record<number, string> = {
      21: 'FTP',
      22: 'SSH',
      23: 'Telnet',
      25: 'SMTP',
      80: 'HTTP',
      443: 'HTTPS',
      3306: 'MySQL',
      5432: 'PostgreSQL'
    };

    return commonPorts[port] ? { name: commonPorts[port] } : null;
  }
}