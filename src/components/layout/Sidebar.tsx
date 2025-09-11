import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = {
    user: [
        { path: '/dashboard/user', label: 'My Bookings', icon: 'receipt_long' },
        { path: '/dashboard/profile', label: 'My Profile', icon: 'person' },
        { path: '/dashboard/create-ad', label: 'Create Ad', icon: 'post_add' }, // رابط جديد
    ],
    provider: [
        { path: '/dashboard/provider', label: 'My Vehicles', icon: 'directions_car' },
        { path: '/dashboard/profile', label: 'My Profile', icon: 'person' },
        { path: '/dashboard/create-ad', label: 'Create Ad', icon: 'post_add' }, // رابط جديد
    ],
    admin: [
        { path: '/dashboard/admin', label: 'Management', icon: 'shield_person' },
        { path: '/dashboard/profile', label: 'My Profile', icon: 'person' },
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
    // Ensure that roleNavLinks is an array even if userRole does not match
    const roleNavLinks = navLinks[userRole as keyof typeof navLinks] || [];

    return (
        <aside className="w-64 bg-white p-4 flex flex-col justify-between border-r">
            <div>
                {/* ... existing header ... */}
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
            <div>
                <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-100 w-full">
                    <span className="material-symbols-outlined">logout</span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
