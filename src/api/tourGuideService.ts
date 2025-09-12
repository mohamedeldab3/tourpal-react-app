// @ts-nocheck

export interface TourGuide {
    id: string;
    fullName: string;
    city: string;
    experienceYears: number;
    languages: string[];
    profilePictureUrl?: string;
}

export interface TourGuideDetails extends TourGuide {
    bio: string;
}

export interface RequestTourGuidePayload {
    tourGuideId: string;
    startDate: string;
    endDate: string;
    requestNotes: string;
    requiredLanguageId: number;
}

import { db } from '../data/staticDb'; // Import the static database

export const getTourGuidesList = async (): Promise<TourGuide[]> => {
    console.log('Static getTourGuidesList called');
    return Promise.resolve(db.tourGuides);
};

export const getTourGuideDetails = async (id: string): Promise<TourGuideDetails> => {
    console.log(`Static getTourGuideDetails called for id: ${id}`);
    const guide = db.tourGuides.find(g => g.id === id);
    if (guide) {
        // For simplicity, return a generic bio for any found guide
        return Promise.resolve({ ...guide, bio: db.tourGuideDetails[0]?.bio || 'No bio available.' });
    }
    return Promise.reject(new Error('Tour guide not found'));
};

export const requestTourGuide = async (payload: RequestTourGuidePayload): Promise<any> => {
    console.log('Static requestTourGuide called with:', payload);
    return new Promise(resolve => {
        setTimeout(() => {
            // Simulate adding a request to a list (e.g., in db.bookings or a new db.tourGuideRequests)
            // For now, just log and resolve
            console.log('Tour guide request simulated and added to DB (conceptually).');
            resolve({ success: true, message: 'Tour guide request simulated.' });
        }, 500);
    });
};
