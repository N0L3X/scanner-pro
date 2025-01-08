import React, { useState } from 'react';
import { CloudScanner, CloudScanConfig, CloudScanResult } from '../utils/cloudScanner';
import { Cloud, AlertTriangle, Check, Server } from 'lucide-react';

interface CloudScannerFormProps {
  onScanComplete: (result: CloudScanResult) => void;
}

export default function CloudScannerForm({ onScanComplete }: CloudScannerFormProps) {
  const [provider, setProvider] = useState<'aws' | 'azure' | 'gcp'>('aws');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async () => {
    setLoading(true);
    setError('');

    try {
      const scanner = CloudScanner.getInstance();
      const config: CloudScanConfig = {
        provider,
        regions: ['us-east-1', 'us-west-2'], // Example regions
        services: ['compute', 'storage', 'network'] // Example services
      };

      const result = await scanner.scanCloud(config);
      onScanComplete(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan cloud resources');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Cloud className="h-6 w-6 text-cyan-500 mr-2" />
        Cloud Infrastructure Scan
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Cloud Provider
          </label>
          <div className="grid grid-cols-3 gap-4">
            {(['aws', 'azure', 'gcp'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setProvider(p)}
                className={`p-4 rounded-lg border ${
                  provider === p
                    ? 'border-cyan-500 bg-cyan-500/10 text-white'
                    : 'border-gray-600 text-gray-400 hover:border-gray-500'
                } transition-colors uppercase`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <button
          onClick={handleScan}
          disabled={loading}
          className="w-full bg-cyan-500 text-white py-3 px-4 rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          ) : (
            <>
              <Server className="h-5 w-5 mr-2" />
              Scan Cloud Infrastructure
            </>
          )}
        </button>
      </div>
    </div>
  );
}