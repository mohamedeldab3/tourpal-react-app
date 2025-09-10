import apiClient from './axios';

export const getBanners = async () => {
  const response = await apiClient.get('/Banner/get-banners');
  return response.data;
};

export const createBanner = async (bannerData: FormData) => {
    // Using FormData for image uploads
    const response = await apiClient.post('/Banner/create-banner', bannerData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};
