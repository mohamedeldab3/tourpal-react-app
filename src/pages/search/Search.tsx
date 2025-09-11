import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCarsList } from '../../api/carService';
import type { CarListItem } from '../../api/carService'; // Import the type

const Search: React.FC = () => {
    const [cars, setCars] = useState<CarListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCars = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const carList = await getCarsList();
                setCars(carList);
            } catch (err) {
                console.error("Failed to fetch cars:", err);
                setError("Could not load vehicles. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCars();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return <p className="text-center text-gray-500">Loading vehicles...</p>;
        }

        if (error) {
            return <p className="text-center text-red-500">{error}</p>;
        }

        if (cars.length === 0) {
            return <p className="text-center text-gray-500">No available cars found.</p>;
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cars.map(car => (
                    <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                        <img 
                            src={car.carImages?.[0]?.imageUrl || 'https://placehold.co/600x400/EEE/31343C?text=No+Image'} 
                            alt={`${car.brand} ${car.model}`} 
                            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
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
                ))}
            </div>
        );
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold mb-8">Find Your Ride</h1>
            
            {/* Search Filters will be added here */}

            <div className="mt-8">
                {renderContent()}
            </div>
        </div>
    );
};

export default Search;

