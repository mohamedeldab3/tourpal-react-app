// @ts-nocheck

export interface AdvertisementCreateDto {
    title: string;
    description?: string;
    image: File;
    targetUrl?: string;
    position: number; // AdPosition Enum
    startDate: string;
    endDate: string;
}

export interface AdvertisementDto {
    id: string;
    title: string;
    description: string;
    imagePath: string;
    targetUrl: string;
    position: number;
    startDate: string;
    endDate: string;
    status: number; // AdStatus Enum
}

export interface BannerDto {
    id: string;
    title: string;
    imageUrl: string;
    linkUrl: string;
}

import { db } from '../data/staticDb'; // Import the static database

export const createAdvertisement = async (data: AdvertisementCreateDto): Promise<any> => {
    console.log('Static createAdvertisement called with:', data);
    return new Promise(resolve => {
        setTimeout(() => {
            const newAd: AdvertisementDto = {
                id: `ad-${db.advertisements.length + 1}`,
                title: data.title,
                description: data.description || '',
                imagePath: URL.createObjectURL(data.image), // Create a URL for the image file
                targetUrl: data.targetUrl || '',
                position: data.position,
                startDate: data.startDate,
                endDate: data.endDate,
                status: 1, // Always pending for new ads
            };
            db.advertisements.push(newAd);
            console.log('Advertisement created (simulated) and added to DB:', newAd);
            resolve({ success: true, message: 'Advertisement creation simulated.' });
        }, 500);
    });
};

export const getBanners = async (): Promise<BannerDto[]> => {
    console.log('Static getBanners called');
    return Promise.resolve(db.banners);
};

export const getPendingAdvertisements = async (): Promise<AdvertisementDto[]> => {
    console.log('Static getPendingAdvertisements called');
    return Promise.resolve(db.advertisements.filter(ad => ad.status === 1)); // Filter for pending ads
};

export const handleAdvertisement = async (adId: string, isApproved: boolean, reason?: string): Promise<any> => {
    console.log(`Static handleAdvertisement called for adId: ${adId}, isApproved: ${isApproved}, reason: ${reason}`);
    return new Promise(resolve => {
        setTimeout(() => {
            const ad = db.advertisements.find(a => a.id === adId);
            if (ad) {
                ad.status = isApproved ? 2 : 3; // 2 for Approved, 3 for Rejected
                console.log(`Advertisement ${adId} status updated to ${ad.status} (simulated).`);
            }
            resolve({ success: true, message: 'Advertisement handling simulated.' });
        }, 500);
    });
};
