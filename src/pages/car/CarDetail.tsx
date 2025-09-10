import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import { getCarDetails } from '../../api/carService'; // This would be the real API call
import Button from '../../components/ui/Button';

// Mock API function for demonstration
const getMockCarDetails = async (id: string) => {
    console.log(`Fetching details for car ID: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    // Return mock data
    return {
        id,
        brand: 'Toyota',
        model: 'Land Cruiser',
        year: 2023,
        pricePerDay: 150,
        description: 'A reliable and powerful SUV perfect for both city driving and off-road adventures. Features spacious seating, advanced safety systems, and a premium sound system.',
        imageUrl: 'https://images.unsplash.com/photo-1617083299395-4227835b3c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth', '4-Wheel Drive'],
    };
};


// Define type for car details
interface CarDetails {
    id: string;
    brand: string;
    model: string;
    year: number;
    pricePerDay: number;
    description: string;
    imageUrl: string;
    features: string[];
}

const CarDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [car, setCar] = useState<CarDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const fetchCarDetails = async () => {
                setIsLoading(true);
                const data = await getMockCarDetails(id);
                setCar(data);
                setIsLoading(false);
            };
            fetchCarDetails();
        }
    }, [id]);

    if (isLoading) {
        return <div className="text-center py-20">Loading car details...</div>;
    }

    if (!car) {
        return <div className="text-center py-20">Car not found.</div>;
    }

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <div>
                    <img src={car.imageUrl} alt={`${car.brand} ${car.model}`} className="w-full h-auto object-cover rounded-lg shadow-lg" />
                </div>

                {/* Car Info and Booking */}
                <div>
                    <h1 className="text-4xl font-extrabold mb-2">{car.brand} {car.model}</h1>
                    <p className="text-xl text-gray-500 mb-6">Year: {car.year}</p>
                    <p className="text-gray-700 mb-6">{car.description}</p>
                    
                    <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                    <ul className="list-disc list-inside mb-8 grid grid-cols-2 gap-2 text-gray-600">
                        {car.features.map(feature => <li key={feature}>{feature}</li>)}
                    </ul>

                    <div className="bg-gray-50 p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                            <p className="text-3xl font-bold text-purple-600">${car.pricePerDay}<span className="text-lg font-normal text-gray-500">/day</span></p>
                            <Button size="lg">Book Now</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetail;

