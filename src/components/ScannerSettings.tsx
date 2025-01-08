import React, { useState } from 'react';
import { Settings, Shield, Zap, Network, Database, Code, Cpu, Clock, Search, AlertTriangle } from 'lucide-react';

export interface ScannerSettings {
  nmapFeatures: {
    scanTypes: {
      syn: boolean;
      connect: boolean;
      fin: boolean;
      xmas: boolean;
      null: boolean;
      ack: boolean;
      window: boolean;
      maimon: boolean;
      idle: boolean;
      ftp: boolean;
      bounce: boolean;
      udp: boolean;
      sctp: boolean;
      ip: boolean;
    };
    discovery: {
      arpPing: boolean;
      icmpEcho: boolean;
      icmpTimestamp: boolean;
      tcpPing: boolean;
      udpPing: boolean;
      sctpPing: boolean;
      ipProtocol: boolean;
      reverseIdent: boolean;
    };
    timing: {
      template: number;
      minRttTimeout: number;
      maxRttTimeout: number;
      initialRttTimeout: number;
      maxRetries: number;
      hostTimeout: number;
      scanDelay: number;
    };
    version: {
      intensity: number;
      light: boolean;
      allPorts: boolean;
      versionAll: boolean;
      versionTrace: boolean;
    };
    scripts: {
      categories: {
        auth: boolean;
        broadcast: boolean;
        brute: boolean;
        default: boolean;
        discovery: boolean;
        dos: boolean;
        exploit: boolean;
        external: boolean;
        fuzzer: boolean;
        intrusive: boolean;
        malware: boolean;
        safe: boolean;
        version: boolean;
        vuln: boolean;
      };
      scriptArgs: Record<string, string>;
      scriptTimeout: number;
      scriptTrace: boolean;
    };
    advanced: {
      fragmentPackets: boolean;
      fragmentSize: number;
      decoys: string[];
      sourcePort: number;
      dataLength: number;
      ipTtl: number;
      spoofMac: string;
      badsum: boolean;
      randomize: boolean;
    };
  };
}

