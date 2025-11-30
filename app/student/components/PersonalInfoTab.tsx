'use client';
import { useState } from 'react';
import { Edit2, Save, X, Mail, Phone, MapPin, Calendar, User } from 'lucide-react';

const PersonalInfoTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Nguyễn Văn A',
    email: 'student@example.com',
    phone: '0912345678',
    dateOfBirth: '2005-06-15',
    address: '123 Đường ABC, Thành phố HCM',
    studentId: 'STU20240001',
    class: 'Frontend Development Batch 2024',
    enrollmentDate: '2024-01-01',
    gpa: '3.8'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    // TODO: Save form data to API
    console.log('Saving:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
          <p className="text-gray-600 mt-1">Manage your profile and personal details</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Avatar Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{formData.fullName}</h3>
            <p className="text-sm text-gray-600 mb-4">{formData.studentId}</p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">GPA:</span> {formData.gpa}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Status:</span> <span className="text-green-600">Active</span>
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
                />
              </div>

              {/* Academic Info */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Student ID</label>
                    <input
                      type="text"
                      value={formData.studentId}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Class</label>
                    <input
                      type="text"
                      value={formData.class}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Enrollment Date</label>
                    <input
                      type="date"
                      value={formData.enrollmentDate}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Current GPA</label>
                    <input
                      type="text"
                      value={formData.gpa}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="border-t border-gray-200 pt-6 flex gap-3 justify-end">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;
