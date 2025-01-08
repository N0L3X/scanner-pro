import React, { useState } from 'react';
import { Book, Search, Code, Shield } from 'lucide-react';
import { marked } from 'marked';

const sections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Book,
    content: `
# Getting Started with Network Scanner Pro

## Quick Start
1. Enter target IP or hostname
2. Select scan type
3. Click "Start Scan"

## Scan Types
- Quick Scan: Basic port scan
- Full Scan: Comprehensive analysis
- Vulnerability Scan: Security assessment
    `
  },
  {
    id: 'advanced',
    title: 'Advanced Features',
    icon: Code,
    content: `
# Advanced Features

## Custom Port Ranges
Configure specific port ranges for targeted scanning

## Protocol Support
- Industrial (Modbus, DNP3)
- IoT (MQTT, CoAP)
- Modern Web (HTTP/3, QUIC)

## Performance Tuning
- Concurrent scans
- Timeout settings
- Resource optimization
    `
  },
  {
    id: 'security',
    title: 'Security Features',
    icon: Shield,
    content: `
# Security Features

## Anonymization
Route scans through anonymous networks

## Anti-Detection
Avoid detection by IDS/IPS systems

## DoS Protection
Prevent accidental DoS conditions
    `
  }
];

export function Documentation() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-1 bg-gray-800 rounded-lg p-4">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>

        <nav className="space-y-2">
          {filteredSections.map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-cyan-500 text-white'
                    : 'text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {section.title}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="col-span-3 bg-gray-800 rounded-lg p-6">
        <div className="prose prose-invert max-w-none">
          {sections.find(s => s.id === activeSection)?.content && (
            <div 
              dangerouslySetInnerHTML={{ 
                __html: marked(sections.find(s => s.id === activeSection)?.content || '') 
              }} 
            />
          )}
        </div>
      </div>
    </div>
  );
}