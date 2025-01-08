import React, { useState } from 'react';
import { Download, FileJson, FileText, FileDown, AlertCircle, Activity } from 'lucide-react';
import { ScanResult, AIAnalysis } from '../utils/types';
import { ReportExporter } from '../utils/exporters';
import { LogViewer } from './LogViewer';

interface ExportOptionsProps {
  scanResult: ScanResult;
  aiAnalysis: AIAnalysis;
  logs?: string[];
}

export default function ExportOptions({ scanResult, aiAnalysis, logs = [] }: ExportOptionsProps) {
  const [showLogs, setShowLogs] = useState(false);

  const downloadFile = (content: string | ArrayBuffer, filename: string, type: string) => {
    const blob = content instanceof ArrayBuffer 
      ? new Blob([content], { type })
      : new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const json = ReportExporter.exportJSON(scanResult, aiAnalysis);
    downloadFile(json, 'scan-report.json', 'application/json');
  };

  const handleExportMarkdown = () => {
    const md = ReportExporter.exportMarkdown(scanResult, aiAnalysis);
    downloadFile(md, 'scan-report.md', 'text/markdown');
  };

  const handleExportPDF = () => {
    const pdf = ReportExporter.exportPDF(scanResult, aiAnalysis);
    downloadFile(pdf, 'scan-report.pdf', 'application/pdf');
  };

  const handleBugReport = () => {
    const report = {
      scanResult,
      aiAnalysis,
      logs,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
    
    // In a real app, this would send to a server
    console.log('Bug report:', report);
    alert('Bug report submitted successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Download className="h-6 w-6 text-cyan-500 mr-2" />
          <h2 className="text-xl font-bold text-white">Export Report</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={handleExportJSON}
            className="flex items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <FileJson className="h-5 w-5 text-cyan-500 mr-2" />
            <span className="text-white">JSON</span>
          </button>
          
          <button
            onClick={handleExportMarkdown}
            className="flex items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <FileText className="h-5 w-5 text-cyan-500 mr-2" />
            <span className="text-white">Markdown</span>
          </button>
          
          <button
            onClick={handleExportPDF}
            className="flex items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <FileDown className="h-5 w-5 text-cyan-500 mr-2" />
            <span className="text-white">PDF</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Activity className="h-6 w-6 text-cyan-500 mr-2" />
            <h2 className="text-xl font-bold text-white">Live Logs</h2>
          </div>
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="text-cyan-500 hover:text-cyan-400"
          >
            {showLogs ? 'Hide' : 'Show'} Logs
          </button>
        </div>

        {showLogs && <LogViewer logs={logs} />}
      </div>

      <button
        onClick={handleBugReport}
        className="flex items-center justify-center w-full p-4 bg-red-500/10 border border-red-500 rounded-lg hover:bg-red-500/20 transition-colors text-red-500"
      >
        <AlertCircle className="h-5 w-5 mr-2" />
        Report Issue
      </button>
    </div>
  );
}