// src/api/carService.ts

// This is a mock database to simulate real-world data.
let mockCars = [
    { id: 'car1', brand: 'Toyota', model: 'Land Cruiser', year: 2023, pricePerDay: 150, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1617083299395-4227835b3c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60' },
    { id: 'car2', brand: 'Ford', model: 'Explorer', year: 2022, pricePerDay: 120, status: 'Booked', imageUrl: 'https://images.unsplash.com/photo-1533106418989-88406e768d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60' },
    { id: 'car3', brand: 'Hyundai', model: 'H1', year: 2024, pricePerDay: 130, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60' },
];

// --- Mock API Functions ---

/**
 * Fetches all cars for the public search page.
 */
export const getCarsList = async () => {
    console.log('API Call: Fetching all cars for search page...');
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCars.filter(car => car.status === 'Available');
};


/**
 * Fetches cars for a specific provider's dashboard.
 */
export const getProviderCars = async () => {
    console.log('API Call: Fetching provider cars...');
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockCars];
};

/**
 * Simulates adding a new car.
 */
export const addCar = async (newCarData: { brand: string; model: string; year: number; pricePerDay: number }) => {
    console.log('API Call: Adding a new car...', newCarData);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newCar = {
        id: `car${Math.random()}`, // Generate a random ID
        ...newCarData,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60' // Default image
    };

    mockCars.push(newCar);
    return newCar;
};

/**
 * Simulates deleting a car by its ID.
 */
export const deleteCar = async (carId: string) => {
    console.log(`API Call: Deleting car with ID ${carId}...`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    mockCars = mockCars.filter(car => car.id !== carId);
    return { success: true };
};

