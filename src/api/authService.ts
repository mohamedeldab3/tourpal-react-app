// @ts-nocheck

// Define user types based on what's in AuthContext
interface User {
  id: string;
  fullName: string;
  email: string;
  userType: "user" | "provider" | "admin";
}

// Define payload types
interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  FullName: string;
  Email: string;
  Password: string;
  // ... other fields
}

import { db } from '../data/staticDb'; // Import the static database

export const login = async (credentials: LoginPayload): Promise<{ user: User; token: string }> => {
  console.log('Static login attempt with:', credentials.email);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = db.users.find(u => u.email === credentials.email); // Use db.users

      if (user && credentials.password === 'password123') { // Password is still hardcoded for demo
        console.log('Login successful for:', user.email);
        resolve({
          user,
          token: `fake-token-for-${user.email}`,
        });
      } else {
        console.log('Login failed for:', credentials.email);
        reject(new Error('Invalid email or password'));
      }
    }, 500);
  });
};

export const register = async (userData: RegisterPayload) => {
  console.log('Static registration attempt with:', userData);
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate adding new user to the database
      const newUser: User = {
        id: `user-${db.users.length + 1}`, // Simple ID generation
        fullName: userData.FullName,
        email: userData.Email,
        userType: 'user', // Default to 'user' for new registrations
        status: 'Active',
      };
      db.users.push(newUser);
      db.userProfiles[newUser.email] = { // Add a basic profile
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        phoneNumber: '',
        companyName: '',
        address: '',
        city: { id: '1', name: 'Cairo' }, // Default city
        documents: [],
      };

      console.log('User registered (simulated) and added to DB:', newUser.email);
      resolve({ success: true, message: 'Registration successful! Please log in.' });
    }, 500);
  });
};

export const forgotPassword = async (email: string) => {
  console.log(`Static forgot password for: ${email}`);
  return Promise.resolve({ success: true, message: 'If an account with this email exists, a password reset link has been sent.' });
};

export const resetPassword = async (payload: any) => {
  console.log(`Static password reset for: ${payload.email}`);
  return Promise.resolve({ success: true, message: 'Password has been reset successfully.' });
};

export const changePassword = async (payload: any) => {
    console.log(`Static password change`);
    return Promise.resolve({ success: true, message: 'Password has been changed successfully.' });
};

export const sendEmailConfirmation = async (email: string) => {
  console.log(`Static email confirmation sent to: ${email}`);
  return Promise.resolve({ success: true, message: 'Confirmation email sent.' });
};

export const confirmEmail = async (email: string, code: string) => {
  console.log(`Static email confirmation for: ${email} with code ${code}`);
  return Promise.resolve({ success: true, message: 'Email confirmed successfully.' });
};
