export interface ScanResult {
  target: string;
  timestamp: string;
  ports: PortInfo[];
  services: ServiceInfo[];
  vulnerabilities?: Vulnerability[];
  riskScore?: number;
}

export interface PortInfo {
  port: number;
  status: 'open' | 'closed' | 'filtered';
  service?: ServiceInfo;
}

export interface ServiceInfo {
  name: string;
  version?: string;
  banner?: string;
  knownVulnerabilities?: boolean;
}

export interface Vulnerability {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  cvss: number;
  references: string[];
  published: string;
}

export interface AIAnalysis {
  riskScore: number;
  recommendations: string[];
  criticalPorts: number[];
  suggestedTests: string[];
  vulnerabilities: {
    total: number;
    bySeverity: Record<string, number>;
    averageCVSS: number;
  };
  behaviorAnalysis?: {
    suspiciousPatterns: string[];
    riskLevel: string;
    details: Record<string, any>;
  };
  anomalies?: Array<{
    port: number;
    description: string;
    confidence: number;
    recommendation: string;
  }>;
}

export interface Protocol {
  name: string;
  ports: number[];
  description: string;
  scanFunction: (host: string, port: number) => Promise<any>;
}

export interface Plugin {
  id: string;
  name: string;
  version: string;
  author: string;
  description?: string;
  execute: (context: any) => Promise<void>;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
}

export interface TutorialStep {
  title: string;
  content: string;
  element: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'digital' | 'physical';
  subCategory: string;
  image: string;
  rating: number;
  reviews: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}