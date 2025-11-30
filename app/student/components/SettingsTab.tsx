'use client';
import { useState } from 'react';
import { Bell, Lock, Eye, Globe, Save, X } from 'lucide-react';

const SettingsTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    classNotifications: true,
    testReminders: true,
    assignmentReminders: true,
    darkMode: false,
    privateProfile: false,
    twoFactorAuth: false,
    language: 'vi'
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectChange = (key: keyof typeof settings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value as never
    }));
  };

  const handleSave = async () => {
    // TODO: Save settings to API
    console.log('Saving settings:', settings);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600 mt-1">Manage your preferences and account settings</p>
        </div>
        {isEditing && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Notification Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900 block">Email Notifications</label>
                <p className="text-xs text-gray-500 mt-1">Receive email updates about your classes</p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                  disabled={!isEditing}
                  className="w-12 h-6 appearance-none bg-gray-300 rounded-full cursor-pointer transition-colors checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundImage: settings.emailNotifications ? 'linear-gradient(to right, #3b82f6, #3b82f6)' : '',
                    backgroundPosition: settings.emailNotifications ? 'right' : 'left',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900 block">Class Notifications</label>
                <p className="text-xs text-gray-500 mt-1">Get notified about new class materials and announcements</p>
              </div>
              <input
                type="checkbox"
                checked={settings.classNotifications}
                onChange={() => handleToggle('classNotifications')}
                disabled={!isEditing}
                className="w-12 h-6 appearance-none bg-gray-300 rounded-full cursor-pointer transition-colors checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900 block">Test Reminders</label>
                <p className="text-xs text-gray-500 mt-1">Receive reminders before tests and exams</p>
              </div>
              <input
                type="checkbox"
                checked={settings.testReminders}
                onChange={() => handleToggle('testReminders')}
                disabled={!isEditing}
                className="w-12 h-6 appearance-none bg-gray-300 rounded-full cursor-pointer transition-colors checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900 block">Assignment Reminders</label>
                <p className="text-xs text-gray-500 mt-1">Get reminded about upcoming assignments and deadlines</p>
              </div>
              <input
                type="checkbox"
                checked={settings.assignmentReminders}
                onChange={() => handleToggle('assignmentReminders')}
                disabled={!isEditing}
                className="w-12 h-6 appearance-none bg-gray-300 rounded-full cursor-pointer transition-colors checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b">
            <Lock className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Privacy & Security</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900 block">Private Profile</label>
                <p className="text-xs text-gray-500 mt-1">Only show your profile to teachers and classmates</p>
              </div>
              <input
                type="checkbox"
                checked={settings.privateProfile}
                onChange={() => handleToggle('privateProfile')}
                disabled={!isEditing}
                className="w-12 h-6 appearance-none bg-gray-300 rounded-full cursor-pointer transition-colors checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900 block">Two-Factor Authentication</label>
                <p className="text-xs text-gray-500 mt-1">Add an extra layer of security to your account</p>
              </div>
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={() => handleToggle('twoFactorAuth')}
                disabled={!isEditing}
                className="w-12 h-6 appearance-none bg-gray-300 rounded-full cursor-pointer transition-colors checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900 block">Change Password</label>
                <p className="text-xs text-gray-500 mt-1">Update your password regularly to keep your account secure</p>
              </div>
              <span className="text-blue-600 text-sm font-medium">Change</span>
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-900 block mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleSelectChange('language', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900 block mb-2">Dark Mode</label>
              <p className="text-xs text-gray-500 mb-2">Switch to dark theme for comfortable viewing</p>
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={() => handleToggle('darkMode')}
                disabled={!isEditing}
                className="w-12 h-6 appearance-none bg-gray-300 rounded-full cursor-pointer transition-colors checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Edit Button */}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Edit Settings
          </button>
        )}
      </div>
    </div>
  );
};

export default SettingsTab;
