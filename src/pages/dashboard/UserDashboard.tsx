import React, { useState, useEffect } from 'react';
import { getUserBookings } from '../../api/bookingService'; // استدعاء الدالة الحقيقية
import type { Booking } from '../../api/bookingService'; // استيراد النوع
import Button from '../../components/ui/Button';

// تم حذف الدالة الوهمية والنوع المحلي

const UserDashboard: React.FC = () => {
    const [allBookings, setAllBookings] = useState<Booking[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed' | 'Cancelled'>('Upcoming');

    // Effect to fetch all bookings once when the component mounts
    useEffect(() => {
        const fetchBookings = async () => {
            setIsLoading(true);
            try {
                const response = await getUserBookings();
                setAllBookings(response);
            } catch (error) {
                console.error("Failed to fetch user bookings:", error);
                // Handle error state in UI
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookings();
    }, []);

    // Effect to filter the bookings whenever the active tab or the main bookings list changes
    useEffect(() => {
        setFilteredBookings(allBookings.filter(booking => booking.status === activeTab));
    }, [activeTab, allBookings]);


  return (
    <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

        {/* Tabs for filtering bookings */}
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                 <button onClick={() => setActiveTab('Upcoming')} className={`${activeTab === 'Upcoming' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}>
                    Upcoming
                </button>
                 <button onClick={() => setActiveTab('Completed')} className={`${activeTab === 'Completed' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}>
                    Completed
                </button>
                 <button onClick={() => setActiveTab('Cancelled')} className={`${activeTab === 'Cancelled' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}>
                    Cancelled
                </button>
            </nav>
        </div>

        {/* Conditional rendering based on loading state */}
        {isLoading ? (
            <div className="text-center py-10">
                <p>Loading your bookings...</p>
            </div>
        ) : (
            <div className="space-y-4">
                {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                        <div key={booking.id} className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <p className="font-bold text-lg text-gray-800">{booking.carName}</p>
                                <p className="text-sm text-gray-600">with {booking.provider}</p>
                                <p className="text-sm text-gray-500 mt-1">Date: {new Date(booking.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-2 sm:mt-0">
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    booking.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                                    booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {booking.status}
                                </span>
                                {booking.status === 'Upcoming' && (
                                    <Button size="sm" variant="secondary">View Details</Button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <span className="material-symbols-outlined text-5xl text-gray-400">event_busy</span>
                        <p className="mt-4 font-semibold">No bookings found</p>
                        <p className="text-gray-500">You don't have any {activeTab.toLowerCase()} bookings.</p>
                    </div>
                )}
            </div>
        )}
    </div>
  );
};

export default UserDashboard;
