import { Protocol } from '../types';

export const IndustrialProtocols: Protocol[] = [
  {
    name: 'Modbus',
    ports: [502],
    description: 'Modbus TCP',
    scanFunction: async (host: string, port: number) => {
      // Modbus detection logic
      return {
        protocol: 'Modbus',
        version: 'TCP',
        mode: 'TCP/IP'
      };
    }
  },
  {
    name: 'DNP3',
    ports: [20000],
    description: 'Distributed Network Protocol',
    scanFunction: async (host: string, port: number) => {
      // DNP3 detection logic
      return {
        protocol: 'DNP3',
        version: '3.0',
        mode: 'TCP/IP'
      };
    }
  },
  {
    name: 'BACnet',
    ports: [47808],
    description: 'Building Automation and Control Networks',
    scanFunction: async (host: string, port: number) => {
      // BACnet detection logic
      return {
        protocol: 'BACnet',
        version: 'IP',
        mode: 'BACnet/IP'
      };
    }
  }
];