// Importiere den AIAnalyzer
import { AIAnalyzer, AIAnalysis } from '../utils/aiAnalyzer';
import { Brain } from 'lucide-react';

// Füge AIAnalysis zum State hinzu
const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
const aiAnalyzer = useMemo(() => new AIAnalyzer(), []);

// Erweitere die startScan Funktion
const startScan = async (e: React.FormEvent) => {
  // ... bisheriger Code ...

  try {
    const scanResult = await window.electron.scanTarget({
      host: targetIP.trim(),
      scanType
    });

    // KI-Analyse durchführen
    const analysis = await aiAnalyzer.analyzeScan(scanResult);
    setAiAnalysis(analysis);

    // ... Rest des bisherigen Codes ...
  } catch (err) {
    console.error('Scan error:', err);
    setError(err instanceof Error ? err.message : 'Failed to start scan');
  }
};

// Füge KI-Analyse-Komponente hinzu
const renderAIAnalysis = () => {
  if (!aiAnalysis) return null;

  return (
    <div className="mt-8 bg-gray-800 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Brain className="h-6 w-6 text-cyan-500 mr-2" />
        <h2 className="text-xl font-bold text-white">KI-Analyse</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Risiko-Score</h3>
          <div className="flex items-center">
            <div className="flex-1 bg-gray-700 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-green-500 to-red-500 h-full rounded-full"
                style={{ width: `${aiAnalysis.riskScore * 100}%` }}
              />
            </div>
            <span className="ml-3 text-white">
              {Math.round(aiAnalysis.riskScore * 100)}%
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Kritische Ports</h3>
          <div className="flex flex-wrap gap-2">
            {aiAnalysis.criticalPorts.map(port => (
              <span 
                key={port}
                className="px-2 py-1 bg-red-500/10 border border-red-500 rounded text-red-500"
              >
                Port {port}
              </span>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-2">Empfehlungen</h3>
          <ul className="space-y-2">
            {aiAnalysis.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <span className="text-cyan-500 mr-2">•</span>
                <span className="text-gray-300">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-2">Empfohlene Tests</h3>
          <ul className="space-y-2">
            {aiAnalysis.suggestedTests.map((test, index) => (
              <li key={index} className="flex items-start">
                <span className="text-cyan-500 mr-2">•</span>
                <span className="text-gray-300">{test}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Füge die KI-Analyse zum JSX hinzu
return (
  // ... bisheriger Code ...
  {renderDashboard()}
  {renderAIAnalysis()}
  // ... Rest des bisherigen Codes ...
);