import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Search, AlertCircle, CheckCircle, Brain, HelpCircle } from 'lucide-react';
import { AIAnalyzer, type AIAnalysis } from '../utils/aiAnalyzer';
import ResponsiveContainer from '../components/ResponsiveContainer';
import ScannerSettings from '../components/ScannerSettings';
import type { ScannerSettings as ScannerSettingsType } from '../components/ScannerSettings';
import TutorialOverlay from '../components/TutorialOverlay';
import ExportOptions from '../components/ExportOptions';
import { Logger } from '../utils/logger';

type ScanType = 'quick' | 'full' | 'vuln';
type ScanResult = any; // Replace with actual type when available

export default function NetworkScanner() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [targetIP, setTargetIP] = useState('');
  const [scanType, setScanType] = useState<ScanType>('quick');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [ipError, setIpError] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const aiAnalyzer = useMemo(() => new AIAnalyzer(), []);
  const logger = useMemo(() => Logger.getInstance(), []);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    const logHandler = (log: string) => {
      setLogs(prevLogs => [...prevLogs, log]);
    };
    logger.on('log', logHandler);
    return () => logger.off('log', logHandler);
  }, [logger]);

  const validateIP = (ip: string): boolean => {
    if (!ip.trim()) {
      setIpError('IP address is required');
      return false;
    }
    const IP_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^localhost$|^(?=.{1,253}\.?$)(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.?)+[A-Za-z]{2,6}$/;
    if (!IP_REGEX.test(ip)) {
      setIpError('Invalid IP address or hostname format');
      return false;
    }
    setIpError('');
    return true;
  };

  const startScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setAiAnalysis(null);
    setScanResult(null);

    if (!user) {
      setError('Please login to use the scanner');
      return;
    }

    if (!validateIP(targetIP)) {
      return;
    }

    setLoading(true);
    logger.info(`Starting ${scanType} scan on ${targetIP}`);

    try {
      // Perform scan using Electron IPC
      const result = await window.electron.scanTarget({
        host: targetIP.trim(),
        scanType
      });

      setScanResult(result);
      logger.info('Scan completed successfully');

      // Perform AI analysis
      const analysis = await aiAnalyzer.analyzeScan(result);
      setAiAnalysis(analysis);
      logger.info('AI analysis completed');

      setSuccess(true);
      setTargetIP('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start scan';
      logger.error(`Scan error: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = (settings: ScannerSettingsType) => {
    logger.info('Scanner settings updated');
    // Implement settings change logic
  };

  const handleBugReport = () => {
    const report = {
      scanResult,
      aiAnalysis,
      logs,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
    
    logger.info('Bug report generated');
    console.log('Bug report:', report);
    alert('Bug report submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-900 py-6 sm:py-12">
      <ResponsiveContainer>
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-cyan-500 mx-auto mb-4" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">Network Scanner Pro</h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Professional-grade network vulnerability scanner with AI-powered analysis
            </p>
          </div>

          {/* Main Scanner Form */}
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-xl">
            <form onSubmit={startScan} className="space-y-4 sm:space-y-6">
              {/* Error and Success Messages */}
              {error && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 sm:p-4 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-red-500 text-sm sm:text-base">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500 rounded-lg p-3 sm:p-4 flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-green-500 text-sm sm:text-base">Scan completed successfully</p>
                </div>
              )}

              {/* Target Input */}
              <div>
                <label htmlFor="target" className="block text-sm font-medium text-gray-300 mb-2">
                  Target IP or Hostname
                </label>
                <input
                  type="text"
                  id="target"
                  value={targetIP}
                  onChange={(e) => setTargetIP(e.target.value)}
                  className={`w-full bg-gray-700 border ${
                    ipError ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base`}
                  placeholder="192.168.1.1"
                  required
                />
                {ipError && (
                  <p className="mt-1 text-sm text-red-500">{ipError}</p>
                )}
              </div>

              {/* Scan Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Scan Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                  {['quick', 'full', 'vuln'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setScanType(type as ScanType)}
                      className={`p-3 sm:p-4 rounded-lg border ${
                        scanType === type
                          ? 'border-cyan-500 bg-cyan-500/10 text-white'
                          : 'border-gray-600 text-gray-400 hover:border-gray-500'
                      } transition-colors text-sm sm:text-base`}
                    >
                      <h3 className="font-medium mb-1 capitalize">{type} Scan</h3>
                      <p className="text-xs opacity-75">
                        {type === 'quick' ? 'Basic port scan' :
                         type === 'full' ? 'Deep system analysis' :
                         'CVE detection'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Scan Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Start Scan
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Section */}
          {scanResult && aiAnalysis && (
            <div className="mt-6 sm:mt-8">
              <ExportOptions scanResult={scanResult} aiAnalysis={aiAnalysis} logs={logs} />
            </div>
          )}

          {/* Floating Action Buttons */}
          <div className="fixed bottom-4 left-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={handleBugReport}
              className="bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center text-sm sm:text-base"
            >
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Report Bug
            </button>
          </div>

          {/* Tutorial Button */}
          <button
            onClick={() => setShowTutorial(true)}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center text-sm sm:text-base"
          >
            <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Show Tutorial
          </button>

          {/* Settings and Tutorial Components */}
          <ScannerSettings onSettingsChange={handleSettingsChange} />
          {showTutorial && <TutorialOverlay />}
        </div>
      </ResponsiveContainer>
    </div>
  );
}