'use client';
import { useState } from 'react';
import { Download, BarChart3, TrendingUp, Users } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'users' | 'classes' | 'performance' | 'enrollment';
  generated: string;
  records: number;
}

export default function ReportsTab() {
  const [reports] = useState<Report[]>([
    {
      id: '1',
      name: 'Monthly User Activity Report',
      description: 'Detailed report of user activities and engagement metrics',
      type: 'users',
      generated: '2024-01-25',
      records: 2547
    },
    {
      id: '2',
      name: 'Class Performance Analytics',
      description: 'Performance metrics for all active classes and student progress',
      type: 'performance',
      generated: '2024-01-24',
      records: 156
    },
    {
      id: '3',
      name: 'Student Enrollment Report',
      description: 'Enrollment statistics and trends for the current academic year',
      type: 'enrollment',
      generated: '2024-01-23',
      records: 1847
    }
  ]);

  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'users': return <Users className="w-5 h-5" />;
      case 'classes': return <BarChart3 className="w-5 h-5" />;
      case 'performance': return <TrendingUp className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'users': return 'bg-blue-100 text-blue-700';
      case 'classes': return 'bg-purple-100 text-purple-700';
      case 'performance': return 'bg-green-100 text-green-700';
      case 'enrollment': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <div className="flex gap-2">
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-300 transition-colors">
            <BarChart3 className="w-4 h-4" />
            Generate Report
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(report.type)}`}>
                  {getTypeIcon(report.type)}
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{report.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{report.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Generated: {report.generated}</span>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {report.records.toLocaleString()} records
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">System Analytics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-2">Total Page Views</p>
            <p className="text-2xl font-bold text-gray-900">45,231</p>
            <p className="text-xs text-green-600 mt-2">+12% from last month</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-2">Active Sessions</p>
            <p className="text-2xl font-bold text-gray-900">1,234</p>
            <p className="text-xs text-green-600 mt-2">+5% from last month</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-2">Avg. Session Duration</p>
            <p className="text-2xl font-bold text-gray-900">23:45</p>
            <p className="text-xs text-red-600 mt-2">-8% from last month</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-2">Bounce Rate</p>
            <p className="text-2xl font-bold text-gray-900">32.5%</p>
            <p className="text-xs text-green-600 mt-2">-3% from last month</p>
          </div>
        </div>

        {/* Placeholder Chart Area */}
        <div className="border border-dashed border-gray-300 rounded-lg p-12 bg-gray-50 text-center">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Chart visualization would go here</p>
          <p className="text-sm text-gray-400 mt-2">Integrate with charting library (Chart.js, Recharts, etc.)</p>
        </div>
      </div>

      {/* Custom Report Builder */}
      <div className="bg-white rounded-xl p-6 shadow-sm mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Build Custom Report</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Report Type</label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select Report Type</option>
              <option>User Activity</option>
              <option>Class Performance</option>
              <option>Student Enrollment</option>
              <option>Financial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Date Range</label>
            <div className="flex gap-2">
              <input type="date" className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="date" className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Format</label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option>PDF</option>
              <option>Excel</option>
              <option>CSV</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Frequency</label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option>One-time</option>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
        </div>

        <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Generate Report
        </button>
      </div>
    </div>
  );
}
