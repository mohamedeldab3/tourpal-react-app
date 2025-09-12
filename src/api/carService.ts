// @ts-nocheck

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
    status?: string;
    carImages?: CarImage[];
    features?: string[];
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

import { db } from '../data/staticDb'; // Import the static database

export const getCarsList = async (): Promise<CarListItem[]> => {
    console.log('Static getCarsList called');
    return Promise.resolve(db.cars.map(car => ({
        id: car.id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        pricePerDay: car.pricePerDay,
        carImages: car.carImages,
    })));
};

export const getCarDetails = async (id: string): Promise<Car> => {
    console.log(`Static getCarDetails called for id: ${id}`);
    const car = db.cars.find(c => c.id === id);
    if (car) {
        return Promise.resolve(car);
    }
    return Promise.reject(new Error('Car not found'));
};

export const getProviderCars = async (): Promise<Car[]> => {
    console.log('Static getProviderCars called');
    // For demo, return all static cars as if they belong to the provider
    return Promise.resolve(db.cars);
};

export const addCar = async (carData: NewCarData): Promise<Car> => {
    console.log('Static addCar called with:', carData);
    return new Promise(resolve => {
        setTimeout(() => {
            const newCar: Car = {
                id: `car-${db.cars.length + 1}`, // Generate a new ID
                brand: carData.brand,
                model: carData.model,
                year: carData.year,
                pricePerDay: carData.pricePerDay,
                description: carData.description,
                status: 'Available',
                carImages: [], // No images for new car in static demo
                features: [], // No features for new car in static demo
            };
            db.cars.push(newCar);
            console.log('Car added (simulated) and added to DB:', newCar);
            resolve(newCar);
        }, 500);
    });
};

export const deleteCar = async (id: string): Promise<void> => {
    console.log(`Static deleteCar called for id: ${id}`);
    return new Promise(resolve => {
        setTimeout(() => {
            const initialLength = db.cars.length;
            db.cars = db.cars.filter(car => car.id !== id);
            if (db.cars.length < initialLength) {
                console.log(`Car ${id} deleted (simulated).`);
            } else {
                console.log(`Car ${id} not found for deletion (simulated).`);
            }
            resolve();
        }, 500);
    });
};