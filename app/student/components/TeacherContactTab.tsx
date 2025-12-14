'use client';
import { useState, useEffect } from 'react';
import { Mail, Phone, User, Award, BookOpen, Star, Search } from 'lucide-react';
import { getTeacherContacts } from '../api/teacher';

interface Teacher {
  _id: string;
  name: string;
  age: number;
  gender: string;
  subject: string;
  avatar?: string;
  phoneNumber: string;
  email: string;
  yearsOfExperience: number;
  isClassTeacher: boolean;
}

export default function TeacherContactTab() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchTeacherContacts = async () => {
      try {
        setLoading(true);
        const response = await getTeacherContacts();
        setTeachers(response.teachers || []);
      } catch (error) {
        console.error('Error fetching teacher contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherContacts();
  }, []);

  const subjects = ['all', ...Array.from(new Set(teachers.map(t => t.subject)))];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                         teacher.subject.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'all' || teacher.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const classTeachers = filteredTeachers.filter(t => t.isClassTeacher);
  const subjectTeachers = filteredTeachers.filter(t => !t.isClassTeacher);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading teacher contacts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Contacts</h1>
          <p className="text-sm text-gray-500 mt-1">Connect with your teachers</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, subject, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>
                {subject === 'all' ? 'All Subjects' : subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subject Teachers Section */}
      {subjectTeachers.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            Subject Teachers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectTeachers.map(teacher => (
              <TeacherCard key={teacher._id} teacher={teacher} />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredTeachers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <User className="w-16 h-16 mx-auto" />
          </div>
          <p className="text-gray-500">No teachers found</p>
        </div>
      )}
    </div>
  );
}

function TeacherCard({ teacher }: { teacher: Teacher }) {
  const getAvatarUrl = (avatar?: string) => {
    if (!avatar || avatar === 'noname.png') {
      return null;
    }
    return avatar;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        {/* Avatar removed */}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 truncate">{teacher.name}</h3>
            {teacher.isClassTeacher && (
              <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                <Star className="w-3 h-3" />
                GVCN
              </span>
            )}
          </div>
          
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>{teacher.subject}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Award className="w-4 h-4 text-green-500" />
              <span>{teacher.yearsOfExperience} năm kinh nghiệm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
        <a
          href={`mailto:${teacher.email}`}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Mail className="w-4 h-4" />
          <span className="truncate">{teacher.email}</span>
        </a>
        
        <a
          href={`tel:${teacher.phoneNumber}`}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Phone className="w-4 h-4" />
          <span>{teacher.phoneNumber}</span>
        </a>
      </div>

      {/* Additional Info */}
      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" />
          {teacher.gender}
        </span>
        <span>{teacher.age} tuổi</span>
      </div>
    </div>
  );
}