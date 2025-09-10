import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const navLinks = {
    user: [
        { path: '/dashboard', label: 'My Bookings', icon: 'receipt_long' },
    ],
    provider: [
        { path: '/provider-dashboard', label: 'Overview', icon: 'dashboard' },
    ],
    admin: [
        { path: '/admin-dashboard', label: 'Overview', icon: 'dashboard' },
    ],
}

const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const userRole = user?.userType || 'user';
    const roleNavLinks = navLinks[userRole] || [];

    return (
        <aside className="w-64 bg-white p-4 flex flex-col justify-between border-r">
            <div>
                <div className="mb-8 p-2">
                    <h1 className="text-2xl font-bold text-purple-700">TourPal</h1>
                    {user && <p className="text-gray-600">Welcome, {user.fullName}</p>}
                </div>
                <nav className="flex flex-col gap-2">
                    {roleNavLinks.map(link => (
                        <NavLink key={link.path} to={link.path} className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                isActive ? 'bg-purple-100 text-purple-700 font-bold' : 'text-gray-600 hover:bg-gray-100'
                            }`
                        }>
                            <span className="material-symbols-outlined">{link.icon}</span>
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
            <div className="p-2">
                <Button variant="secondary" onClick={handleLogout} className="w-full">
                    Log Out
                </Button>
            </div>
        </aside>
    );
};

export default Sidebar;

