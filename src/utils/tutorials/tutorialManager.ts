import { Tutorial, TutorialStep } from '../types';

export class TutorialManager {
  private static instance: TutorialManager;
  private tutorials: Map<string, Tutorial> = new Map();
  private currentTutorial: Tutorial | null = null;
  private currentStep = 0;

  private constructor() {
    this.loadDefaultTutorials();
  }

  static getInstance(): TutorialManager {
    if (!TutorialManager.instance) {
      TutorialManager.instance = new TutorialManager();
    }
    return TutorialManager.instance;
  }

  private loadDefaultTutorials(): void {
    const basicScan: Tutorial = {
      id: 'basic-scan',
      title: 'Basic Network Scanning',
      description: 'Learn how to perform your first network scan',
      steps: [
        {
          title: 'Enter Target',
          content: 'Enter the IP address or hostname you want to scan',
          element: '#target-input'
        },
        {
          title: 'Select Scan Type',
          content: 'Choose between Quick, Full, or Vulnerability scan',
          element: '#scan-type'
        },
        {
          title: 'Start Scan',
          content: 'Click the Start Scan button to begin',
          element: '#start-scan'
        }
      ]
    };

    this.tutorials.set(basicScan.id, basicScan);
  }

  startTutorial(id: string): void {
    const tutorial = this.tutorials.get(id);
    if (tutorial) {
      this.currentTutorial = tutorial;
      this.currentStep = 0;
      this.showCurrentStep();
    }
  }

  nextStep(): void {
    if (this.currentTutorial && this.currentStep < this.currentTutorial.steps.length - 1) {
      this.currentStep++;
      this.showCurrentStep();
    }
  }

  private showCurrentStep(): void {
    if (!this.currentTutorial) return;
    
    const step = this.currentTutorial.steps[this.currentStep];
    const element = document.querySelector(step.element);
    
    if (element) {
      // Highlight the element and show tooltip
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  getAllTutorials(): Tutorial[] {
    return Array.from(this.tutorials.values());
  }
}