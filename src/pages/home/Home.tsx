import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { getBanners, BannerDto } from '../../api/bannerService'; // استيراد خدمة اللافتات
import { getTourGuidesList, TourGuide } from '../../api/tourGuideService'; // استيراد خدمة المرشدين السياحيين

const Home: React.FC = () => {
    // Mock data for featured items
    const featuredVehicles = [
        { id: 1, name: 'Luxury Sedan', description: 'Perfect for city tours and business travel.', price: 80, imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60' },
        { id: 2, name: 'H1 Mini Bus', description: 'Ideal for group travel and family vacations.', price: 150, imageUrl: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60' },
        { id: 3, name: '4x4 SUV', description: 'Explore deserts and mountains with a powerful vehicle.', price: 120, imageUrl: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60' },
    ];

    // حالة اللافتات
    const [banners, setBanners] = useState<BannerDto[]>([]);
    // حالة المرشدين السياحيين
    const [tourGuides, setTourGuides] = useState<TourGuide[]>([]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const activeBanners = await getBanners();
                setBanners(activeBanners || []);
            } catch (error) {
                console.error("Could not fetch banners:", error);
            }
        };
        const fetchTourGuides = async () => {
            try {
                const guides = await getTourGuidesList();
                setTourGuides(guides || []);
            } catch (error) {
                console.error("Could not fetch tour guides:", error);
            }
        };
        fetchBanners();
        fetchTourGuides();
    }, []);

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

            {/* Banners Section - قسم الإعلانات (يعرض أول لافتة متاحة) */}
            {banners.length > 0 && (
                <section className="py-12 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <a href={banners[0].linkUrl || '#'} target="_blank" rel="noopener noreferrer">
                            <img
                                src={banners[0].imageUrl}
                                alt={banners[0].title || 'Banner'}
                                className="w-full h-auto rounded-lg shadow-lg object-cover"
                            />
                        </a>
                    </div>
                </section>
            )}

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

            {/* Featured Tour Guides Section */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">Featured Tour Guides</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tourGuides.slice(0, 3).map((guide) => (
                            <div key={guide.id} className="bg-white rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
                                <img src={guide.profilePictureUrl || 'https://via.placeholder.com/150'} alt={guide.fullName} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold">{guide.fullName}</h3>
                                    <p className="text-gray-600 mt-2">
                                        {guide.city}, {guide.experienceYears} years experience
                                    </p>
                                    <p className="text-gray-600">Languages: {guide.languages.join(', ')}</p>
                                    <div className="mt-4 flex justify-end">
                                        <Link to={`/tour-guide/${guide.id}`} className="font-semibold text-purple-600 hover:text-purple-800">
                                            View Profile
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link to="/tour-guide-search">
                            <Button size="lg">Explore All Tour Guides</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Other Services Section (Placeholder) */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-8">Discover Other Services</h2>
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-12">
                        From car rentals to unique local experiences, find everything you need for your perfect trip.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h3 className="text-xl font-semibold mb-2">Car Rentals</h3>
                            <p className="text-gray-600">Find the perfect vehicle for your journey.</p>
                            <Link to="/search" className="mt-4 inline-block text-purple-600 hover:text-purple-800 font-semibold">
                                Browse Cars &rarr;
                            </Link>
                        </div>
                        <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h3 className="text-xl font-semibold mb-2">Local Experiences</h3>
                            <p className="text-gray-600">Discover unique activities and tours.</p>
                            <Link to="/search" className="mt-4 inline-block text-purple-600 hover:text-purple-800 font-semibold">
                                Find Experiences &rarr;
                            </Link>
                        </div>
                        <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h3 className="text-xl font-semibold mb-2">Event Planning</h3>
                            <p className="text-gray-600">Organize your events with professional help.</p>
                            <Link to="/search" className="mt-4 inline-block text-purple-600 hover:text-purple-800 font-semibold">
                                Learn More &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;