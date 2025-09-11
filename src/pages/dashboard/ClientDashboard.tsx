import React from 'react';

const ClientDashboard: React.FC = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Client Dashboard</h1>
            <p>Welcome to your personal dashboard. Here you can manage your bookings, view your profile, and more.</p>
            {/* Add client-specific content here */}
        </div>
    );
};

export default ClientDashboard;
