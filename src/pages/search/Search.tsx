import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCarsList } from '../../api/carService'; // Correctly import the function

// Define the type for a car object
interface Car {
    id: string;
    brand: string;
    model: string;
    year: number;
    pricePerDay: number;
    imageUrl: string;
}

const Search: React.FC = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCars = async () => {
            setIsLoading(true);
            try {
                const carList = await getCarsList();
                setCars(carList);
            } catch (error) {
                console.error("Failed to fetch cars:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCars();
    }, []);

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold mb-8">Find Your Ride</h1>
            
            {/* Search Filters can be added here */}

            {isLoading ? (
                <p className="text-center">Loading vehicles...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cars.length > 0 ? (
                        cars.map(car => (
                            <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                                <img src={car.imageUrl} alt={`${car.brand} ${car.model}`} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold">{car.brand} {car.model} ({car.year})</h3>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-lg font-bold text-purple-600">${car.pricePerDay}/day</span>
                                        <Link to={`/car/${car.id}`} className="font-semibold text-purple-600 hover:text-purple-800">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No available cars found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;

