import { CloudProvider, CloudScanConfig, CloudScanResult } from '../types';
import { Logger } from '../logger';

export class CloudScanner {
  private static instance: CloudScanner;
  private logger = Logger.getInstance();
  private credentials: Map<CloudProvider, any> = new Map();

  private constructor() {}

  static getInstance(): CloudScanner {
    if (!CloudScanner.instance) {
      CloudScanner.instance = new CloudScanner();
    }
    return CloudScanner.instance;
  }

  setCredentials(provider: CloudProvider, credentials: any): void {
    this.validateCredentials(provider, credentials);
    this.credentials.set(provider, credentials);
  }

  private validateCredentials(provider: CloudProvider, credentials: any): void {
    switch (provider) {
      case 'aws':
        if (!credentials.accessKeyId || !credentials.secretAccessKey) {
          throw new Error('AWS credentials must include accessKeyId and secretAccessKey');
        }
        break;
      case 'azure':
        if (!credentials.tenantId || !credentials.clientId || !credentials.clientSecret) {
          throw new Error('Azure credentials must include tenantId, clientId, and clientSecret');
        }
        break;
      case 'gcp':
        if (!credentials.serviceAccountKey) {
          throw new Error('GCP credentials must include serviceAccountKey');
        }
        break;
    }
  }

  async scanCloud(config: CloudScanConfig): Promise<CloudScanResult> {
    const credentials = this.credentials.get(config.provider);
    if (!credentials) {
      throw new Error(`No credentials set for ${config.provider}`);
    }

    this.logger.info(`Starting cloud scan for ${config.provider}`);

    try {
      // Execute cloud scan through Electron IPC
      const result = await window.electron.scanCloud({
        provider: config.provider,
        credentials,
        config
      });

      this.logger.info(`Cloud scan completed for ${config.provider}`);
      return result;
    } catch (error) {
      this.logger.error(`Cloud scan failed for ${config.provider}: ${error}`);
      throw error;
    }
  }
}