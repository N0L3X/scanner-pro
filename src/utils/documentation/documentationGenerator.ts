import { marked } from 'marked';
import { jsPDF } from 'jspdf';
import { Logger } from '../logger';

export class DocumentationGenerator {
  private static instance: DocumentationGenerator;
  private logger = Logger.getInstance();
  private version: string = '1.0.0';

  private constructor() {}

  static getInstance(): DocumentationGenerator {
    if (!DocumentationGenerator.instance) {
      DocumentationGenerator.instance = new DocumentationGenerator();
    }
    return DocumentationGenerator.instance;
  }

  async generateMarkdown(): Promise<string> {
    try {
      const content = await this.generateBaseContent();
      this.logger.info('Generated Markdown documentation');
      return content;
    } catch (error) {
      this.logger.error('Failed to generate Markdown documentation');
      throw error;
    }
  }

  async generatePDF(): Promise<ArrayBuffer> {
    try {
      const content = await this.generateBaseContent();
      const doc = new jsPDF();
      
      // Convert markdown to HTML-like format for PDF
      const html = marked(content);
      
      // Basic PDF styling and content insertion
      doc.setFontSize(20);
      doc.text('Network Scanner Pro Documentation', 20, 20);
      
      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(html.replace(/<[^>]*>/g, ''), 170);
      doc.text(splitText, 20, 40);

      this.logger.info('Generated PDF documentation');
      return doc.output('arraybuffer');
    } catch (error) {
      this.logger.error('Failed to generate PDF documentation');
      throw error;
    }
  }

  private async generateBaseContent(): Promise<string> {
    return `# Network Scanner Pro Documentation
Version: ${this.version}
Generated: ${new Date().toISOString()}

## Table of Contents
1. Basic Usage
2. Advanced Features
3. Troubleshooting
4. Security Considerations

## 1. Basic Usage
### Starting a Scan
1. Enter target IP or hostname
2. Select scan type (Quick, Full, or Vulnerability)
3. Click "Start Scan"

### Scan Types
- Quick Scan: Basic port scan
- Full Scan: Deep system analysis
- Vulnerability Scan: CVE detection

## 2. Advanced Features
### Custom Port Ranges
- Configure start and end ports
- Set specific port lists
- Exclude ports

### Performance Settings
- Concurrent scans: 10-500
- Timeout configuration
- Power save mode

### Security Features
- Anonymization options
- Anti-detection measures
- DoS protection

## 3. Troubleshooting
### Common Issues
- Connection timeouts
- Permission errors
- Resource limitations

### Solutions
- Check network connectivity
- Verify target accessibility
- Adjust scan parameters

## 4. Security Considerations
### Best Practices
- Use anonymization when needed
- Respect target policies
- Monitor resource usage

### Legal Considerations
- Obtain necessary permissions
- Follow local regulations
- Document scan purposes

## Error Codes
\`\`\`
E001: Connection failed
E002: Invalid target
E003: Timeout
E004: Permission denied
\`\`\`

## Support
For additional support:
- Email: support@scannerapp.com
- Documentation: https://docs.scannerapp.com
- Community Forum: https://community.scannerapp.com
`;
  }
}