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
    const roleNavLinks = navLinks[userRole as keyof typeof navLinks] || [];

    return (
        <aside className="w-64 bg-white p-4 flex flex-col justify-between border-r">
            <div>
                {/* Existing navigation */}
                <nav className="flex flex-col gap-2">
                    {roleNavLinks.map(link => (
                        <NavLink key={link.path} to={link.path} className={({ isActive }: { isActive: boolean }) =>
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

            {/* New section for Home and Sign Out buttons */}
            <div className="mt-auto pt-4 border-t border-gray-200">
                <NavLink to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors mb-2">
                    <span className="material-symbols-outlined">home</span>
                    <span>Home Page</span>
                </NavLink>
                <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors w-full text-left">
                    <span className="material-symbols-outlined">logout</span>
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;