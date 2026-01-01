'use client';
import { useState } from 'react';
import TestReportsSection from './TestReportsSection';
import UserActivityReport from './UserActivityReport';
import { FileText, Activity } from 'lucide-react';

type ReportTabType = 'test-reports' | 'user-activity';

export default function ReportsTab() {
  const [activeTab, setActiveTab] = useState<ReportTabType>('test-reports');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-white">Reports & Analytics</h2>
          <p className="text-purple-100">View comprehensive reports on class performance and user activity</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex gap-0 border-b-2 border-gray-100">
          <button
            onClick={() => setActiveTab('test-reports')}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-semibold transition-all duration-300 relative ${
              activeTab === 'test-reports'
                ? 'text-purple-600 bg-gradient-to-r from-purple-50 to-pink-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              activeTab === 'test-reports'
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg'
                : 'bg-gray-100'
            }`}>
              <FileText className={`w-5 h-5 ${activeTab === 'test-reports' ? 'text-white' : 'text-gray-500'}`} />
            </div>
            <span className="text-base">Test Reports</span>
            {activeTab === 'test-reports' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('user-activity')}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-semibold transition-all duration-300 relative ${
              activeTab === 'user-activity'
                ? 'text-purple-600 bg-gradient-to-r from-purple-50 to-pink-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              activeTab === 'user-activity'
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg'
                : 'bg-gray-100'
            }`}>
              <Activity className={`w-5 h-5 ${activeTab === 'user-activity' ? 'text-white' : 'text-gray-500'}`} />
            </div>
            <span className="text-base">User Activity</span>
            {activeTab === 'user-activity' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300">
        {activeTab === 'test-reports' && <TestReportsSection />}
        {activeTab === 'user-activity' && <UserActivityReport />}
      </div>
    </div>
  );
}
