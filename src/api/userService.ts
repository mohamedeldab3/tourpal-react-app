// src/api/userService.ts

// This is a mock database for users and approvals
let mockUsers = [
    { id: 'user1', fullName: 'John Doe', email: 'user@tourpal.com', userType: 'user', status: 'Active' },
    { id: 'user2', fullName: 'Jane Smith', email: 'provider@tourpal.com', userType: 'provider', status: 'Active' },
    { id: 'user3', fullName: 'Admin User', email: 'admin@tourpal.com', userType: 'admin', status: 'Active' },
];

let mockPendingApprovals = [
    { id: 'approval1', fullName: 'New Provider', email: 'new.provider@example.com', userType: 'provider' },
    { id: 'approval2', fullName: 'Another Company', email: 'company@example.com', userType: 'provider' },
];


// --- Mock API Functions for Admin ---

/**
 * Fetches the list of all registered users.
 */
export const getUsersList = async () => {
    console.log('API Call: Fetching all users...');
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers;
};

/**
 * Fetches the list of users waiting for account approval.
 */
export const getPendingApprovals = async () => {
    console.log('API Call: Fetching pending approvals...');
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPendingApprovals;
};

/**
 * Approves or rejects a user's registration.
 */
export const approveUser = async (approvalId: string, isApproved: boolean) => {
    console.log(`API Call: Setting approval for ${approvalId} to ${isApproved}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Remove the user from the pending list
    mockPendingApprovals = mockPendingApprovals.filter(user => user.id !== approvalId);
    
    return { success: true };
};

/**
 * Suspends a user's account.
 */
export const suspendUser = async (userId: string) => {
    console.log(`API Call: Suspending user with ID ${userId}...`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
        user.status = user.status === 'Active' ? 'Suspended' : 'Active';
    }
    
    return { success: true };
};

