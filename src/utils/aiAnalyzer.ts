import * as tf from '@tensorflow/tfjs';
import { VulnerabilityDB } from './vulnerabilityDB';
import { Logger } from './logger';
import type { ScanResult, AIAnalysis } from './types';

export class AIAnalyzer {
  private static instance: AIAnalyzer;
  private vulnDB: VulnerabilityDB;
  private logger: Logger;
  private models: Map<string, tf.LayersModel>;
  private initialized: boolean = false;

  private constructor() {
    this.vulnDB = VulnerabilityDB.getInstance();
    this.logger = Logger.getInstance();
    this.models = new Map();
  }

  static getInstance(): AIAnalyzer {
    if (!AIAnalyzer.instance) {
      AIAnalyzer.instance = new AIAnalyzer();
    }
    return AIAnalyzer.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Load pre-trained models
      await Promise.all([
        this.loadModel('riskAssessment'),
        this.loadModel('behaviorAnalysis'),
        this.loadModel('anomalyDetection')
      ]);

      this.initialized = true;
      this.logger.info('AI models initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize AI models:', error);
      throw error;
    }
  }

  private async loadModel(modelName: string): Promise<void> {
    try {
      const model = await tf.loadLayersModel(`models/${modelName}/model.json`);
      this.models.set(modelName, model);
    } catch (error) {
      this.logger.error(`Failed to load model ${modelName}:`, error);
      throw error;
    }
  }

  async analyzeScan(scanResult: ScanResult): Promise<AIAnalysis> {
    await this.initialize();

    try {
      // Prepare input data
      const inputTensor = this.preprocessScanData(scanResult);

      // Run ensemble analysis
      const [riskScore, behaviorAnalysis, anomalies] = await Promise.all([
        this.calculateRiskScore(inputTensor),
        this.analyzeBehavior(inputTensor),
        this.detectAnomalies(inputTensor)
      ]);

      // Get vulnerabilities and statistics
      const vulnerabilities = await this.analyzeVulnerabilities(scanResult);
      const vulnStats = await this.vulnDB.getVulnerabilityStats(vulnerabilities);

      // Generate comprehensive recommendations
      const recommendations = this.generateRecommendations(
        scanResult,
        vulnStats,
        behaviorAnalysis,
        anomalies
      );

      // Generate suggested tests
      const suggestedTests = await this.generateSuggestedTests(
        scanResult,
        vulnStats,
        behaviorAnalysis
      );

      // Identify critical ports
      const criticalPorts = this.identifyCriticalPorts(
        scanResult,
        behaviorAnalysis,
        anomalies
      );

      return {
        riskScore,
        recommendations,
        criticalPorts,
        suggestedTests,
        vulnerabilities: vulnStats,
        behaviorAnalysis,
        anomalies,
        confidence: this.calculateConfidence(riskScore, vulnStats)
      };
    } catch (error) {
      this.logger.error('AI analysis failed:', error);
      throw error;
    }
  }

  private preprocessScanData(scanResult: ScanResult): tf.Tensor {
    // Convert scan result to tensor format
    const features = [
      ...this.extractPortFeatures(scanResult),
      ...this.extractServiceFeatures(scanResult),
      ...this.extractVersionFeatures(scanResult)
    ];
    
    return tf.tensor2d([features]);
  }

  private async calculateRiskScore(input: tf.Tensor): Promise<number> {
    const model = this.models.get('riskAssessment');
    if (!model) throw new Error('Risk assessment model not loaded');

    const prediction = await model.predict(input) as tf.Tensor;
    const score = (await prediction.data())[0];
    prediction.dispose();
    
    return score;
  }

  private async analyzeBehavior(input: tf.Tensor): Promise<BehaviorAnalysis> {
    const model = this.models.get('behaviorAnalysis');
    if (!model) throw new Error('Behavior analysis model not loaded');

    const prediction = await model.predict(input) as tf.Tensor;
    const behaviors = await prediction.array();
    prediction.dispose();

    return this.interpretBehaviors(behaviors[0]);
  }

  private async detectAnomalies(input: tf.Tensor): Promise<Anomaly[]> {
    const model = this.models.get('anomalyDetection');
    if (!model) throw new Error('Anomaly detection model not loaded');

    const prediction = await model.predict(input) as tf.Tensor;
    const anomalyScores = await prediction.array();
    prediction.dispose();

    return this.interpretAnomalies(anomalyScores[0]);
  }

  private calculateConfidence(riskScore: number, vulnStats: any): number {
    const factors = [
      riskScore,
      vulnStats.averageCVSS / 10,
      vulnStats.total > 0 ? 1 : 0
    ];
    
    return factors.reduce((acc, val) => acc + val, 0) / factors.length;
  }

  private async analyzeVulnerabilities(scanResult: ScanResult): Promise<any[]> {
    const vulnerabilities = [];
    for (const port of scanResult.ports) {
      if (port.service) {
        const serviceVulns = await this.vulnDB.searchVulnerabilities(port.service);
        vulnerabilities.push(...serviceVulns);
      }
    }
    return vulnerabilities;
  }

  private generateRecommendations(
    scanResult: ScanResult,
    vulnStats: any,
    behaviorAnalysis: BehaviorAnalysis,
    anomalies: Anomaly[]
  ): string[] {
    const recommendations: string[] = [];

    // Vulnerability-based recommendations
    if (vulnStats.bySeverity.critical > 0) {
      recommendations.push(
        `Critical: ${vulnStats.bySeverity.critical} critical vulnerabilities found. Immediate patching required.`
      );
    }

    // Behavior-based recommendations
    if (behaviorAnalysis.suspiciousPatterns.length > 0) {
      recommendations.push(
        `Suspicious behavior detected: ${behaviorAnalysis.suspiciousPatterns.join(', ')}. Enhanced monitoring recommended.`
      );
    }

    // Anomaly-based recommendations
    anomalies.forEach(anomaly => {
      recommendations.push(
        `Anomaly detected on port ${anomaly.port}: ${anomaly.description}. ${anomaly.recommendation}`
      );
    });

    return recommendations;
  }

  private async generateSuggestedTests(
    scanResult: ScanResult,
    vulnStats: any,
    behaviorAnalysis: BehaviorAnalysis
  ): Promise<string[]> {
    const tests: string[] = [];

    // Vulnerability-based tests
    if (vulnStats.total > 0) {
      tests.push('Run detailed vulnerability scan with version detection');
      tests.push('Perform authenticated security assessment');
    }

    // Behavior-based tests
    if (behaviorAnalysis.suspiciousPatterns.length > 0) {
      tests.push('Execute targeted penetration testing');
      tests.push('Perform deep packet inspection');
    }

    return tests;
  }

  private identifyCriticalPorts(
    scanResult: ScanResult,
    behaviorAnalysis: BehaviorAnalysis,
    anomalies: Anomaly[]
  ): number[] {
    const criticalPorts = new Set<number>();

    // Add ports with known vulnerabilities
    scanResult.ports
      .filter(port => port.service?.knownVulnerabilities)
      .forEach(port => criticalPorts.add(port.port));

    // Add ports with suspicious behavior
    behaviorAnalysis.suspiciousPatterns
      .forEach(pattern => {
        const affectedPorts = this.getAffectedPorts(pattern, scanResult);
        affectedPorts.forEach(port => criticalPorts.add(port));
      });

    // Add ports with anomalies
    anomalies
      .forEach(anomaly => criticalPorts.add(anomaly.port));

    return Array.from(criticalPorts);
  }

  private getAffectedPorts(pattern: string, scanResult: ScanResult): number[] {
    // Implementation to identify ports affected by a specific behavior pattern
    return [];
  }
}

interface BehaviorAnalysis {
  suspiciousPatterns: string[];
  riskLevel: 'low' | 'medium' | 'high';
  details: Record<string, any>;
}

interface Anomaly {
  port: number;
  description: string;
  confidence: number;
  recommendation: string;
}