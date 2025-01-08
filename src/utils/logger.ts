import { EventEmitter } from './eventEmitter';

export class Logger extends EventEmitter {
  private static instance: Logger;
  private logs: string[] = [];
  private maxLogs = 1000;

  private constructor() {
    super();
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(message: string, level: 'INFO' | 'WARNING' | 'ERROR' = 'INFO'): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${level}: ${message}`;
    
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    
    this.emit('log', logEntry);
  }

  info(message: string): void {
    this.log(message, 'INFO');
  }

  warn(message: string): void {
    this.log(message, 'WARNING');
  }

  error(message: string): void {
    this.log(message, 'ERROR');
  }

  getLogs(): string[] {
    return [...this.logs];
  }

  clear(): void {
    this.logs = [];
    this.emit('clear');
  }
}