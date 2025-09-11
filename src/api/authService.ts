import apiClient from "./apiClient";

// تعريف أنواع البيانات للمستخدم بناءً على ما هو موجود في AuthContext
interface User {
  id: string;
  fullName: string;
  email: string;
  userType: "user" | "provider" | "admin";
}

// تعريف أنواع البيانات للمدخلات والمخرجات
interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterPayload {
  FullName: string;
  Email: string;
  Password: string;
  UserType: number;
  Phone: string;
  CityId: string;
  CompanyName?: string;
  EmailCodeNo?: string;
  IsEmailConfirmed?: boolean;
  IsCompany?: boolean;
  Address?: string;
}

/**
 * إرسال طلب تسجيل الدخول إلى الـ API.
 * @param credentials بيانات الدخول (الإيميل وكلمة المرور).
 * @returns Promise يحتوي على بيانات المستخدم والـ token.
 */
export const login = async (
  credentials: LoginPayload
): Promise<LoginResponse> => {
  try {
    console.log('Login Request:', {
      email: credentials.email,
      rememberMe: credentials.rememberMe
    });

    const { data } = await apiClient.post("/api/Account/login", {
      email: credentials.email,
      password: credentials.password,
      rememberMe: credentials.rememberMe
    });

    console.log('Raw API Response:', data);

    // Check if the response indicates a failed login
    if (!data.success && data.message) {
      throw new Error(data.message);
    }

    // Check if we have the necessary data
    if (!data.token || !data.user) {
      throw new Error('Invalid response format from server');
    }

    const response: LoginResponse = {
      token: data.token,
      user: {
        id: data.user.id || data.user.userId,
        fullName: data.user.fullName || data.user.name,
        email: data.user.email,
        userType: (data.user.userType || 'user').toLowerCase() as "user" | "provider" | "admin"
      }
    };

    console.log('Transformed Response:', response);
    return response;
  } catch (error: any) {
    console.error('Login Error:', error.response?.data || error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * إرسال طلب تسجيل حساب جديد إلى الـ API.
 * @param userData بيانات المستخدم الجديد.
 * @returns Promise يحتوي على استجابة الـ API.
 */
export const register = async (userData: RegisterPayload) => {
  const formData = new FormData();

  // Append all fields to FormData
  Object.entries(userData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  const { data } = await apiClient.post("/api/Account/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const forgotPassword = async (email: string) => {
  const { data } = await apiClient.post("/api/Account/forgot-password", {
    email,
    baseLink: `${window.location.origin}/reset-password`,
    language: 0,
  });
  return data;
};

export const resetPassword = async (payload: { email: string; token: string; newPassword: string }) => {
  const { data } = await apiClient.post("/api/Account/reset-password", payload);
  return data;
};

export const changePassword = async (payload: { currentPassword: string; newPassword: string }) => {
    const { data } = await apiClient.post("/api/Account/change-password", payload);
    return data;
};

export const sendEmailConfirmation = async (email: string) => {
  const { data } = await apiClient.post(`/api/Account/send-email-confirmation?email=${email}&language=0`);
  return data;
};

export const confirmEmail = async (email: string, code: string) => {
  const { data } = await apiClient.get(`/api/Account/confirm-email?email=${email}&code=${code}`);
  return data;
};
