// @ts-nocheck

export interface Booking {
  id: string;
  carName: string; 
  provider: string; 
  date: string; 
  status: 'Upcoming' | 'Completed' | 'Cancelled'; 
}

interface BookingRequestPayload {
  carId: string;
  startDate: string;
  endDate: string;
  requestNotes?: string;
}

import { db } from '../data/staticDb'; // Import the static database

export const getUserBookings = async (): Promise<Booking[]> => {
    console.log('Static getUserBookings called');
    return Promise.resolve(db.bookings);
};

export const createBookingRequest = async (payload: BookingRequestPayload): Promise<any> => {
  console.log('Static createBookingRequest called with:', payload);
  return new Promise(resolve => {
    setTimeout(() => {
      const newBooking: Booking = {
        id: `book-${db.bookings.length + 1}`,
        carName: `Car ID: ${payload.carId}`, // Simplified car name
        provider: 'Simulated Provider', // Simplified provider
        date: payload.startDate,
        status: 'Upcoming',
      };
      db.bookings.push(newBooking);
      console.log('Booking request created (simulated) and added to DB:', newBooking);
      resolve({ success: true, message: 'Booking request simulated.' });
    }, 500);
  });
};
