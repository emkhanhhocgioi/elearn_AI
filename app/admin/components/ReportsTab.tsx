'use client';
import { useState } from 'react';
import TestReportsSection from './TestReportsSection';
import UserActivityReport from './UserActivityReport';
import { FileText, Activity } from 'lucide-react';

type ReportTabType = 'test-reports' | 'user-activity';

export default function ReportsTab() {
  const [activeTab, setActiveTab] = useState<ReportTabType>('test-reports');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reports & Analytics</h2>
        <p className="text-gray-600">View comprehensive reports on class performance and user activity</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('test-reports')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
            activeTab === 'test-reports'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="w-5 h-5" />
          Test Reports
        </button>
        <button
          onClick={() => setActiveTab('user-activity')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
            activeTab === 'user-activity'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Activity className="w-5 h-5" />
          User Activity
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'test-reports' && <TestReportsSection />}
        {activeTab === 'user-activity' && <UserActivityReport />}
      </div>
    </div>
  );
}
