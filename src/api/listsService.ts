import apiClient from './axios';

// Example for fetching cities
export const getCities = async () => {
  const response = await apiClient.get('/Lists/GetCities');
  return response.data;
};

// Example for fetching car types
export const getCarTypes = async () => {
    const response = await apiClient.get('/Lists/GetCarTypesList');
    return response.data;
};
