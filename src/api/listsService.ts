import apiClient from './apiClient';

export interface BasicListDto {
  id: number;
  name: string;
}

export const getCities = async (): Promise<BasicListDto[]> => {
  const response = await apiClient.get('/api/Lists/GetCities');
  return response.data;
};

export const getCarTypes = async (): Promise<BasicListDto[]> => {
  const response = await apiClient.get('/api/Lists/GetCarTypesList');
  return response.data;
};

// alias: اسم إضافي يصدّر نفس الدالة بالاسم اللي يستورده CarForm.tsx
export const getCarTypesList = getCarTypes;

export const getCarFeatures = async (): Promise<BasicListDto[]> => {
  const response = await apiClient.get('/api/Lists/GetCarFeatures');
  return response.data;
};

export const getDocumentsTypes = async (): Promise<BasicListDto[]> => {
  const response = await apiClient.get('/api/Lists/GetDocumentsTypes');
  return response.data;
};

export const getAdvPostionsList = async (): Promise<BasicListDto[]> => {
  try {
    const response = await apiClient.get('/api/Lists/GetAdvPostionsList');
    return response.data;
  } catch (error) {
    console.error("Error fetching advertisement positions:", error);
    throw error;
  }
};
