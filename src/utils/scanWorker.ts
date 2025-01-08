import { parentPort, workerData } from 'worker_threads';
import { createConnection } from 'net';

const { targets, options } = workerData;

async function scanPort(host: string, port: number, timeout: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = createConnection(port, host);
    socket.setTimeout(timeout);

    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
  });
}

async function scanTarget(target: string, options: any) {
  const portRanges = options.portRanges || [[1, 1024]];
  const timeout = options.timeout || 1000;
  const results = [];

  for (const [start, end] of portRanges) {
    const ports = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    const batchSize = 100;
    
    for (let i = 0; i < ports.length; i += batchSize) {
      const batch = ports.slice(i, i + batchSize);
      const scanPromises = batch.map(port => 
        scanPort(target, port, timeout)
          .then(isOpen => ({ port, isOpen }))
      );
      
      const batchResults = await Promise.all(scanPromises);
      results.push(...batchResults.filter(r => r.isOpen));
    }
  }

  return {
    target,
    timestamp: new Date().toISOString(),
    ports: results
  };
}

async function processTargets() {
  try {
    const results = await Promise.all(
      targets.map(target => scanTarget(target, options))
    );
    parentPort?.postMessage(results);
  } catch (error) {
    parentPort?.postMessage({ error: error.message });
  }
}

processTargets();