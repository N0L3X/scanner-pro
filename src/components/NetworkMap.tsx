import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';

interface NetworkMapProps {
  scanResults?: any;
}

export function NetworkMap({ scanResults }: NetworkMapProps) {
  const networkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!networkRef.current) return;

    const nodes = new DataSet([
      { id: 1, label: 'Scanner', group: 'scanner' },
      { id: 2, label: '192.168.1.1', group: 'target' },
      { id: 3, label: 'Port 80', group: 'port' },
      { id: 4, label: 'Port 443', group: 'port' }
    ]);

    const edges = new DataSet([
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 2, to: 4 }
    ]);

    const data = { nodes, edges };

    const options = {
      nodes: {
        shape: 'dot',
        size: 16,
        font: {
          color: '#ffffff'
        },
        groups: {
          scanner: {
            color: { background: '#00B4D8', border: '#00B4D8' }
          },
          target: {
            color: { background: '#4CC9F0', border: '#4CC9F0' }
          },
          port: {
            color: { background: '#7209B7', border: '#7209B7' }
          }
        }
      },
      edges: {
        color: { color: '#4A5568', highlight: '#00B4D8' },
        width: 2
      },
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -2000,
          centralGravity: 0.3,
          springLength: 95,
          springConstant: 0.04,
          damping: 0.09
        }
      }
    };

    const network = new Network(networkRef.current, data, options);

    return () => {
      network.destroy();
    };
  }, [scanResults]);

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div ref={networkRef} className="h-[600px]" />
    </div>
  );
}