import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const Home: React.FC = () => {
    // Mock data for featured items
    const featuredVehicles = [
        { id: 1, name: 'Luxury Sedan', description: 'Perfect for city tours and business travel.', price: 80, imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60' },
        { id: 2, name: 'H1 Mini Bus', description: 'Ideal for group travel and family vacations.', price: 150, imageUrl: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60' },
        { id: 3, name: '4x4 SUV', description: 'Explore deserts and mountains with a powerful vehicle.', price: 120, imageUrl: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60' },
    ];

    return (
        <div>
            {/* Hero Section */}
            <section
                className="relative h-[600px] bg-cover bg-center text-white flex items-center justify-center"
                style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')" }}>
                <div className="text-center z-10 p-4">
                    <h1 className="text-5xl md:text-6xl font-black mb-4">Your Journey Starts Here</h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
                        The easiest way to book trusted vehicles and professional tour guides for your next adventure.
                    </p>
                    <Link to="/search">
                        <Button size="lg">Start Exploring</Button>
                    </Link>
                </div>
            </section>

            {/* Featured Vehicles Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">Featured Vehicles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredVehicles.map((vehicle) => (
                            <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
                                <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold">{vehicle.name}</h3>
                                    <p className="text-gray-600 mt-2">{vehicle.description}</p>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-lg font-bold text-purple-600">${vehicle.price}/day</span>
                                        <Link to={`/car/${vehicle.id}`} className="font-semibold text-purple-600 hover:text-purple-800">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

