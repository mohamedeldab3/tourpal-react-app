import apiClient from './apiClient';

// ... (الواجهات السابقة: TourGuide, TourGuideDetails)
export interface TourGuide {
    id: string;
    fullName: string;
    city: string;
    experienceYears: number;
    languages: string[];
    profilePictureUrl?: string;
}

export interface TourGuideDetails extends TourGuide {
    bio: string;
}

// واجهة جديدة لبيانات طلب المرشد السياحي
export interface RequestTourGuidePayload {
    tourGuideId: string;
    startDate: string;
    endDate: string;
    requestNotes: string;
    requiredLanguageId: number; // ملاحظة: ה-API يتطلب ID للغة، سنستخدم قيمة افتراضية الآن
}


// ... (الدوال السابقة: getTourGuidesList, getTourGuideDetails)
export const getTourGuidesList = async (): Promise<TourGuide[]> => {
    try {
        const response = await apiClient.get('/api/TourismCompany/tour-guide-list');
        return response.data; 
    } catch (error) {
        console.error('Error fetching tour guides list:', error);
        throw error;
    }
};

export const getTourGuideDetails = async (id: string): Promise<TourGuideDetails> => {
    try {
        const response = await apiClient.get(`/api/TourismCompany/tour-guide-details/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching details for tour guide ${id}:`, error);
        throw error;
    }
};


/**
 * دالة جديدة لإرسال طلب حجز لمرشد سياحي
 * @param {RequestTourGuidePayload} payload - بيانات الطلب
 * @returns {Promise<any>} رد الـ API
 */
export const requestTourGuide = async (payload: RequestTourGuidePayload): Promise<any> => {
    try {
        const response = await apiClient.post('/api/TourismCompany/request-tour-guide', payload);
        return response.data;
    } catch (error) {
        console.error('Error creating tour guide request:', error);
        throw error;
    }
};

