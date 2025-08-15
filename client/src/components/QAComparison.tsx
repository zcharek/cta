import React from 'react';

interface QAComparisonProps {
  manualQA: {
    title: string;
    priority: string;
    items: string[];
  };
  automatedTests: {
    title: string;
    priority: string;
    items: string[];
  };
  approach: string;
}

const QAComparison: React.FC<QAComparisonProps> = ({
  manualQA,
  automatedTests,
  approach
}) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <h3 className="text-xl font-bold text-gray-900 mb-6">⚖️ QA Manuel vs Automation</h3>
      
      <div className="mb-6">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
          <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">👤</span>
          {manualQA.title} ({manualQA.priority})
        </h4>
        <ul className="text-sm text-gray-600 space-y-1 ml-8">
          {manualQA.items.map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      </div>
      
      <div>
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
          <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">🤖</span>
          {automatedTests.title} ({automatedTests.priority})
        </h4>
        <ul className="text-sm text-gray-600 space-y-1 ml-8">
          {automatedTests.items.map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg">
        <p className="text-sm text-gray-700 font-medium">
          <strong>Notre approche :</strong> {approach}
        </p>
      </div>
    </div>
  );
};

export default QAComparison; 