// This is a mock service. In a real application, it would use the apiClient to make network requests.

export const login = async (credentials: any) => {
    console.log('Mock login request with:', credentials);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!credentials.email) {
        throw new Error('Login failed');
    }

    const userType = credentials.email.includes('admin') ? 'admin'
                   : credentials.email.includes('provider') ? 'provider'
                   : 'user';

    return {
        user: {
            id: 'mock-user-id',
            fullName: 'Mock User',
            email: credentials.email,
            userType: userType,
        },
        token: 'mock-jwt-token',
    };
};

export const register = async (userData: any) => {
    console.log('Mock register request with:', userData);
    await new Promise(resolve => setTimeout(resolve, 1500));
    // In a real app, this would return a success message or user data
    return { success: true, message: 'Registration successful. Please wait for admin approval.' };
};

