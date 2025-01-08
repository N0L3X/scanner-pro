import { Protocol } from '../types';

export const IoTProtocols: Protocol[] = [
  {
    name: 'MQTT',
    ports: [1883, 8883],
    description: 'Message Queuing Telemetry Transport',
    scanFunction: async (host: string, port: number) => {
      // MQTT connection logic
      return {
        protocol: 'MQTT',
        version: '3.1.1',
        security: port === 8883 ? 'TLS' : 'None'
      };
    }
  },
  {
    name: 'CoAP',
    ports: [5683, 5684],
    description: 'Constrained Application Protocol',
    scanFunction: async (host: string, port: number) => {
      // CoAP detection logic
      return {
        protocol: 'CoAP',
        version: '1.0',
        security: port === 5684 ? 'DTLS' : 'None'
      };
    }
  }
];