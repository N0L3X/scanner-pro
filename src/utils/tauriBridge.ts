import { invoke } from '@tauri-apps/api';
import type { ScannerSettings } from '../components/ScannerSettings';
import type { ScanResult } from './types';

export async function executeScan(target: string, settings: ScannerSettings): Promise<ScanResult> {
  try {
    const result = await invoke('execute_nmap_scan', {
      target,
      config: {
        scanTypes: settings.nmapFeatures.scanTypes,
        discovery: settings.nmapFeatures.discovery,
        timing: settings.nmapFeatures.timing,
        version: settings.nmapFeatures.version,
        scripts: settings.nmapFeatures.scripts,
        advanced: settings.nmapFeatures.advanced
      }
    });
    return JSON.parse(result as string);
  } catch (error) {
    console.error('Scan failed:', error);
    throw error;
  }
}

export async function quickPortScan(host: string, port: number): Promise<boolean> {
  try {
    return await invoke('scan_port', { host, port });
  } catch (error) {
    console.error('Port scan failed:', error);
    throw error;
  }
}