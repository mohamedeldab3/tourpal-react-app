import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        auth?.logout();
        navigate('/'); // Redirect to home page after logout
    };

    const getDashboardPath = () => {
        if (!auth?.user) return '/';
        switch (auth.user.userType) {
            case 'admin':
                return '/dashboard/admin';
            case 'provider':
                return '/dashboard/provider';
            case 'user':
            default:
                return '/dashboard/user';
        }
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3">
                    <span className="text-3xl text-purple-600 font-bold">TourPal</span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <NavLink to="/" className={({ isActive }) => isActive ? "text-purple-600 font-bold" : "text-gray-600 hover:text-purple-600"}>Home</NavLink>
                    <NavLink to="/search" className={({ isActive }) => isActive ? "text-purple-600 font-bold" : "text-gray-600 hover:text-purple-600"}>Search</NavLink>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    {auth?.isAuthenticated ? (
                        <>
                            <Link to={getDashboardPath()}>
                                <Button>Dashboard</Button>
                            </Link>
                            <Button variant="secondary" onClick={handleLogout}>
                                Log Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="secondary">Log In</Button>
                            </Link>
                            <Link to="/register">
                                <Button>Sign Up</Button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;

