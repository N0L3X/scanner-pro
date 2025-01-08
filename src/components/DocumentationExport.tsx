import React, { useState } from 'react';
import { Download, FileText, FileDown, Loader } from 'lucide-react';
import { DocumentationGenerator } from '../utils/documentation/documentationGenerator';

export default function DocumentationExport() {
  const [loading, setLoading] = useState(false);
  const docGen = DocumentationGenerator.getInstance();

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

  const handleMarkdownExport = async () => {
    setLoading(true);
    try {
      const content = await docGen.generateMarkdown();
      downloadFile(content, 'scanner-documentation.md', 'text/markdown');
    } catch (error) {
      console.error('Failed to export markdown:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePDFExport = async () => {
    setLoading(true);
    try {
      const content = await docGen.generatePDF();
      downloadFile(content, 'scanner-documentation.pdf', 'application/pdf');
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Download className="h-6 w-6 text-cyan-500 mr-2" />
        <h2 className="text-xl font-bold text-white">Export Documentation</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleMarkdownExport}
          disabled={loading}
          className="flex items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader className="h-5 w-5 text-cyan-500 animate-spin" />
          ) : (
            <>
              <FileText className="h-5 w-5 text-cyan-500 mr-2" />
              <span className="text-white">Export Markdown</span>
            </>
          )}
        </button>

        <button
          onClick={handlePDFExport}
          disabled={loading}
          className="flex items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader className="h-5 w-5 text-cyan-500 animate-spin" />
          ) : (
            <>
              <FileDown className="h-5 w-5 text-cyan-500 mr-2" />
              <span className="text-white">Export PDF</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}