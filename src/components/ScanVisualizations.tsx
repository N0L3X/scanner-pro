import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { ScanResult, AIAnalysis } from '../utils/types';
import { BarChart3, Network } from 'lucide-react';

Chart.register(...registerables);

interface ScanVisualizationsProps {
  scanResult: ScanResult;
  aiAnalysis: AIAnalysis;
}

export default function ScanVisualizations({ scanResult, aiAnalysis }: ScanVisualizationsProps) {
  const heatmapRef = useRef<HTMLCanvasElement>(null);
  const networkGraphRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (heatmapRef.current) {
      const ctx = heatmapRef.current.getContext('2d');
      if (!ctx) return;

      // Destroy existing chart if it exists
      const existingChart = Chart.getChart(heatmapRef.current);
      if (existingChart) {
        existingChart.destroy();
      }

      // Create risk heatmap
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: scanResult.ports.map(p => `Port ${p.port}`),
          datasets: [{
            label: 'Risk Score',
            data: scanResult.ports.map(p => {
              const isOpen = p.status === 'open';
              const isCritical = aiAnalysis.criticalPorts.includes(p.port);
              return isOpen ? (isCritical ? 1 : 0.5) : 0;
            }),
            backgroundColor: scanResult.ports.map(p => {
              const isOpen = p.status === 'open';
              const isCritical = aiAnalysis.criticalPorts.includes(p.port);
              return isOpen 
                ? (isCritical ? 'rgba(239, 68, 68, 0.8)' : 'rgba(251, 146, 60, 0.8)')
                : 'rgba(75, 85, 99, 0.3)';
            }),
            borderColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Port Risk Heatmap',
              color: 'rgb(255, 255, 255)',
              font: {
                size: 16,
                weight: 'bold'
              }
            },
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 1,
              ticks: {
                color: 'rgb(156, 163, 175)'
              },
              grid: {
                color: 'rgba(75, 85, 99, 0.2)'
              }
            },
            x: {
              ticks: {
                color: 'rgb(156, 163, 175)'
              },
              grid: {
                color: 'rgba(75, 85, 99, 0.2)'
              }
            }
          }
        }
      });
    }

    if (networkGraphRef.current) {
      const ctx = networkGraphRef.current.getContext('2d');
      if (!ctx) return;

      // Destroy existing chart if it exists
      const existingChart = Chart.getChart(networkGraphRef.current);
      if (existingChart) {
        existingChart.destroy();
      }

      // Create network graph
      new Chart(ctx, {
        type: 'bubble',
        data: {
          datasets: [{
            label: 'Network Services',
            data: scanResult.ports
              .filter(p => p.status === 'open' && p.service)
              .map(p => ({
                x: p.port,
                y: aiAnalysis.criticalPorts.includes(p.port) ? 1 : 0.5,
                r: 10
              })),
            backgroundColor: scanResult.ports.map(p => 
              aiAnalysis.criticalPorts.includes(p.port)
                ? 'rgba(239, 68, 68, 0.8)'
                : 'rgba(14, 165, 233, 0.8)'
            )
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Network Service Map',
              color: 'rgb(255, 255, 255)',
              font: {
                size: 16,
                weight: 'bold'
              }
            },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const port = scanResult.ports[context.dataIndex];
                  return [
                    `Port: ${port.port}`,
                    `Service: ${port.service?.name || 'Unknown'}`,
                    `Risk: ${aiAnalysis.criticalPorts.includes(port.port) ? 'Critical' : 'Normal'}`
                  ];
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 1.5,
              ticks: {
                callback: (value: number) => 
                  value === 1 ? 'Critical' : value === 0.5 ? 'Normal' : '',
                color: 'rgb(156, 163, 175)'
              },
              grid: {
                color: 'rgba(75, 85, 99, 0.2)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Port Number',
                color: 'rgb(156, 163, 175)'
              },
              ticks: {
                color: 'rgb(156, 163, 175)'
              },
              grid: {
                color: 'rgba(75, 85, 99, 0.2)'
              }
            }
          }
        }
      });
    }
  }, [scanResult, aiAnalysis]);

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <BarChart3 className="h-6 w-6 text-cyan-500 mr-2" />
          <h2 className="text-xl font-bold text-white">Risk Analysis</h2>
        </div>
        <div className="h-64">
          <canvas ref={heatmapRef} />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Network className="h-6 w-6 text-cyan-500 mr-2" />
          <h2 className="text-xl font-bold text-white">Network Topology</h2>
        </div>
        <div className="h-64">
          <canvas ref={networkGraphRef} />
        </div>
      </div>
    </div>
  );
}