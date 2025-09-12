// @ts-nocheck

export interface PendingUser {
  userId: string;
  fullName: string;
  userType: string;
  createdAt: string;
  documents: Document[];
}

export interface User {
    id: string;
    fullName: string;
    email: string;
    userType: string;
    status: string;
}

export interface ApproveUserPayload {
    userId: string;
    status: 'Approved' | 'Rejected';
    notes: string;
}

export interface Document {
    id: string;
    documentTypeName: string;
    filePath: string;
    isVerified: boolean;
}

export interface RequiredDocument {
    documentName: string;
    isUploaded: boolean;
    isVerified: boolean;
    documentType: number;
    id: number;
}

export interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    companyName: string;
    address: string;
    city: { id: string, name: string };
    documents: Document[];
}

import { db } from '../data/staticDb'; // Import the static database

export const getPendingApprovals = async (): Promise<PendingUser[]> => {
    console.log('Static getPendingApprovals called');
    return Promise.resolve(db.pendingUsers);
};

export const approveUser = async (payload: ApproveUserPayload): Promise<void> => {
    console.log('Static approveUser called with:', payload);
    return new Promise(resolve => {
        setTimeout(() => {
            const userIndex = db.pendingUsers.findIndex(u => u.userId === payload.userId);
            if (userIndex !== -1) {
                const approvedUser = db.pendingUsers.splice(userIndex, 1)[0]; // Remove from pending
                const userInAllUsers = db.users.find(u => u.id === approvedUser.userId);
                if (userInAllUsers) {
                    userInAllUsers.status = payload.status === 'Approved' ? 'Active' : 'Rejected';
                } else {
                    // If not found in all users, add them
                    db.users.push({
                        id: approvedUser.userId,
                        fullName: approvedUser.fullName,
                        email: `${approvedUser.fullName.replace(/\s/g, '').toLowerCase()}@demo.com`, // Dummy email
                        userType: approvedUser.userType,
                        status: payload.status === 'Approved' ? 'Active' : 'Rejected',
                    });
                }
                console.log(`User ${payload.userId} ${payload.status} (simulated).`);
            }
            resolve();
        }, 500);
    });
};

export const suspendUser = async (userId: string): Promise<void> => {
    console.log('Static suspendUser called for userId:', userId);
    return new Promise(resolve => {
        setTimeout(() => {
            const user = db.users.find(u => u.id === userId);
            if (user) {
                user.status = 'Suspended';
                console.log(`User ${userId} suspended (simulated).`);
            }
            resolve();
        }, 500);
    });
};

export const getUsersList = async (): Promise<User[]> => {
    console.log('Static getUsersList called');
    return Promise.resolve(db.users);
};

export const getProfile = async (): Promise<UserProfile> => {
    console.log('Static getProfile called');
    // For demo, return a profile for the currently logged-in user if available, otherwise a generic one
    // This would ideally be linked to the logged-in user's email from AuthContext
    return Promise.resolve(db.userProfiles['user@demo.com'] || db.userProfiles['admin@demo.com']);
};

export const checkUserDocuments = async (userId?: string): Promise<RequiredDocument[]> => {
    console.log('Static checkUserDocuments called for userId:', userId);
    return Promise.resolve(db.requiredDocuments['user@demo.com'] || []);
};

export const uploadDocument = async (formData: FormData): Promise<void> => {
    console.log('Static uploadDocument called with formData:', Object.fromEntries(formData.entries()));
    return new Promise(resolve => {
        setTimeout(() => {
            const email = formData.get('Email') as string;
            const docType = parseInt(formData.get('DocumentType') as string);
            const file = formData.get('File') as File;

            if (email && db.requiredDocuments[email]) {
                const doc = db.requiredDocuments[email].find(d => d.documentType === docType);
                if (doc) {
                    doc.isUploaded = true;
                    doc.isVerified = false; // Needs verification after upload
                    console.log(`Document ${doc.documentName} uploaded for ${email} (simulated).`);
                }
            }
            resolve();
        }, 500);
    });
};

export const deleteDocument = async (documentId: number): Promise<void> => {
    console.log('Static deleteDocument called for documentId:', documentId);
    return new Promise(resolve => {
        setTimeout(() => {
            // This would need to know which user's document to delete
            // For simplicity, just log for now
            console.log(`Document ${documentId} deleted (simulated).`);
            resolve();
        }, 500);
    });
};

export const verifyUserDocument = async (payload: { documentId: number; isApproved: boolean; notes: string }): Promise<any> => {
    console.log('Static verifyUserDocument called with:', payload);
    return new Promise(resolve => {
        setTimeout(() => {
            // This would need to know which user's document to verify
            // For simplicity, just log for now
            console.log(`Document ${payload.documentId} verified: ${payload.isApproved} (simulated).`);
            resolve({ success: true, message: 'Document verification simulated.' });
        }, 500);
    });
};