export default function ScannerSettings({ onSettingsChange }: { onSettingsChange: (settings: ScannerSettings) => void }) {
  const [settings, setSettings] = useState<ScannerSettings>({
    nmapFeatures: {
      scanTypes: {
        syn: true,
        connect: false,
        fin: false,
        xmas: false,
        null: false,
        ack: false,
        window: false,
        maimon: false,
        idle: false,
        ftp: false,
        bounce: false,
        udp: false,
        sctp: false,
        ip: false
      },
      discovery: {
        arpPing: true,
        icmpEcho: true,
        icmpTimestamp: false,
        tcpPing: true,
        udpPing: false,
        sctpPing: false,
        ipProtocol: false,
        reverseIdent: false
      },
      timing: {
        template: 3,
        minRttTimeout: 100,
        maxRttTimeout: 1000,
        initialRttTimeout: 500,
        maxRetries: 3,
        hostTimeout: 30000,
        scanDelay: 0
      },
      version: {
        intensity: 7,
        light: false,
        allPorts: false,
        versionAll: false,
        versionTrace: false
      },
      scripts: {
        categories: {
          auth: false,
          broadcast: false,
          brute: false,
          default: true,
          discovery: true,
          dos: false,
          exploit: false,
          external: false,
          fuzzer: false,
          intrusive: false,
          malware: false,
          safe: true,
          version: true,
          vuln: true
        },
        scriptArgs: {},
        scriptTimeout: 30000,
        scriptTrace: false
      },
      advanced: {
        fragmentPackets: false,
        fragmentSize: 8,
        decoys: [],
        sourcePort: 0,
        dataLength: 0,
        ipTtl: 64,
        spoofMac: '',
        badsum: false,
        randomize: true
      }
    }
  });

  const handleChange = (section: keyof ScannerSettings['nmapFeatures'], key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      nmapFeatures: {
        ...prev.nmapFeatures,
        [section]: {
          ...prev.nmapFeatures[section],
          [key]: value
        }
      }
    }));
    onSettingsChange(settings);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-8">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center">
        <Settings className="h-6 w-6 text-cyan-500 mr-2" />
        Advanced Scanner Settings
      </h2>

      {/* Scan Types */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Network className="h-5 w-5 text-cyan-500 mr-2" />
          Scan Types
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(settings.nmapFeatures.scanTypes).map(([key, value]) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleChange('scanTypes', key, e.target.checked)}
                className="form-checkbox text-cyan-500"
              />
              <span className="text-gray-300 capitalize">{key} Scan</span>
            </label>
          ))}
        </div>
      </div>

      {/* Host Discovery */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Search className="h-5 w-5 text-cyan-500 mr-2" />
          Host Discovery
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(settings.nmapFeatures.discovery).map(([key, value]) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleChange('discovery', key, e.target.checked)}
                className="form-checkbox text-cyan-500"
              />
              <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Timing Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Clock className="h-5 w-5 text-cyan-500 mr-2" />
          Timing Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2">Timing Template (T0-T5)</label>
            <input
              type="range"
              min="0"
              max="5"
              value={settings.nmapFeatures.timing.template}
              onChange={(e) => handleChange('timing', 'template', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-gray-400 text-sm">
              <span>Paranoid</span>
              <span>Insane</span>
            </div>
          </div>
          {Object.entries(settings.nmapFeatures.timing)
            .filter(([key]) => key !== 'template')
            .map(([key, value]) => (
              <div key={key}>
                <label className="block text-gray-300 mb-2 capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => handleChange('timing', key, parseInt(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
            ))}
        </div>
      </div>

      {/* Version Detection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Database className="h-5 w-5 text-cyan-500 mr-2" />
          Version Detection
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2">Version Intensity (0-9)</label>
            <input
              type="range"
              min="0"
              max="9"
              value={settings.nmapFeatures.version.intensity}
              onChange={(e) => handleChange('version', 'intensity', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          {Object.entries(settings.nmapFeatures.version)
            .filter(([key]) => key !== 'intensity')
            .map(([key, value]) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleChange('version', key, e.target.checked)}
                  className="form-checkbox text-cyan-500"
                />
                <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              </label>
            ))}
        </div>
      </div>

      {/* NSE Scripts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Code className="h-5 w-5 text-cyan-500 mr-2" />
          NSE Scripts
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(settings.nmapFeatures.scripts.categories).map(([key, value]) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleChange('scripts', `categories.${key}`, e.target.checked)}
                className="form-checkbox text-cyan-500"
              />
              <span className="text-gray-300 capitalize">{key}</span>
            </label>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-gray-300 mb-2">Script Timeout (ms)</label>
            <input
              type="number"
              value={settings.nmapFeatures.scripts.scriptTimeout}
              onChange={(e) => handleChange('scripts', 'scriptTimeout', parseInt(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            />
          </div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.nmapFeatures.scripts.scriptTrace}
              onChange={(e) => handleChange('scripts', 'scriptTrace', e.target.checked)}
              className="form-checkbox text-cyan-500"
            />
            <span className="text-gray-300">Enable Script Tracing</span>
          </label>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <AlertTriangle className="h-5 w-5 text-cyan-500 mr-2" />
          Advanced Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.nmapFeatures.advanced.fragmentPackets}
                onChange={(e) => handleChange('advanced', 'fragmentPackets', e.target.checked)}
                className="form-checkbox text-cyan-500"
              />
              <span className="text-gray-300">Fragment Packets</span>
            </label>
            {settings.nmapFeatures.advanced.fragmentPackets && (
              <input
                type="number"
                value={settings.nmapFeatures.advanced.fragmentSize}
                onChange={(e) => handleChange('advanced', 'fragmentSize', parseInt(e.target.value))}
                className="mt-2 w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                placeholder="Fragment Size"
              />
            )}
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Source Port</label>
            <input
              type="number"
              value={settings.nmapFeatures.advanced.sourcePort}
              onChange={(e) => handleChange('advanced', 'sourcePort', parseInt(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">IP TTL</label>
            <input
              type="number"
              value={settings.nmapFeatures.advanced.ipTtl}
              onChange={(e) => handleChange('advanced', 'ipTtl', parseInt(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Spoof MAC Address</label>
            <input
              type="text"
              value={settings.nmapFeatures.advanced.spoofMac}
              onChange={(e) => handleChange('advanced', 'spoofMac', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              placeholder="00:11:22:33:44:55"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-300 mb-2">Decoy IPs (comma-separated)</label>
            <input
              type="text"
              value={settings.nmapFeatures.advanced.decoys.join(',')}
              onChange={(e) => handleChange('advanced', 'decoys', e.target.value.split(','))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              placeholder="10.0.0.1,10.0.0.2,10.0.0.3"
            />
          </div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.nmapFeatures.advanced.badsum}
              onChange={(e) => handleChange('advanced', 'badsum', e.target.checked)}
              className="form-checkbox text-cyan-500"
            />
            <span className="text-gray-300">Use Bad Checksums</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.nmapFeatures.advanced.randomize}
              onChange={(e) => handleChange('advanced', 'randomize', e.target.checked)}
              className="form-checkbox text-cyan-500"
            />
            <span className="text-gray-300">Randomize Target Order</span>
          </label>
        </div>
      </div>
    </div>
  );
}