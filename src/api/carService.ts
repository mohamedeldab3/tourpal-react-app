import apiClient from './apiClient';

// Define the types that will be used across the application
export interface CarImage {
    id: string;
    imageUrl: string;
    isPrimary: boolean;
}

export interface Car {
    id: string;
    brand: string;
    model: string;
    year: number;
    pricePerDay: number;
    description: string;
    status?: string; // Added status as it is used in the dashboard
    carImages?: CarImage[];
    features?: string[];
    // Add other properties from the API as needed
}

export interface CarListItem {
    id: string;
    brand: string;
    model: string;
    year: number;
    pricePerDay: number;
    carImages?: CarImage[];
}

export interface NewCarData {
    brand: string;
    model: string;
    year: number;
    pricePerDay: number;
    cityId: string;
    carTypeId: string;
    capacity: number;
    plateNumber: string;
    description: string;
    featureIds: number[];
}


// ✅ FIX: Added 'export' before each function to make them available for import.

/**
 * Fetches a list of cars for public view (like the search page).
 */
export const getCarsList = async (): Promise<CarListItem[]> => {
    const response = await apiClient.get('/api/TourismCompany/cars-list');
    
    // Defensive check for the response structure
    if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
    }
    
    // Handle cases where the data might be directly in the response
    if (Array.isArray(response.data)) {
        return response.data;
    }

    // If the structure is unexpected, log it and return an empty array to prevent crashing
    console.error("Unexpected API response structure for getCarsList:", response.data);
    return [];
};

/**
 * Fetches detailed information for a single car.
 */
export const getCarDetails = async (id: string): Promise<Car> => {
    const response = await apiClient.get(`/api/TourismCompany/cars/${id}`);
    return response.data;
};

/**
 * Fetches the list of cars belonging to the currently logged-in provider.
 */
export const getProviderCars = async (): Promise<Car[]> => {
    const response = await apiClient.get('/api/TransProvider/cars');
    return response.data;
};

/**
 * Adds a new car for a provider.
 */
export const addCar = async (carData: NewCarData): Promise<Car> => {
    const response = await apiClient.post('/api/TransProvider/cars', carData);
    return response.data;
};

/**
 * Deletes a car by its ID.
 */
export const deleteCar = async (id: string): Promise<void> => {
    await apiClient.delete(`/api/TransProvider/cars/${id}`);
};