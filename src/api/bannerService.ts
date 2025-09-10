import apiClient from './apiClient';

// واجهة لبيانات الإعلان عند الإنشاء
export interface AdvertisementCreateDto {
    title: string;
    description?: string;
    image: File;
    targetUrl?: string;
    position: number; // AdPosition Enum
    startDate: string;
    endDate: string;
}

// واجهة لبيانات الإعلان المعروض
export interface AdvertisementDto {
    id: string;
    title: string;
    description: string;
    imagePath: string;
    targetUrl: string;
    position: number;
    startDate: string;
    endDate: string;
    status: number; // AdStatus Enum
}

// واجهة لبيانات اللافتة (Banner) المعروضة في الصفحة الرئيسية
export interface BannerDto {
    id: string;
    title: string;
    imageUrl: string;
    linkUrl: string;
}

/**
 * دالة لإنشاء طلب إعلان جديد
 */
export const createAdvertisement = async (data: AdvertisementCreateDto): Promise<any> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('image', data.image);
    formData.append('position', data.position.toString());
    formData.append('startDate', data.startDate);
    formData.append('endDate', data.endDate);
    if (data.description) formData.append('description', data.description);
    if (data.targetUrl) formData.append('targetUrl', data.targetUrl);

    // ملاحظة: يتم إرسال البيانات كـ multipart/form-data بسبب وجود ملف الصورة
    const response = await apiClient.post('/api/Banner/create-banner', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

/**
 * دالة لجلب اللافتات (Banners) النشطة لعرضها في الموقع
 */
export const getBanners = async (): Promise<BannerDto[]> => {
    const response = await apiClient.get('/api/Banner/get-banners');
    return response.data;
};

/**
 * دالة (للأدمن) لجلب الإعلانات التي تنتظر المراجعة
 */
export const getPendingAdvertisements = async (): Promise<AdvertisementDto[]> => {
    const response = await apiClient.get('/api/Banner/advertisements');
    return response.data;
};

/**
 * دالة (للأدمن) للموافقة على إعلان أو رفضه
 */
export const handleAdvertisement = async (adId: string, isApproved: boolean): Promise<any> => {
    const response = await apiClient.post(`/api/Banner/advertisements/${adId}/handle`, { isApproved });
    return response.data;
};
