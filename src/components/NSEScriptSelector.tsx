import React, { useState, useEffect } from 'react';
import { Search, Code, Info } from 'lucide-react';
import { NSEManager, NSEScript } from '../utils/nse/nseManager';

interface NSEScriptSelectorProps {
  onScriptSelect: (scripts: NSEScript[]) => void;
}

export default function NSEScriptSelector({ onScriptSelect }: NSEScriptSelectorProps) {
  const [scripts, setScripts] = useState<NSEScript[]>([]);
  const [selectedScripts, setSelectedScripts] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const nseManager = NSEManager.getInstance();

  useEffect(() => {
    setScripts(nseManager.getScripts());
  }, []);

  const categories = ['all', ...new Set(scripts.map(s => s.category))];

  const filteredScripts = scripts.filter(script => {
    const matchesSearch = script.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         script.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || script.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleScriptToggle = (scriptId: string) => {
    const newSelected = new Set(selectedScripts);
    if (newSelected.has(scriptId)) {
      newSelected.delete(scriptId);
    } else {
      newSelected.add(scriptId);
    }
    setSelectedScripts(newSelected);
    onScriptSelect(scripts.filter(s => newSelected.has(s.id)));
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center mb-6">
        <Code className="h-6 w-6 text-cyan-500 mr-2" />
        <h2 className="text-xl font-bold text-white">NSE Scripts</h2>
      </div>

      <div className="space-y-4">
        {/* Search and Category Filter */}
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search scripts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Script List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredScripts.map(script => (
            <div
              key={script.id}
              className="flex items-start space-x-3 bg-gray-700 rounded-lg p-4"
            >
              <input
                type="checkbox"
                checked={selectedScripts.has(script.id)}
                onChange={() => handleScriptToggle(script.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="text-white font-medium">{script.name}</h3>
                  <span className="ml-2 px-2 py-0.5 bg-gray-600 rounded text-xs text-gray-300">
                    {script.category}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{script.description}</p>
                {script.args && (
                  <div className="mt-2">
                    <div className="flex items-center text-sm text-gray-400">
                      <Info className="h-4 w-4 mr-1" />
                      Arguments available
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}