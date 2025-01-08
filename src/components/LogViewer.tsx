import React, { useEffect, useRef } from 'react';

interface LogViewerProps {
  logs: string[];
}

export function LogViewer({ logs }: LogViewerProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
      {logs.map((log, index) => (
        <div
          key={index}
          className={`py-1 ${
            log.includes('ERROR') 
              ? 'text-red-400'
              : log.includes('WARNING')
              ? 'text-yellow-400'
              : 'text-gray-300'
          }`}
        >
          {log}
        </div>
      ))}
      <div ref={logEndRef} />
    </div>
  );
}