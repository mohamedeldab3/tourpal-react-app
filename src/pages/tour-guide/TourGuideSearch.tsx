import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTourGuidesList, TourGuide } from '../../api/tourGuideService';

const TourGuideSearch: React.FC = () => {
    const [guides, setGuides] = useState<TourGuide[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGuides = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const guideList = await getTourGuidesList();
                setGuides(guideList);
            } catch (err) {
                setError('Could not load tour guides. Please try again later.');
                console.error("Failed to fetch guides:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGuides();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return <p className="text-center text-gray-500">Loading guides...</p>;
        }
        if (error) {
            return <p className="text-center text-red-500">{error}</p>;
        }
        if (guides.length === 0) {
            return <p className="text-center text-gray-500">No tour guides found at the moment.</p>;
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {guides.map(guide => (
                    <div key={guide.id} className="bg-white rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
                        <img 
                            src={guide.profilePictureUrl || `https://placehold.co/400x400/E2E8F0/4A5568?text=${guide.fullName.charAt(0)}`} 
                            alt={guide.fullName} 
                            className="w-full h-64 object-cover" 
                        />
                        <div className="p-5">
                            <h3 className="text-xl font-bold text-gray-800">{guide.fullName}</h3>
                            <p className="text-gray-600 mt-1">{guide.city}</p>
                            <p className="text-sm text-gray-500 mt-2">{guide.experienceYears} years of experience</p>
                            <div className="mt-4">
                                <Link to={`/guide/${guide.id}`} className="font-semibold text-purple-600 hover:text-purple-800 transition-colors">
                                    View Profile →
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
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Find a Professional Tour Guide</h1>
            {/* يمكن إضافة فلاتر البحث هنا مستقبلاً */}
            <div className="mt-8">
                {renderContent()}
            </div>
        </div>
    );
};

export default TourGuideSearch;
