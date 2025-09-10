import React, { useState, useEffect } from 'react';
import { getProfile, UserProfile } from '../../api/userService';
import DocumentManager from '../../components/dashboard/DocumentManager';

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const data = await getProfile();
                setProfile(data);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (isLoading) {
        return <p className="p-8">Loading profile...</p>;
    }

    if (!profile) {
        return <p className="p-8">Could not load profile information.</p>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><span className="font-semibold">Full Name:</span> {profile.fullName}</div>
                    <div><span className="font-semibold">Email:</span> {profile.email}</div>
                    <div><span className="font-semibold">Phone Number:</span> {profile.phoneNumber || 'N/A'}</div>
                    <div><span className="font-semibold">Company:</span> {profile.companyName || 'N/A'}</div>
                    <div><span className="font-semibold">City:</span> {profile.city?.name || 'N/A'}</div>
                    <div><span className="font-semibold">Address:</span> {profile.address || 'N/A'}</div>
                </div>
            </div>

            <DocumentManager />
        </div>
    );
};

export default Profile;
