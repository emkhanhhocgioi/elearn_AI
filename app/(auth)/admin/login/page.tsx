'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  CheckCircle 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import axios from 'axios';
import { adminLogin } from '@/app/api/auth';
export default function AdminLoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [loadingForgot, setLoadingForgot] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return '';
    }
    if (!emailRegex.test(email)) {
      return 'Email không hợp lệ';
    }
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return '';
    }
    if (password.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    return '';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    
    if (emailErr || passwordErr) {
      return;
    }

    setLoadingLogin(true);
    
    try {
      // Simulated API call - Replace with actual admin login API
        const response = await adminLogin(email, password);
        console.log('Admin login successful:', response);
      // On success, store token and redirect
        
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminName', response.admin.name);
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError(true);
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForgot(true);
    setForgotError('');
    setForgotSent(false);

    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setForgotSent(true);
      setTimeout(() => {
        setForgotOpen(false);
        setForgotEmail('');
        setForgotSent(false);
      }, 2000);
    } catch (error) {
      setForgotError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoadingForgot(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF] flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#0694FE]/20 rounded-full animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#1E293B]/10 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#0694FE]/10 rounded-full animate-ping delay-2000" />
      </div>

      {/* School Logo at top left */}
      <div className="absolute top-4 left-4 z-20 flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg transition-all duration-300 hover:scale-105">
        <Image
          src="https://www.bing.com/th/id/OIP.r4JwfITtHQW0PmuLMIvJQAHaFg?w=243&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.1&pid=3.1&rm=2"
          alt="School Logo"
          width={80}
          height={80}
          className="h-10 w-10 md:h-12 md:w-12 object-cover rounded-full mr-3 shadow-sm"
        />
        <span className="text-lg md:text-xl font-bold text-[#0694FE] hidden sm:block">
            Hệ thống Quản lý Giáo dục
        </span>
      </div>

      {/* Main container */}
      <div
        className={`flex flex-col lg:flex-row w-[95vw] lg:w-[92vw] max-w-[1200px] h-[90vh] lg:h-[75vh] max-h-[900px] lg:max-h-[850px] bg-white/95 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden z-10 transition-all duration-700 ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Left - Image and text - Hidden on mobile */}
        <div className="hidden lg:flex w-1/2 h-full relative flex-col justify-end">
          <Image
            src="https://www.bing.com/th/id/OIP.r4JwfITtHQW0PmuLMIvJQAHaFg?w=243&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.1&pid=3.1&rm=2"
            alt="Môi trường học thuật"
            fill
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="relative z-10 p-8 pt-20 h-full flex flex-col justify-end">
            <div className="transform transition-all duration-700 hover:translate-y-[-4px]">
              <h1 className="text-[2.8vw] min-text-2xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                Quản trị hệ thống
                <br />
                <span className="text-[#0694FE]">Hiệu quả</span>
              </h1>
              <p className="text-lg text-white/90 max-w-[85%] mb-6 drop-shadow leading-relaxed">
                Truy cập bảng điều khiển quản trị để quản lý toàn bộ hệ thống giáo dục một cách chuyên nghiệp.
              </p>
              <div className="flex items-center space-x-4 text-white/80">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-[#0694FE]" />
                  <span className="text-sm">Nền tảng an toàn</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-[#0694FE]" />
                  <span className="text-sm">Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden w-full bg-gradient-to-r from-[#0694FE] to-[#1E293B] p-6 pt-16">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-2">Quản trị viên</h1>
            <p className="text-white/90 text-sm">
              Đăng nhập để quản lý hệ thống
            </p>
          </div>
        </div>

        {/* Right - Login form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#F1F1E6] relative min-h-0 flex-1">
          <div className="w-full max-w-[90%] lg:max-w-[85%] px-4 lg:px-8 py-6 lg:py-8 flex flex-col items-center overflow-y-auto">
            {/* Profile image */}
            <div className="relative mb-6 lg:mb-8 group">
              <Image
                src="https://www.bing.com/th/id/OIP.r4JwfITtHQW0PmuLMIvJQAHaFg?w=243&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.1&pid=3.1&rm=2"
                width={120}
                height={120}
                alt="Admin Avatar"
                className="h-16 w-16 lg:h-[6vw] lg:w-[6vw] lg:min-h-[64px] lg:min-w-[64px] lg:max-h-[96px] lg:max-w-[96px] object-cover rounded-full shadow-xl ring-4 ring-[#0694FE]/20 transition-all duration-300 group-hover:shadow-2xl group-hover:ring-[#0694FE]/30"
              />
              <div className="absolute inset-0 rounded-full bg-[#0694FE]/10 group-hover:bg-[#0694FE]/20 transition-all duration-300" />
            </div>

            <h2 className="text-xl lg:text-[2.2vw] lg:min-text-xl font-bold text-[#0694FE] mb-6 lg:mb-8 hidden lg:block">
              Đăng nhập quản trị
            </h2>

            <form
              onSubmit={handleLogin}
              className="space-y-4 lg:space-y-6 w-full max-w-sm lg:max-w-none"
            >
              {/* Email input */}
              <div className="space-y-2">
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400 group-focus-within:text-[#0694FE] transition-colors duration-200" />
                  <Input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    className={`pl-10 lg:pl-11 h-11 lg:h-12 bg-white/80 border-2 rounded-lg lg:rounded-xl transition-all duration-200 focus:ring-2 focus:ring-[#0694FE]/20 focus:border-[#0694FE] hover:border-gray-300 ${
                      emailError
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200"
                    }`}
                  />
                </div>
                {emailError && (
                  <p className="text-red-500 text-sm ml-1 animate-fadeIn">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password input */}
              <div className="space-y-2">
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400 group-focus-within:text-[#0694FE] transition-colors duration-200" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    className={`pl-10 lg:pl-11 pr-10 lg:pr-11 h-11 lg:h-12 bg-white/80 border-2 rounded-lg lg:rounded-xl transition-all duration-200 focus:ring-2 focus:ring-[#0694FE]/20 focus:border-[#0694FE] hover:border-gray-300 ${
                      passwordError
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 lg:w-5 lg:h-5" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-red-500 text-sm ml-1 animate-fadeIn">
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Forgot password link */}
              <div className="w-full text-right">
                <button
                  type="button"
                  className="text-[#0694FE] hover:text-[#1E293B] text-sm font-medium transition-colors duration-200 hover:underline"
                  onClick={() => setForgotOpen(true)}
                >
                  Quên mật khẩu?
                </button>
              </div>

              {/* Login button */}
              <Button
                type="submit"
                className="w-full h-11 lg:h-12 bg-[#0694FE] hover:bg-[#1E293B] text-white font-semibold rounded-lg lg:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loadingLogin || !!emailError || !!passwordError}
              >
                {loadingLogin ? (
                  <div className="flex items-center space-x-2">
                    <svg
                      className="animate-spin h-4 w-4 lg:h-5 lg:w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    <span className="text-sm lg:text-base">
                      Đang đăng nhập...
                    </span>
                  </div>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 lg:my-8 text-center w-full">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#F1F1E6] text-gray-500 font-medium">
                    Hệ thống quản lý giáo dục
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <Dialog open={loginError} onOpenChange={setLoginError}>
        <DialogContent className="max-w-sm rounded-2xl border-0 shadow-2xl">
          <DialogHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <DialogTitle className="text-red-600 text-lg font-semibold">
              Đăng nhập thất bại
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại thông tin và thử lại.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setLoginError(false)}
            className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white rounded-xl h-11 font-medium transition-all duration-300"
          >
            Thử lại
          </Button>
        </DialogContent>
      </Dialog>

      {/* Forgot Password Modal */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="max-w-md rounded-2xl border-0 shadow-2xl">
          <DialogHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-[#0694FE]/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-[#0694FE]" />
            </div>
            <DialogTitle className="text-gray-900 text-xl font-semibold">
              Đặt lại mật khẩu
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Nhập địa chỉ email, chúng tôi sẽ gửi mật khẩu mới cho bạn.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-6 mt-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Nhập địa chỉ email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                disabled={loadingForgot}
                className="pl-11 h-11 bg-gray-50 border-gray-200 rounded-xl focus:border-[#0694FE] focus:ring-[#0694FE]/20"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-[#0694FE] hover:bg-[#1E293B] text-white rounded-xl font-medium transition-all duration-300"
              disabled={loadingForgot}
            >
              {loadingForgot ? (
                <div className="flex items-center space-x-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  <span>Đang gửi...</span>
                </div>
              ) : (
                "Gửi mật khẩu mới"
              )}
            </Button>
          </form>
          {forgotSent && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">
                  Gửi email thành công!
                </span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Vui lòng kiểm tra hộp thư để nhận mật khẩu mới.
              </p>
            </div>
          )}
          {forgotError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="text-red-800 font-medium">Lỗi</span>
              </div>
              <p className="text-red-700 text-sm mt-1">{forgotError}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Loading Modal */}
      <Dialog open={loadingLogin}>
        <DialogContent className="max-w-xs border-0 shadow-2xl rounded-2xl">
          <DialogTitle className="sr-only">Đang đăng nhập</DialogTitle>
          <div className="flex flex-col items-center py-8">
            <div className="relative">
              <svg
                className="animate-spin h-12 w-12 text-cyan-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-cyan-700 font-semibold text-lg">
                Đang đăng nhập
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Vui lòng chờ trong giây lát...
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
