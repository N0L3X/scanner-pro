import { ScanResult, AIAnalysis } from './types';
import { jsPDF } from 'jspdf';

export class ReportExporter {
  static exportJSON(scanResult: ScanResult, aiAnalysis: AIAnalysis): string {
    const report = {
      scanResult,
      aiAnalysis,
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0'
      }
    };
    return JSON.stringify(report, null, 2);
  }

  static exportMarkdown(scanResult: ScanResult, aiAnalysis: AIAnalysis): string {
    return `# Network Scan Report
Generated: ${new Date().toLocaleString()}

## Scan Results
Target: ${scanResult.target}
Timestamp: ${scanResult.timestamp}

### Open Ports
${scanResult.ports
  .filter(p => p.status === 'open')
  .map(p => `- Port ${p.port}: ${p.service?.name || 'Unknown'} ${p.service?.version || ''}`)
  .join('\n')}

## AI Analysis
Risk Score: ${(aiAnalysis.riskScore * 100).toFixed(1)}%

### Critical Ports
${aiAnalysis.criticalPorts.map(p => `- Port ${p}`).join('\n')}

### Recommendations
${aiAnalysis.recommendations.map(r => `- ${r}`).join('\n')}

### Suggested Tests
${aiAnalysis.suggestedTests.map(t => `- ${t}`).join('\n')}
`;
  }

  static exportPDF(scanResult: ScanResult, aiAnalysis: AIAnalysis): ArrayBuffer {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Network Scan Report', 20, 20);
    
    // Scan Info
    doc.setFontSize(12);
    doc.text(`Target: ${scanResult.target}`, 20, 40);
    doc.text(`Scan Date: ${new Date(scanResult.timestamp).toLocaleString()}`, 20, 50);
    
    // Open Ports
    doc.setFontSize(16);
    doc.text('Open Ports', 20, 70);
    doc.setFontSize(12);
    let y = 80;
    scanResult.ports
      .filter(p => p.status === 'open')
      .forEach(p => {
        doc.text(`Port ${p.port}: ${p.service?.name || 'Unknown'}`, 30, y);
        y += 10;
      });
    
    // AI Analysis
    doc.setFontSize(16);
    doc.text('AI Analysis', 20, y + 10);
    doc.setFontSize(12);
    doc.text(`Risk Score: ${(aiAnalysis.riskScore * 100).toFixed(1)}%`, 30, y + 20);
    
    // Convert to ArrayBuffer
    return doc.output('arraybuffer');
  }
}