import { Protocol } from '../types';

export const ModernProtocols: Protocol[] = [
  {
    name: 'QUIC',
    ports: [443, 80],
    description: 'Quick UDP Internet Connections',
    scanFunction: async (host: string, port: number) => {
      // QUIC detection logic
      return {
        protocol: 'QUIC',
        version: 'v1',
        alpn: ['h3']
      };
    }
  },
  {
    name: 'HTTP/3',
    ports: [443],
    description: 'HTTP over QUIC',
    scanFunction: async (host: string, port: number) => {
      // HTTP/3 detection logic
      return {
        protocol: 'HTTP/3',
        version: '1',
        altSvc: true
      };
    }
  }
];