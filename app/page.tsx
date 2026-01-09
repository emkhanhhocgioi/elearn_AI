'use client';
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Hero Section with Background */}
      <div className="relative min-h-[100vh] w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src = {"https://th.bing.com/th/id/R.c53dbb718e08ee72da1c6b098084a2b9?rik=FVjTaYJ6QbxCVQ&pid=ImgRaw&r=0"}
            alt="Nền Trường Học"
         
            className="w-full h-full object-cover"
     
     
          />
          
           
        </div>

        {/* Thanh Điều Hướng Hiện Đại */}
        <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-sm bg-white/10 border-b border-white/20">
          <div className="flex items-center">
           
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-bold text-white"> E-Learning</span>
              <span className="text-sm text-cyan-200 font-medium">Nền Tảng Học Trực Tuyến THPT</span>
            </div>
          </div>
          
          {/* Liên Kết Điều Hướng */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-white/90 hover:text-cyan-300 transition-colors font-medium">Tính Năng</a>
            <a href="#about" className="text-white/90 hover:text-cyan-300 transition-colors font-medium">Giới Thiệu</a>
            <a href="#contact" className="text-white/90 hover:text-cyan-300 transition-colors font-medium">Liên Hệ</a>
          </div>
        </nav>

        {/* Nội Dung Hero */}
        <div className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-120px)] px-6 md:px-12 text-center">
          {/* Huy Hiệu Hero Động */}
          <div className="mb-8 px-4 py-2 bg-cyan-500/20 backdrop-blur-md border border-cyan-400/30 rounded-full">
            <span className="text-cyan-300 text-sm font-semibold tracking-wide">📚 Học Tập Thông Minh - Vươn Tới Tương Lai</span>
          </div>
          
          {/* Tiêu Đề Chính với Hoạt Ảnh */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            <span className="text-[#0694fa]">
              E-Learning THPT
            </span>
          </h1>
          
          {/* Phụ Đề */}
          <p className="text-xl md:text-2xl text-white/90 font-light max-w-4xl mb-10 leading-relaxed">
            Nền tảng học trực tuyến hiện đại dành cho học sinh THPT. Học mọi lúc, mọi nơi với giáo viên và bạn bè cùng lớp.
          </p>
          
          {/* Nút CTA */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button 
              className="px-8 py-4 text-lg font-semibold bg-[#0694fa] hover:bg-[#0580d1] text-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => router.push('/student/login')}
            >
              Đăng Nhập Học Sinh
            </Button>
            <Button 
              className="px-8 py-4 text-lg font-semibold bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 rounded-full shadow-xl transition-all duration-300"
              onClick={() => router.push('/teacher/login')}
            >
              Đăng Nhập Giáo Viên
            </Button>
          </div>
          
          {/* Phần Thống Kê */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-cyan-400">5K+</span>
              <span className="text-white/80 text-sm">Học Sinh Đang Học</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-cyan-400">200+</span>
              <span className="text-white/80 text-sm">Giáo Viên Tận Tâm</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-cyan-400">1000+</span>
              <span className="text-white/80 text-sm">Bài Giảng Video</span>
            </div>
          </div>
        </div>
      </div>

      {/* Phần Tính Năng Nâng Cao */}
      <section id="features" className="relative py-20 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          {/* Tiêu Đề Phần */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tại Sao Chọn <span className="text-[#0694fa]">E-Learning?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Nền tảng học trực tuyến toàn diện giúp học sinh THPT học tập hiệu quả với giáo viên giỏi và công nghệ hiện đại.
            </p>
          </div>

          {/* Lưới Thẻ Tính Năng */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Thẻ Tải Lên & Chia Sẻ */}
            <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white">
              <div className="relative w-full h-64 overflow-hidden">
               <img
                  src="https://th.bing.com/th/id/R.0ffc27a7a0b7ba961afe9964e14af04e?rik=KASpmcb%2foApIag&riu=http%3a%2f%2fmedia.cntraveler.com%2fphotos%2f568ae16e67dc82253d9f72cf%2fmaster%2fpass%2fStockholm-Public-Library-Alamy.jpg&ehk=tkl2CXGF9pzan9qcnJF%2b9IIhgU8M9%2ba5KvXxFg7uTCY%3d&risl=&pid=ImgRaw&r=0"
                  alt="Tải Lên Tài Liệu"
                  
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  
                />

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-[#0694fa] rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-[#0694fa] transition-colors">
                  Bài Giảng Chất Lượng Cao
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Học với hàng nghìn video bài giảng chất lượng cao từ các thầy cô giỏi. Xem lại bất cứ lúc nào, học theo tốc độ của riêng bạn.
                </p>
                <div className="flex items-center text-[#0694fa] font-semibold group-hover:translate-x-2 transition-transform">
                  Tìm hiểu thêm
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardContent>
            </Card>

            {/* Thẻ Khám Phá Tài Nguyên */}
            <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white">
              <div className="relative w-full h-64 overflow-hidden">
                <img
                  src="https://thpt-locninh-binhphuoc.edu.vn/uploads/news/2025_07/images.png  "
                  alt="Khám Phá Tài Nguyên"
             
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
               
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-[#0694fa] rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-[#0694fa] transition-colors">
                  Bài Tập Trực Tuyến
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Làm bài tập và kiểm tra trực tuyến với hệ thống chấm điểm tự động. Nhận phản hồi ngay lập tức và cải thiện kết quả học tập.
                </p>
                <div className="flex items-center text-[#0694fa] font-semibold group-hover:translate-x-2 transition-transform">
                  Tìm hiểu thêm
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardContent>
            </Card>

            {/* Thẻ Cộng Tác & Kết Nối */}
            <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white">
              <div className="relative w-full h-64 overflow-hidden">
                <img
                  src="https://facts.net/wp-content/uploads/2023/06/Communication-modes-768x415.jpg"
                  alt="Cộng Tác"
                 
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-[#0694fa] rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-[#0694fa] transition-colors">
                 Ứng dụng AI hỗ trợ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Đặt câu hỏi trực tiếp với giáo viên, nhận hỗ trợ cá nhân và tham gia các buổi học trực tuyến tương tác.
                </p>
                <div className="flex items-center text-[#0694fa] font-semibold group-hover:translate-x-2 transition-transform">
                  Tìm hiểu thêm
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tính Năng Bổ Sung */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#0694fa] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Học Mọi Lúc Mọi Nơi</h3>
              <p className="text-gray-600 text-sm">Truy cập bài giảng và làm bài tập từ điện thoại, máy tính bảng hay laptop</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#0694fa] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Theo Dõi Tiến Độ</h3>
              <p className="text-gray-600 text-sm">Xem chi tiết tiến độ học tập và kết quả kiểm tra của bạn</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#0694fa] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Giáo Viên Giỏi</h3>
              <p className="text-gray-600 text-sm">Học với đội ngũ giáo viên giàu kinh nghiệm và tâm huyết</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#0694fa] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Hỗ Trợ Học Tập</h3>
              <p className="text-gray-600 text-sm">Trợ lý AI thông minh giúp giải đáp thắc mắc 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Phần Nhận Xét */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Học Sinh Nói Gì Về E-Learning
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hàng nghìn học sinh THPT đã cải thiện kết quả học tập với nền tảng của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Nhận Xét 1 */}
            <div className="bg-blue-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#0694fa] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <h4 className="text-gray-900 font-semibold">Mai Nguyễn</h4>
                  
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                E-Learning giúp em hiểu bài rõ hơn rất nhiều! Các video bài giảng dễ hiểu, có thể xem lại nhiều lần. Điểm môn Toán của em đã tăng từ 6 lên 8!
              </p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Nhận Xét 2 */}
            <div className="bg-blue-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#0694fa] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <h4 className="text-gray-900 font-semibold">Tuấn Lê</h4>
      
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Em rất thích hệ thống bài tập trực tuyến! Làm xong là biết ngay đáp án đúng sai, giúp em tự học và cải thiện điểm số rất nhanh.
              </p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Nhận Xét 3 */}
            <div className="bg-blue-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#0694fa] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <div>
                  <h4 className="text-gray-900 font-semibold">Linh Phạm</h4>
                 
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Thầy cô trên FPT E-Learning rất nhiệt tình! Em có thể hỏi bài bất cứ lúc nào và nhận được giải đáp chi tiết. Cảm ơn các thầy cô rất nhiều!
              </p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phần Kêu Gọi Hành Động */}
      <section className="relative py-20 bg-[#0694fa] overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Sẵn Sàng Bắt Đầu Học Tập?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-10 leading-relaxed">
            Tham gia E-Learning ngay hôm nay để trải nghiệm phương pháp học tập hiện đại, hiệu quả và đạt kết quả cao trong học tập.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button 
              className="px-10 py-5 text-lg font-semibold bg-white text-[#0694fa] hover:bg-gray-100 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => router.push('/student/login')}
            >
              Học Sinh Đăng Nhập
            </Button>
            <Button 
              className="px-10 py-5 text-lg font-semibold bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#0694fa] rounded-full shadow-xl transition-all duration-300"
              onClick={() => router.push('/teacher/login')}
            >
              Giáo Viên Đăng Nhập
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Bài Giảng Chất Lượng Cao</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Học Mọi Lúc Mọi Nơi</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Hỗ Trợ Từ Giáo Viên</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Nâng Cao */}
      <footer className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
        {/* Nội Dung Footer Chính */}
        <div className="container mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Phần Thương Hiệu */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-6">
            
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Nền tảng học trực tuyến hàng đầu dành cho học sinh THPT, mang đến trải nghiệm học tập tốt nhất với công nghệ hiện đại.
              </p>
              {/* Mạng Xã Hội */}
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-cyan-600 rounded-full flex items-center justify-center transition-colors group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Liên Kết Nhanh */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-6">Nền Tảng</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Tính Năng
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Cách Hoạt Động
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Bảng Giá
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Ứng Dụng Di Động
                </a></li>
              </ul>
            </div>

            {/* Hỗ Trợ */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-6">Hỗ Trợ</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Trung Tâm Trợ Giúp
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Liên Hệ Hỗ Trợ
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Quy Tắc Cộng Đồng
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Báo Cáo Vấn Đề
                </a></li>
              </ul>
            </div>

            {/* Pháp Lý */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-6">Pháp Lý</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Chính Sách Bảo Mật
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Điều Khoản Dịch Vụ
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Chính Sách Cookie
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Thông Báo DMCA
                </a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Dưới */}
        <div className="border-t border-gray-700">
          <div className="container mx-auto px-6 md:px-12 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
             
              
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}