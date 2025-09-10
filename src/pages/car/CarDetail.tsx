import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCarDetails } from '../../api/carService';
import { createBookingRequest } from '../../api/bookingService'; // استيراد دالة الحجز
import type { Car } from '../../api/carService';
import { useAuth } from '../../context/AuthContext'; // للتحقق من تسجيل الدخول
import Button from '../../components/ui/Button';
import BookingModal from '../../components/booking/BookingModal'; // استيراد المكون الجديد

const CarDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth(); // جلب حالة تسجيل الدخول

    const [car, setCar] = useState<Car | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    useEffect(() => {
        // ... existing useEffect code ...
        if (id) {
            const fetchCarDetails = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const data = await getCarDetails(id);
                    setCar(data);
                } catch (err) {
                    setError('Failed to load car details. Please try again later.');
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchCarDetails();
        }
    }, [id]);

    const handleBookingSubmit = async (details: { startDate: string; endDate: string; requestNotes: string }) => {
        if (!id) return;
        try {
            await createBookingRequest({
                carId: id,
                ...details,
            });
            setIsBookingModalOpen(false);
            alert('Your booking request has been sent successfully!');
            navigate('/dashboard/user'); // توجيه المستخدم لصفحة حجوزاته
        } catch (error) {
            console.error("Booking failed:", error);
            alert("Failed to send booking request. Please try again.");
        }
    };

    const handleBookNowClick = () => {
        if (!isAuthenticated) {
            navigate('/login'); // إذا لم يكن مسجلاً، اذهب لصفحة الدخول
        } else {
            setIsBookingModalOpen(true); // إذا كان مسجلاً، افتح نافذة الحجز
        }
    };

    // ... existing loading/error/not found checks ...
    if (isLoading) {
        return <div className="text-center py-20">Loading car details...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">{error}</div>;
    }

    if (!car) {
        return <div className="text-center py-20">Car not found.</div>;
    }

    const primaryImage = car.carImages?.find(img => img.isPrimary)?.imageUrl || 'https://placehold.co/1200x800?text=No+Image';

    return (
        <>
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div>
                        <img src={primaryImage} alt={`${car.brand} ${car.model}`} className="w-full h-auto object-cover rounded-lg shadow-lg" />
                    </div>

                    {/* Car Info and Booking */}
                    <div>
                        <h1 className="text-4xl font-extrabold mb-2">{car.brand} {car.model}</h1>
                        <p className="text-xl text-gray-500 mb-6">Year: {car.year}</p>
                        <p className="text-gray-700 mb-6">A great vehicle for your next trip.</p>
                        
                        <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                        <ul className="list-disc list-inside mb-8 grid grid-cols-2 gap-2 text-gray-600">
                            <li>Air Conditioning</li>
                            <li>GPS Navigation</li>
                            <li>Bluetooth</li>
                        </ul>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <div className="flex items-center justify-between">
                                <p className="text-3xl font-bold text-purple-600">${car.pricePerDay}<span className="text-lg font-normal text-gray-500">/day</span></p>
                                <Button size="lg" onClick={handleBookNowClick}>Book Now</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Render the modal */}
            {car && (
                <BookingModal
                    isOpen={isBookingModalOpen}
                    onClose={() => setIsBookingModalOpen(false)}
                    onSubmit={handleBookingSubmit}
                    carPricePerDay={car.pricePerDay}
                />
            )}
        </>
    );
};

export default CarDetail;

