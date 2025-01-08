import React from 'react';
import { CloudScanResult } from '../utils/cloudScanner';
import { Shield, AlertTriangle, Server, Cloud } from 'lucide-react';

interface CloudScanResultsProps {
  result: CloudScanResult;
}

export default function CloudScanResults({ result }: CloudScanResultsProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-500 border-red-500 bg-red-500/10';
      case 'high':
        return 'text-orange-500 border-orange-500 bg-orange-500/10';
      case 'medium':
        return 'text-yellow-500 border-yellow-500 bg-yellow-500/10';
      default:
        return 'text-blue-500 border-blue-500 bg-blue-500/10';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center mb-6">
        <Cloud className="h-6 w-6 text-cyan-500 mr-2" />
        <h2 className="text-xl font-bold text-white">
          Cloud Scan Results - {result.provider.toUpperCase()}
        </h2>
      </div>

      <div className="space-y-6">
        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Server className="h-5 w-5 text-cyan-500 mr-2" />
            Discovered Resources
          </h3>
          <div className="grid gap-4">
            {result.resources.map((resource) => (
              <div
                key={resource.id}
                className="bg-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-medium">{resource.name}</h4>
                    <p className="text-gray-400 text-sm">{resource.type}</p>
                  </div>
                  {resource.publicAccess && (
                    <span className="px-2 py-1 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm">
                      Public Access
                    </span>
                  )}
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  <p>Region: {resource.region}</p>
                  <p>ID: {resource.id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Misconfigurations */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-cyan-500 mr-2" />
            Security Issues
          </h3>
          <div className="space-y-4">
            {result.misconfigurations.map((issue, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getSeverityColor(issue.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{issue.description}</h4>
                    <p className="text-sm mt-1 opacity-80">
                      Resource: {issue.resource}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded text-sm capitalize">
                    {issue.severity}
                  </span>
                </div>
                <p className="mt-2 text-sm">
                  <strong>Recommendation:</strong> {issue.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}