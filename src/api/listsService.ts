import apiClient from './apiClient';

export interface BasicListDto {
  id: number;
  name: string;
}

export interface RequiredDoc {
  id: number;
  name: string;
  isMandatory: boolean;
}

export const getCities = async (lang: number): Promise<BasicListDto[]> => {
  const response = await apiClient.get(`/api/Lists/GetCities?lang=${lang}`);
  return response.data;
};

const userTypeTranslations: { [key: string]: string } = {
  "شركة نقل سياحي": "Tourism Transport Company",
  "مالك سيارة": "Car Owner",
  "مرشد سياحي": "Tour Guide",
  "شركة سياحه": "Tourism Company",
  "شركة سياحة": "Tourism Company", // Added with 'ة' for robustness
  "مستخدم عادي": "Regular User",
  "مزود خدمة": "Service Provider",
  "مشرف نظام": "System Admin",
};

export const getUserTypes = async (): Promise<BasicListDto[]> => {
  const response = await apiClient.get('/api/Lists/GetUserTypes');
  const translatedUserTypes = response.data
    .map((userType: BasicListDto) => ({
      ...userType,
      name: userTypeTranslations[userType.name] || userType.name,
    }))
    .filter((userType: BasicListDto) => userType.name !== 'System Admin');
  return translatedUserTypes;
};

export const getRequiredDocumentsPerUserType = async (userType: number, lang: number = 0): Promise<RequiredDoc[]> => {
  const response = await apiClient.get(`/api/Lists/RequiredDocumentsPerUserType?userType=${userType}&lang=${lang}`);
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
