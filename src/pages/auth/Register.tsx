import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/authService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Register: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState<'user' | 'provider'>('user');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await register({ fullName, email, password, userType });
            alert('Registration successful! Your account is pending admin approval.');
            navigate('/login');
        } catch (err) {
            setError('Failed to register. Please try again.');
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
                     style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" }}>
                </div>

                {/* Form Section */}
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-gray-900 text-center">Create an Account</h2>
                    <p className="mt-2 text-center text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
                            Sign in
                        </Link>
                    </p>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && <p className="text-red-500 text-center">{error}</p>}
                        
                        <Input
                            label="Full Name"
                            id="full-name"
                            name="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />

                        <Input
                            label="Email address"
                            id="email-address"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            label="Password"
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        
                        <div>
                            <label htmlFor="user-type" className="block text-sm font-medium text-gray-700">Account Type</label>
                            <select
                                id="user-type"
                                name="userType"
                                value={userType}
                                onChange={(e) => setUserType(e.target.value as 'user' | 'provider')}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                            >
                                <option value="user">Traveler</option>
                                <option value="provider">Service Provider</option>
                            </select>
                        </div>

                        <div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Creating Account...' : 'Sign Up'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;

