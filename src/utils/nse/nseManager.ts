import { EventEmitter } from '../eventEmitter';
import { Logger } from '../logger';

export interface NSEScript {
  id: string;
  name: string;
  category: string;
  description: string;
  args?: NSEArgument[];
}

interface NSEArgument {
  name: string;
  type: 'string' | 'number' | 'boolean';
  description: string;
  default?: any;
}

export class NSEManager extends EventEmitter {
  private static instance: NSEManager;
  private logger = Logger.getInstance();
  private loadedScripts: Map<string, NSEScript> = new Map();

  private constructor() {
    super();
    this.loadDefaultScripts();
  }

  static getInstance(): NSEManager {
    if (!NSEManager.instance) {
      NSEManager.instance = new NSEManager();
    }
    return NSEManager.instance;
  }

  private loadDefaultScripts(): void {
    const defaultScripts: NSEScript[] = [
      {
        id: 'http-enum',
        name: 'HTTP Enumeration',
        category: 'discovery',
        description: 'Enumerates common web paths and applications',
        args: [
          {
            name: 'userdir',
            type: 'boolean',
            description: 'Look for user directories',
            default: true
          }
        ]
      },
      {
        id: 'ssl-enum-ciphers',
        name: 'SSL/TLS Cipher Enumeration',
        category: 'vuln',
        description: 'Tests SSL/TLS cipher suites and security'
      },
      {
        id: 'smb-os-discovery',
        name: 'SMB OS Discovery',
        category: 'discovery',
        description: 'Attempts to determine OS through SMB'
      }
    ];

    defaultScripts.forEach(script => {
      this.loadedScripts.set(script.id, script);
    });
  }

  getScripts(): NSEScript[] {
    return Array.from(this.loadedScripts.values());
  }

  getScriptsByCategory(category: string): NSEScript[] {
    return this.getScripts().filter(script => script.category === category);
  }

  async runScript(scriptId: string, target: string, args?: Record<string, any>): Promise<any> {
    const script = this.loadedScripts.get(scriptId);
    if (!script) {
      throw new Error(`Script ${scriptId} not found`);
    }

    this.logger.info(`Running NSE script: ${script.name}`);
    
    // Execute script through Electron IPC
    try {
      const result = await window.electron.runNSEScript({
        scriptId,
        target,
        args
      });
      
      this.logger.info(`Script ${script.name} completed successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Script ${script.name} failed: ${error}`);
      throw error;
    }
  }
}