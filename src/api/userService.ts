import apiClient from './apiClient';

// ✅ FIX: Added 'export' to all interfaces to make them reusable.
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
    documentType: number; // Added documentType to be used when uploading
    id: number; // Added id to be used when deleting
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

// ✅ FIX: Added 'export' before each function.

/**
 * Fetches the list of users with pending approvals.
 */
export const getPendingApprovals = async (): Promise<PendingUser[]> => {
    const response = await apiClient.get('/api/Account/pending-approvals');
    return response.data;
};

/**
 * Sends a request to approve or reject a user.
 */
export const approveUser = async (payload: ApproveUserPayload): Promise<void> => {
    await apiClient.post('/api/Account/user-approve', payload);
};

/**
 * Suspends a user's account.
 */
export const suspendUser = async (userId: string): Promise<void> => {
    await apiClient.post(`/api/Account/suspend/${userId}`);
};

/**
 * Fetches the complete list of all users.
 */
export const getUsersList = async (): Promise<User[]> => {
    const response = await apiClient.get('/api/Account/users-list');
    return response.data;
};

/**
 * Fetches the profile of the currently logged-in user.
 */
export const getProfile = async (): Promise<UserProfile> => {
    const response = await apiClient.get('/api/Account/get-profile');
    return response.data;
};

/**
 * Checks the status of required documents for a user.
 */
export const checkUserDocuments = async (userId?: string): Promise<RequiredDocument[]> => {
    const url = userId ? `/api/Account/check-user-documents?userId=${userId}` : '/api/Account/check-user-documents';
    const response = await apiClient.get(url);
    return response.data;
};

/**
 * Uploads a document for the user.
 */
export const uploadDocument = async (formData: FormData): Promise<void> => {
    await apiClient.post('/api/Account/upload-document', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

/**
 * Deletes a document.
 */
export const deleteDocument = async (documentId: number): Promise<void> => {
    await apiClient.delete(`/api/Account/delete-document/${documentId}`);
};

/**
 * Verifies a user document (for admins).
 */
export const verifyUserDocument = async (payload: { documentId: number; isApproved: boolean; notes: string }): Promise<any> => {
    const { data } = await apiClient.put('/api/Account/verify-user-document', payload);
    return data;
};