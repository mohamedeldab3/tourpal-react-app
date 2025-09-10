import apiClient from './apiClient';

// تعريف أنواع البيانات للمستخدم بناءً على ما هو موجود في AuthContext
interface User {
  id: string;
  fullName: string;
  email: string;
  userType: 'user' | 'provider' | 'admin';
}

// تعريف أنواع البيانات للمدخلات والمخرجات
interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  userType: 'user' | 'provider';
}

/**
 * إرسال طلب تسجيل الدخول إلى الـ API.
 * @param credentials بيانات الدخول (الإيميل وكلمة المرور).
 * @returns Promise يحتوي على بيانات المستخدم والـ token.
 */
export const login = async (credentials: LoginPayload): Promise<LoginResponse> => {
  // لاحظ أننا نستخدم apiClient بدلاً من axios مباشرة
  // ولا نحتاج لكتابة الرابط الكامل، فقط الـ endpoint
  const { data } = await apiClient.post('/Account/login', credentials);
  return data;
};

/**
 * إرسال طلب تسجيل حساب جديد إلى الـ API.
 * @param userData بيانات المستخدم الجديد.
 * @returns Promise يحتوي على استجابة الـ API.
 */
export const register = async (userData: RegisterPayload) => {
  const { data } = await apiClient.post('/Account/register', userData);
  return data;
};
