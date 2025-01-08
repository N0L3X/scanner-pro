import React from 'react';
import { Shield, Users, Book } from 'lucide-react';

const services = [
  {
    id: 'svc1',
    name: 'Enterprise Security Audit',
    description: 'Comprehensive security assessment including vulnerability scanning, penetration testing, and detailed reporting.',
    packages: [
      {
        name: 'Basic',
        price: 2500,
        features: [
          'External vulnerability scan',
          'Basic penetration testing',
          'Summary report',
          'Remediation guidance'
        ]
      },
      {
        name: 'Standard',
        price: 7500,
        features: [
          'Everything in Basic',
          'Internal network testing',
          'Web application testing',
          'Social engineering assessment',
          'Detailed technical report'
        ]
      },
      {
        name: 'Premium',
        price: 15000,
        features: [
          'Everything in Standard',
          'Advanced persistent threat simulation',
          'Mobile application testing',
          'Cloud infrastructure assessment',
          'Executive presentation',
          '30-day retest'
        ]
      }
    ]
  }
];

export default function Services() {
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Professional Security Services</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Enterprise-grade security assessments, consulting, and training services delivered by certified professionals.
          </p>
        </div>

        {services.map((service) => (
          <div key={service.id} className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">{service.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {service.packages.map((pkg, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                  <h3 className="text-xl font-semibold text-white mb-4">{pkg.name} Package</h3>
                  <p className="text-3xl font-bold text-cyan-500 mb-6">€{pkg.price.toLocaleString()}</p>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-gray-300">
                        <Shield className="h-5 w-5 text-cyan-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full mt-8 bg-cyan-500 text-white py-2 px-4 rounded hover:bg-cyan-600 transition-colors">
                    Request Quote
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-cyan-500 mr-2" />
              <h3 className="text-xl font-semibold text-white">Security Workshops</h3>
            </div>
            <p className="text-gray-400 mb-4">
              On-site and remote security awareness training for your team. Custom workshops tailored to your organization's needs.
            </p>
            <p className="text-lg font-semibold text-cyan-500">Starting at €1,000/day</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Book className="h-6 w-6 text-cyan-500 mr-2" />
              <h3 className="text-xl font-semibold text-white">Training Programs</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Structured training programs for security professionals and teams. Certification preparation and hands-on labs.
            </p>
            <p className="text-lg font-semibold text-cyan-500">Custom pricing</p>
          </div>
        </div>
      </div>
    </div>
  );
}