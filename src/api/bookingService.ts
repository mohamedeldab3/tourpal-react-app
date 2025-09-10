import apiClient from './apiClient';

// ... existing Booking interface ...
export interface Booking {
  id: string;
  carName: string; 
  provider: string; 
  date: string; 
  status: 'Upcoming' | 'Completed' | 'Cancelled'; 
}

// واجهة لنوع بيانات طلب الحجز
interface BookingRequestPayload {
  carId: string;
  startDate: string;
  endDate: string;
  requestNotes?: string;
}

/**
 * جلب قائمة حجوزات المستخدم الحالي.
 * Corresponds to: GET /api/TourismCompany/rental-requests
 */
export const getUserBookings = async (): Promise<Booking[]> => {
// ... existing getUserBookings function code ...
    const { data } = await apiClient.get('/TourismCompany/rental-requests');
    return data.map((item: any) => ({
        id: item.requestId,
        carName: `${item.car.brand} ${item.car.model}`,
        provider: item.provider.name,
        date: item.startDate,
        status: item.status 
    }));
};

/**
 * إنشاء طلب حجز جديد.
 * Corresponds to: POST /api/TourismCompany/car-rental-requests
 */
export const createBookingRequest = async (payload: BookingRequestPayload): Promise<any> => {
  const { data } = await apiClient.post('/TourismCompany/car-rental-requests', payload);
  return data;
};

