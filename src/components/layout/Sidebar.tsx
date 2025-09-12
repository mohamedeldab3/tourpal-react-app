import { NavLink } from 'react-router-dom';
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
    const { user } = useAuth();

    const userRole = user?.userType || 'user';
    const roleNavLinks = navLinks[userRole as keyof typeof navLinks] || [];

    return (
        <aside className="w-64 bg-white p-4 flex flex-col justify-between border-r">
            <div>
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
        </aside>
    );
};

export default Sidebar;