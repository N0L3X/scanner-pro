import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { NetworkMap } from './NetworkMap';
import { ScanResults } from './ScanResults';
import { Documentation } from './Documentation';
import { Settings, Network, FileText, HelpCircle } from 'lucide-react';
import ScannerSettings from './ScannerSettings';

export default function ModularScanner() {
  const [activeTab, setActiveTab] = useState('scan');

  return (
    <div className="min-h-screen bg-gray-900">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-gray-800">
          <TabsList className="max-w-7xl mx-auto px-4">
            <TabsTrigger value="scan" className="flex items-center">
              <Network className="h-4 w-4 mr-2" />
              Scanner
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Results
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center">
              <Network className="h-4 w-4 mr-2" />
              Network Map
            </TabsTrigger>
            <TabsTrigger value="docs" className="flex items-center">
              <HelpCircle className="h-4 w-4 mr-2" />
              Documentation
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <TabsContent value="scan">
            {/* Existing Scanner Component */}
          </TabsContent>

          <TabsContent value="results">
            <ScanResults />
          </TabsContent>

          <TabsContent value="map">
            <NetworkMap />
          </TabsContent>

          <TabsContent value="docs">
            <Documentation />
          </TabsContent>

          <TabsContent value="settings">
            <ScannerSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}