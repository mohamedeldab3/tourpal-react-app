// src/data/staticDb.ts

import { AdvertisementDto } from "../api/bannerService";
import { Booking } from "../api/bookingService";
import { Car } from "../api/carService";
import { PendingUser, User, RequiredDocument, UserProfile } from "../api/userService";
import { TourGuide, TourGuideDetails } from "../api/tourGuideService";
import { BasicListDto, RequiredDoc } from "../api/listsService";

interface StaticDatabase {
  users: User[];
  pendingUsers: PendingUser[];
  userProfiles: { [email: string]: UserProfile };
  requiredDocuments: { [email: string]: RequiredDocument[] };
  advertisements: AdvertisementDto[];
  banners: any[]; // Simplified for now
  cars: Car[];
  bookings: Booking[];
  tourGuides: TourGuide[];
  tourGuideDetails: TourGuideDetails[];
  cities: BasicListDto[];
  userTypes: BasicListDto[];
  requiredDocsTemplates: RequiredDoc[];
  carTypes: BasicListDto[];
  carFeatures: BasicListDto[];
  documentTypes: BasicListDto[];
  advPositions: BasicListDto[];
}

const initialDb: StaticDatabase = {
  users: [
    { id: '1', fullName: 'Admin Demo', email: 'admin@demo.com', userType: 'admin', status: 'Active' },
    { id: '2', fullName: 'User Demo', email: 'user@demo.com', userType: 'user', status: 'Active' },
    { id: '3', fullName: 'Provider Demo', email: 'provider@demo.com', userType: 'provider', status: 'Active' },
    { id: '4', fullName: 'Pending User', email: 'pending@demo.com', userType: 'user', status: 'Pending' },
    { id: '5', fullName: 'Suspended User', email: 'suspended@demo.com', userType: 'user', status: 'Suspended' },
  ],
  pendingUsers: [
    { userId: 'user101', fullName: 'John Doe', userType: 'Car Owner', createdAt: '2025-09-01T10:00:00Z', documents: [] },
    { userId: 'user102', fullName: 'Jane Smith', userType: 'Tour Guide', createdAt: '2025-09-02T11:00:00Z', documents: [] },
  ],
  userProfiles: {
    'admin@demo.com': { id: '1', fullName: 'Admin Demo', email: 'admin@demo.com', phoneNumber: '1234567890', companyName: 'Admin Corp', address: '1 Admin St', city: { id: '1', name: 'Cairo' }, documents: [] },
    'user@demo.com': { id: '2', fullName: 'User Demo', email: 'user@demo.com', phoneNumber: '0987654321', companyName: '', address: '1 User St', city: { id: '2', name: 'Alexandria' }, documents: [] },
    'provider@demo.com': { id: '3', fullName: 'Provider Demo', email: 'provider@demo.com', phoneNumber: '1122334455', companyName: 'Provider Inc', address: '1 Provider Ave', city: { id: '1', name: 'Cairo' }, documents: [] },
    'pending@demo.com': { id: '4', fullName: 'Pending User', email: 'pending@demo.com', phoneNumber: '', companyName: '', address: '', city: { id: '1', name: 'Cairo' }, documents: [] },
    'suspended@demo.com': { id: '5', fullName: 'Suspended User', email: 'suspended@demo.com', phoneNumber: '', companyName: '', address: '', city: { id: '1', name: 'Cairo' }, documents: [] },
  },
  requiredDocuments: {
    'user@demo.com': [
      { id: 1, documentName: 'National ID', isUploaded: true, isVerified: true, documentType: 1 },
      { id: 2, documentName: 'Driving License', isUploaded: false, isVerified: false, documentType: 2 },
    ],
    'provider@demo.com': [
      { id: 1, documentName: 'National ID', isUploaded: true, isVerified: true, documentType: 1 },
      { id: 2, documentName: 'Commercial Register', isUploaded: true, isVerified: false, documentType: 4 }, // Assuming doc type 4 for Commercial Register
    ],
  },
  advertisements: [
    { id: 'ad1', title: 'Summer Deals', description: 'Great offers', imagePath: 'https://picsum.photos/seed/ad1/300/150', targetUrl: '', position: 1, startDate: '2025-01-01', endDate: '2025-12-31', status: 1 },
    { id: 'ad2', title: 'Winter Getaway', description: 'Snowy adventures', imagePath: 'https://picsum.photos/seed/ad2/300/150', targetUrl: '', position: 2, startDate: '2025-01-01', endDate: '2025-12-31', status: 2 }, // Approved
    { id: 'ad3', title: 'Spring Break', description: 'Flower power', imagePath: 'https://picsum.photos/seed/ad3/300/150', targetUrl: '', position: 1, startDate: '2025-01-01', endDate: '2025-12-31', status: 1 },
  ],
  banners: [
    { id: 'banner1', title: 'Main Banner', imageUrl: 'https://picsum.photos/seed/banner1/800/400', linkUrl: '' },
    { id: 'banner2', title: 'Secondary Banner', imageUrl: 'https://picsum.photos/seed/banner2/800/400', linkUrl: '' },
  ],
  cars: [
    { id: 'car1', brand: 'Toyota', model: 'Camry', year: 2020, pricePerDay: 50, description: 'Reliable car', status: 'Available', carImages: [{ id: 'img1', imageUrl: 'https://picsum.photos/seed/car1/150/100', isPrimary: true }], features: ['GPS', 'AC'] },
    { id: 'car2', brand: 'Honda', model: 'Civic', year: 2022, pricePerDay: 60, description: 'Sporty and efficient', status: 'Available', carImages: [{ id: 'img2', imageUrl: 'https://picsum.photos/seed/car2/150/100', isPrimary: true }], features: ['Bluetooth', 'Sunroof'] },
    { id: 'car3', brand: 'BMW', model: 'X5', year: 2023, pricePerDay: 150, description: 'Luxury SUV', status: 'Available', carImages: [{ id: 'img3', imageUrl: 'https://picsum.photos/seed/car3/150/100', isPrimary: true }], features: ['Leather Seats', 'Heated Seats'] },
    { id: 'car4', brand: 'Nissan', model: 'Altima', year: 2019, pricePerDay: 45, description: 'Economical choice', status: 'Available', carImages: [{ id: 'img4', imageUrl: 'https://picsum.photos/seed/car4/150/100', isPrimary: true }], features: ['AC'] },
    { id: 'car5', brand: 'Ford', model: 'Mustang', year: 2021, pricePerDay: 100, description: 'Classic muscle car', status: 'Available', carImages: [{ id: 'img5', imageUrl: 'https://picsum.photos/seed/car5/150/100', isPrimary: true }], features: ['Sport Mode', 'Premium Sound'] },
  ],
  bookings: [
    { id: 'book1', carName: 'Toyota Camry', provider: 'Provider Demo', date: '2025-10-20', status: 'Upcoming' },
    { id: 'book2', carName: 'Honda Civic', provider: 'Provider Demo', date: '2025-09-10', status: 'Completed' },
    { id: 'book3', carName: 'BMW X5', provider: 'Provider Demo', date: '2025-11-01', status: 'Upcoming' },
  ],
  tourGuides: [
    { id: 'guide1', fullName: 'Ahmed Ali', city: 'Cairo', experienceYears: 5, languages: ['Arabic', 'English'], profilePictureUrl: 'https://picsum.photos/seed/guide1/150/150' },
    { id: 'guide2', fullName: 'Sara Mohamed', city: 'Luxor', experienceYears: 8, languages: ['Arabic', 'French', 'German'], profilePictureUrl: 'https://picsum.photos/seed/guide2/150/150' },
    { id: 'guide3', fullName: 'Omar Hassan', city: 'Aswan', experienceYears: 3, languages: ['Arabic', 'English', 'Spanish'], profilePictureUrl: 'https://picsum.photos/seed/guide3/150/150' },
  ],
  tourGuideDetails: [
    { id: 'guide1', fullName: 'Ahmed Ali', city: 'Cairo', experienceYears: 5, languages: ['Arabic', 'English'], profilePictureUrl: 'https://picsum.photos/seed/guide1/150/150', bio: 'Experienced guide specializing in historical sites.' },
    { id: 'guide2', fullName: 'Sara Mohamed', city: 'Luxor', experienceYears: 8, languages: ['Arabic', 'French', 'German'], profilePictureUrl: 'https://picsum.photos/seed/guide2/150/150', bio: 'Passionate about ancient Egyptian culture and Nile cruises.' },
    { id: 'guide3', fullName: 'Omar Hassan', city: 'Aswan', experienceYears: 3, languages: ['Arabic', 'English', 'Spanish'], profilePictureUrl: 'https://picsum.photos/seed/guide3/150/150', bio: 'Energetic guide for adventure tours and local experiences.' },
  ],
  cities: [
    { id: 1, name: 'Cairo' },
    { id: 2, name: 'Alexandria' },
    { id: 3, name: 'Luxor' },
    { id: 4, name: 'Aswan' },
  ],
  userTypes: [
    { id: 1, name: 'Client' },
    { id: 2, name: 'Car Owner' },
    { id: 3, name: 'Tour Guide' },
    { id: 4, name: 'Tourism Transport Company' },
    { id: 5, name: 'Tourism Company' },
    { id: 6, name: 'Admin' },
  ],
  requiredDocsTemplates: [
    { id: 1, name: 'National ID', isMandatory: true },
    { id: 2, name: 'Driving License', isMandatory: false },
    { id: 3, name: 'Passport', isMandatory: true },
    { id: 4, name: 'Commercial Register', isMandatory: true },
  ],
  carTypes: [
    { id: 1, name: 'Sedan' },
    { id: 2, name: 'SUV' },
    { id: 3, name: 'Van' },
    { id: 4, name: 'Hatchback' },
    { id: 5, name: 'Mini Bus' },
    { id: 6, name: 'Bus H1' },
  ],
  carFeatures: [
    { id: 1, name: 'Air Conditioning' },
    { id: 2, name: 'GPS' },
    { id: 3, name: 'Automatic Transmission' },
    { id: 4, name: 'Bluetooth' },
    { id: 5, name: 'Sunroof' },
    { id: 6, name: 'Leather Seats' },
    { id: 7, name: 'Heated Seats' },
    { id: 8, name: 'Sport Mode' },
    { id: 9, name: 'Premium Sound' },
  ],
  documentTypes: [
    { id: 1, name: 'ID Card' },
    { id: 2, name: 'License' },
    { id: 3, name: 'Passport' },
    { id: 4, name: 'Commercial Register' },
  ],
  advPositions: [
    { id: 1, name: 'Top Banner' },
    { id: 2, name: 'Sidebar Ad' },
    { id: 3, name: 'Footer Ad' },
  ],
};

export const db: StaticDatabase = JSON.parse(JSON.stringify(initialDb)); // Deep copy to allow mutation

// Function to reset the database to its initial state
export const resetDb = () => {
  Object.assign(db, JSON.parse(JSON.stringify(initialDb)));
  console.log("Static database reset.");
};
