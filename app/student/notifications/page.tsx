"use client";

import { useEffect, useState } from "react";
import { getStudentNotifications, markNotificationAsRead } from "../api/notification";
import { Bell, CheckCircle, Info, AlertCircle, Clock, BookOpen, FileText, Award, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Sender {
  _id: string;
  name: string;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  recipients: string[];
  sender: Sender;
  isReadBy: string[];
  relatedId?: string;
  relatedModel?: string;
  important: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "important">("all");
  const [studentId, setStudentId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get student ID from localStorage
    const id = localStorage.getItem("studentId");
    setStudentId(id);
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getStudentNotifications();
      console.log("Fetched notifications:", data);
      setNotifications(data.notifications || []);
      setError(null);
    } catch (err) {
      setError("Không thể tải thông báo. Vui lòng thử lại sau.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "new_test":
      case "test":
        return <FileText className="w-6 h-6 text-purple-500" />;
      case "grade":
      case "result":
        return <Award className="w-6 h-6 text-yellow-500" />;
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "warning":
      case "deadline":
        return <AlertTriangle className="w-6 h-6 text-orange-500" />;
      case "error":
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case "lesson":
      case "material":
        return <BookOpen className="w-6 h-6 text-blue-500" />;
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getNotificationBorderColor = (type: string, important: boolean) => {
    if (important) return "border-l-red-500";
    
    switch (type.toLowerCase()) {
      case "new_test":
      case "test":
        return "border-l-purple-500";
      case "grade":
      case "result":
        return "border-l-yellow-500";
      case "success":
        return "border-l-green-500";
      case "warning":
      case "deadline":
        return "border-l-orange-500";
      case "error":
        return "border-l-red-500";
      case "lesson":
      case "material":
        return "border-l-blue-500";
      default:
        return "border-l-blue-500";
    }
  };

  const getNotificationBgColor = (type: string, important: boolean, isRead: boolean) => {
    if (isRead) return "bg-white";
    if (important) return "bg-red-50";
    
    switch (type.toLowerCase()) {
      case "new_test":
      case "test":
        return "bg-purple-50";
      case "grade":
      case "result":
        return "bg-yellow-50";
      case "warning":
      case "deadline":
        return "bg-orange-50";
      default:
        return "bg-blue-50";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} giờ trước`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)} ngày trước`;
    } else {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    const isRead = studentId ? notif.isReadBy.includes(studentId) : false;
    
    if (filter === "unread") return !isRead;
    if (filter === "important") return notif.important;
    return true;
  });

  const unreadCount = notifications.filter((n) => 
    studentId ? !n.isReadBy.includes(studentId) : true
  ).length;

  const importantCount = notifications.filter((n) => n.important).length;

  const handleNotificationClick = async (notification: Notification) => {
    const isRead = studentId ? notification.isReadBy.includes(studentId) : false;
    
    // Mark as read if not already read
    if (!isRead) {
      try {
        await markNotificationAsRead(notification._id);
        // Update local state
        setNotifications(prevNotifications =>
          prevNotifications.map(n =>
            n._id === notification._id && studentId
              ? { ...n, isReadBy: [...n.isReadBy, studentId] }
              : n
          )
        );
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }

    // Navigate to related content if available
    if (notification.relatedId && notification.relatedModel) {
      if (notification.relatedModel === "Test") {
        router.push(`/student/tests/${notification.relatedId}`);
      } else if (notification.relatedModel === "Lesson") {
        router.push(`/student/lessons/${notification.relatedId}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông báo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={fetchNotifications}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Thông báo</h1>
                <p className="text-gray-600 text-sm mt-1">
                  {unreadCount > 0
                    ? `Bạn có ${unreadCount} thông báo chưa đọc`
                    : "Tất cả thông báo đã được đọc"}
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter("all")}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  filter === "all"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tất cả <span className="ml-1 text-sm">({notifications.length})</span>
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 relative ${
                  filter === "unread"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Chưa đọc <span className="ml-1 text-sm">({unreadCount})</span>
                {unreadCount > 0 && filter !== "unread" && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>
              <button
                onClick={() => setFilter("important")}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  filter === "important"
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Quan trọng <span className="ml-1 text-sm">({importantCount})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-16 text-center border border-gray-100">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {filter === "unread" && "Không có thông báo chưa đọc"}
              {filter === "important" && "Không có thông báo quan trọng"}
              {filter === "all" && "Chưa có thông báo nào"}
            </h3>
            <p className="text-gray-500">
              {filter === "all" 
                ? "Thông báo của bạn sẽ xuất hiện ở đây"
                : "Hãy kiểm tra lại sau"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => {
              const isRead = studentId ? notification.isReadBy.includes(studentId) : false;
              
              return (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`bg-white rounded-xl shadow-md border-l-4 ${getNotificationBorderColor(
                    notification.type,
                    notification.important
                  )} p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.01] cursor-pointer ${
                    getNotificationBgColor(notification.type, notification.important, isRead)
                  } border border-gray-100`}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3
                              className={`text-lg font-bold ${
                                !isRead ? "text-gray-900" : "text-gray-600"
                              }`}
                            >
                              {notification.title}
                            </h3>
                            {!isRead && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-600 text-white">
                                Mới
                              </span>
                            )}
                            {notification.important && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-600 text-white">
                                Quan trọng
                              </span>
                            )}
                          </div>
                          {notification.sender && (
                            <p className="text-sm text-gray-500 mt-1">
                              Từ: <span className="font-medium text-gray-700">{notification.sender.name}</span>
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm flex-shrink-0">
                          <Clock className="w-4 h-4" />
                          <span className="whitespace-nowrap">{formatDate(notification.createdAt)}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {notification.message}
                      </p>
                      {notification.relatedId && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <span className="inline-flex items-center text-sm text-blue-600 font-medium hover:text-blue-700">
                            Nhấn để xem chi tiết →
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
