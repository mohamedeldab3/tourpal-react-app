import axios from "axios";

/**
 * إنشاء instance مركزي لـ Axios مع إعدادات موحدة للمشروع.
 */
const apiClient = axios.create({
  // جلب رابط الـ API الأساسي من ملف متغيرات البيئة
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to remove Content-Type header when FormData is being sent
apiClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"]; // Let the browser set it
  }
  return config;
});

/**
 * Interceptor لإضافة Token المصادقة تلقائيًا إلى Header كل طلب.
 * هذا يضمن أن الطلبات للمسارات المحمية ستكون صالحة.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("tourpal_token");
    if (token) {
      // إضافة الـ Token كـ Bearer Token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor للتعامل مع الأخطاء العامة على مستوى التطبيق.
 * المثال الأهم هو خطأ 401 Unauthorized، والذي يعني أن الـ Token غير صالح.
 */
apiClient.interceptors.response.use(
  (response) => {
    // في حال كانت الاستجابة ناجحة (status 2xx)، قم بإرجاعها مباشرة
    return response;
  },
  (error) => {
    // في حال وجود خطأ في الاستجابة
    if (error.response && error.response.status === 401) {
      // إذا كان الخطأ 401، فهذا يعني أن المستخدم غير مصرح له بالوصول
      // (الـ Token منتهي الصلاحية أو غير صحيح)
      // قم بحذف بيانات المستخدم من localStorage
      localStorage.removeItem("tourpal_user");
      localStorage.removeItem("tourpal_token");

      // أعد توجيه المستخدم إلى صفحة تسجيل الدخول
      // هذا يضمن أمان التطبيق
      window.location.href = "/login";
    }
    // إرجاع الخطأ ليتم التعامل معه في المكان الذي تم استدعاء الـ API منه
    return Promise.reject(error);
  }
);

export default apiClient;
