# Student Dashboard - Hướng dẫn

## Giới thiệu
Trang Student Dashboard được xây dựng dựa trên trang Teacher Dashboard, cung cấp một giao diện toàn diện cho học sinh quản lý học tập.

## Cấu trúc Thư mục

```
app/student/
├── dashboard/
│   └── page.tsx              # Trang chính dashboard
├── components/
│   ├── MyClassesTab.tsx      # Tab: Lớp học của bạn
│   ├── MyTestsTab.tsx        # Tab: Bài kiểm tra của bạn
│   ├── DocumentsTab.tsx      # Tab: Kho tài liệu
│   ├── PersonalInfoTab.tsx   # Tab: Thông tin cá nhân
│   └── SettingsTab.tsx       # Tab: Settings
```

## Các Tính Năng

### 1. **My Classes (Lớp học của bạn)**
- Hiển thị danh sách lớp học mà học sinh đã đăng ký
- Thông tin chi tiết: tên lớp, giáo viên, số sinh viên, tiến độ học tập
- Progress bar để theo dõi tiến độ
- Nút "View Class" để vào chi tiết lớp học

### 2. **My Tests (Bài kiểm tra của bạn)**
- Danh sách tất cả bài kiểm tra, bài tập
- Trạng thái: Submitted, Pending, Upcoming
- Điểm số (nếu đã nộp)
- Hạn chót (Due Date)
- Nút "Take Test" hoặc "View Results"

### 3. **Document Repository (Kho tài liệu)**
- Tập hợp tất cả tài liệu học tập từ các lớp
- Thông tin: loại file, dung lượng, ngày upload, người upload
- Chức năng: tải xuống (Download), xóa
- Card layout dễ nhìn với icon file

### 4. **Personal Info (Thông tin cá nhân)**
- Xem thông tin cá nhân của sinh viên
- Chỉnh sửa thông tin (Full Name, Email, Phone, Address, etc.)
- Thông tin học tập (Student ID, Class, Enrollment Date, GPA)
- Avatar profile
- Nút "Edit Profile" để bật chế độ chỉnh sửa

### 5. **Settings (Cài đặt)**
- **Notifications**: Cấu hình thông báo email, lớp, bài kiểm tra, bài tập
- **Privacy & Security**: 
  - Private Profile
  - Two-Factor Authentication
  - Change Password
- **Preferences**: 
  - Chọn ngôn ngữ (Tiếng Việt, English, 日本語, 한국어)
  - Dark Mode

### 6. **Logout (Đăng xuất)**
- Nút Logout ở sidebar hoặc profile dropdown menu

## Sidebar Navigation

```
MAIN MENU:
- My Classes (lớp học)
- My Tests (bài kiểm tra)
- Document Repository (kho tài liệu)
- Personal Info (thông tin cá nhân)

ACCOUNT:
- Settings (cài đặt)
- Logout (đăng xuất)
```

## Header Features

- **Search Bar**: Tìm kiếm lớp, tài liệu, bài kiểm tra
- **Notifications**: Bell icon để xem thông báo
- **Profile Menu**: Click avatar để xem profile dropdown

## Color Scheme

- Primary Color: Blue (#0066cc, #3b82f6)
- Background: Light Gray (#f3f4f6)
- Cards: White (#ffffff)
- Text: Dark Gray (#111827)
- Borders: Light Gray (#e5e7eb)

## Responsive Design

- **Desktop**: Sidebar + Main Content
- **Tablet**: Responsive grid layout
- **Mobile**: Stack layout, sidebar chuyển thành drawer

## Component Props & Hooks

### MyClassesTab
```tsx
- useState: Quản lý danh sách lớp và loading state
- useEffect: Fetch dữ liệu lớp từ API
```

### MyTestsTab
```tsx
- useState: Quản lý danh sách bài kiểm tra
- Status colors: Green (Submitted), Yellow (Pending), Blue (Upcoming)
```

### DocumentsTab
```tsx
- Download functionality
- Delete button
- File type detection
```

### PersonalInfoTab
```tsx
- Edit mode toggle
- Form validation
- Save functionality (API call)
- Separate academic info section
```

### SettingsTab
```tsx
- Toggle switches cho notifications
- Select dropdown cho language
- Dark mode toggle
- Two-factor auth option
```

## API Integration Points

Các chỗ cần tích hợp API (đánh dấu bằng `// TODO`):

1. **MyClassesTab**: `getStudentClasses()` - Lấy danh sách lớp của học sinh
2. **MyTestsTab**: `getStudentTests()` - Lấy danh sách bài kiểm tra
3. **DocumentsTab**: `getStudentDocuments()` - Lấy danh sách tài liệu
4. **PersonalInfoTab**: `updateStudentProfile()` - Cập nhật thông tin cá nhân
5. **SettingsTab**: `updateSettings()` - Lưu cài đặt
6. **Dashboard**: `logout()` - Đăng xuất

## Styling Libraries

- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

## File Icons

```tsx
- BookOpen: Lớp học, tài liệu
- Award: Bài kiểm tra
- FileText: Tài liệu
- Users: Số học sinh
- Bell: Thông báo
- Settings: Cài đặt
- LogOut: Đăng xuất
- User: Thông tin cá nhân
```

## Hướng dẫn Phát triển Tiếp theo

1. Tích hợp API endpoints cho mỗi component
2. Thêm error handling và loading states
3. Implement logout functionality
4. Thêm pagination cho danh sách dài
5. Thêm filters/search functionality
6. Implement real-time notifications
7. Thêm animations và transitions
8. Mobile sidebar drawer

## Notes

- Tất cả dữ liệu hiện tại là mock data
- Component sử dụng lazy loading để optimize performance
- Responsive design đã được áp dụng
- Dark mode cơ bản đã có (cần implement full theme system)

---

**Created**: November 2024
**Version**: 1.0.0
