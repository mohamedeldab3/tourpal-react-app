import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Corrected: Import useAuth hook
import { login as apiLogin } from '../../api/authService'; // Import the api function
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth(); // Corrected: Use the hook
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Define dashboard paths
        const dashboardPaths = {
            admin: '/dashboard/admin',
            provider: '/dashboard/provider',
            user: '/dashboard/user'
        };

        try {
            // 1. Call the API
            const response = await apiLogin({ email, password });
            
            // 2. Update the context with user data and token from response
            auth.login(response.user, response.token);

            // 3. Navigate to the correct dashboard
            navigate(dashboardPaths[response.user.userType] || '/');

        } catch (err) {
            setError('Invalid email or password.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg flex">
                {/* Image Section */}
                <div className="hidden md:block w-1/2 bg-cover bg-center rounded-l-xl"
                     style={{ backgroundImage: "url('https://images.unsplash.com/photo-1529539795054-3c162a4afc9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" }}>
                </div>

                {/* Form Section */}
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-gray-900 text-center">Welcome Back!</h2>
                    <p className="mt-2 text-center text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-purple-600 hover:text-purple-500">
                            Sign up
                        </Link>
                    </p>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && <p className="text-red-500 text-center">{error}</p>}
                        
                        <Input
                            label="Email address"
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            label="Password"
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;

