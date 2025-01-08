import React, { useEffect, useState } from 'react';
import { Book, ChevronRight, X } from 'lucide-react';
import { TutorialManager } from '../utils/tutorials/tutorialManager';
import { Tutorial, TutorialStep } from '../utils/types';

export default function TutorialOverlay() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const tutorialManager = TutorialManager.getInstance();

  useEffect(() => {
    setTutorials(tutorialManager.getAllTutorials());
  }, []);

  const startTutorial = (tutorial: Tutorial) => {
    setActiveTutorial(tutorial);
    setCurrentStep(0);
    tutorialManager.startTutorial(tutorial.id);
  };

  const nextStep = () => {
    if (activeTutorial && currentStep < activeTutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      tutorialManager.nextStep();
    } else {
      setActiveTutorial(null);
    }
  };

  if (!activeTutorial) {
    return (
      <div className="fixed bottom-4 right-4">
        <div className="bg-gray-800 rounded-lg shadow-lg p-4">
          <div className="flex items-center mb-4">
            <Book className="h-5 w-5 text-cyan-500 mr-2" />
            <h3 className="text-lg font-semibold text-white">Tutorials</h3>
          </div>
          <div className="space-y-2">
            {tutorials.map(tutorial => (
              <button
                key={tutorial.id}
                onClick={() => startTutorial(tutorial)}
                className="w-full text-left px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              >
                {tutorial.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const step = activeTutorial.steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">{activeTutorial.title}</h3>
          <button
            onClick={() => setActiveTutorial(null)}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Step {currentStep + 1} of {activeTutorial.steps.length}</span>
            <span>{step.title}</span>
          </div>
          <p className="text-white">{step.content}</p>
        </div>

        <button
          onClick={nextStep}
          className="w-full bg-cyan-500 text-white py-2 px-4 rounded hover:bg-cyan-600 transition-colors flex items-center justify-center"
        >
          {currentStep === activeTutorial.steps.length - 1 ? (
            'Finish'
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}