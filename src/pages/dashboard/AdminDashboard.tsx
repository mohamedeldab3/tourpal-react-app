import React, { useState, useEffect } from 'react';
import { 
  getPendingApprovals, 
  getUsersList, 
  approveUser, 
  PendingUser, 
  User
} from '../../api/userService';
import { register } from '../../api/authService'; 
import { getPendingAdvertisements, handleAdvertisement, AdvertisementDto } from '../../api/bannerService'; 
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { toast } from "sonner"; 

const AdminDashboard: React.FC = () => {
    // State for user management
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]); 
    const [users, setUsers] = useState<User[]>([]); 
    const [isCreateAdminModalOpen, setIsCreateAdminModalOpen] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ FullName: '', Email: '', Password: '' });
    const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

    // State for advertisement management
    const [pendingAds, setPendingAds] = useState<AdvertisementDto[]>([]); 

    // General state
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'approvals' | 'users' | 'ads'>('approvals'); 
    
    // State for the documents modal (not directly used in this scope, but kept)
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [selectedUserName, ] = useState(''); 

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const pendingUsersData = await getPendingApprovals();
            setPendingUsers(pendingUsersData || []);

            const usersListData = await getUsersList();
            setUsers(usersListData || []);

            const pendingAdsData = await getPendingAdvertisements();
            setPendingAds(pendingAdsData || []);

        } catch (error) {
            console.error("Failed to fetch data:", error);
            toast.error("Could not fetch data. Please try refreshing the page."); 
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]); 

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreatingAdmin(true);
        try {
            await register({
                ...newAdmin,
            });
            toast.success('Admin user created successfully!'); 
            setIsCreateAdminModalOpen(false);
            setNewAdmin({ FullName: '', Email: '', Password: '' });
            fetchData(); 
        } catch (error: any) {
            console.error("Failed to create admin:", error);
            toast.error(error.response?.data?.message || "An error occurred while creating the admin."); 
        } finally {
            setIsCreatingAdmin(false);
        }
    };

    const handleUserApproval = async (userId: string, status: 'Approved' | 'Rejected') => {
        try {
            await approveUser({ userId, status, notes: '' }); 
            toast.success(`User ${status} successfully!`);
            fetchData(); 
        } catch (error) {
            console.error(`Failed to ${status} user:`, error);
            toast.error(`Failed to ${status} user.`);
        }
    };

    const handleAdAction = async (adId: string, isApproved: boolean) => {
        try {
            await handleAdvertisement(adId, isApproved);
            toast.success(`Advertisement ${isApproved ? 'approved' : 'rejected'} successfully!`);
            fetchData(); 
        } catch (error) {
            console.error(`Failed to ${isApproved ? 'approve' : 'reject'} advertisement:`, error);
            toast.error(`Failed to ${isApproved ? 'approve' : 'reject'} advertisement.`);
        }
    };

    if (isLoading) {
        return <p className="p-8">Loading...</p>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('approvals')}
                        className={`${activeTab === 'approvals' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Pending Approvals ({pendingUsers.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('ads')}
                        className={`${activeTab === 'ads' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Pending Advertisements ({pendingAds.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`${activeTab === 'users' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        All Users ({users.length})
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'approvals' && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Pending User Approvals</h2>
                    {pendingUsers.length === 0 ? (
                        <p>No pending user approvals.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pendingUsers.map(user => (
                                <div key={user.userId} className="bg-white p-4 rounded-lg shadow">
                                    <p className="font-bold">{user.fullName}</p>
                                    <p className="text-sm text-gray-600">Type: {user.userType}</p>
                                    <p className="text-sm text-gray-600">Requested: {new Date(user.createdAt).toLocaleDateString()}</p>
                                    <div className="mt-3 flex space-x-2">
                                        <Button onClick={() => handleUserApproval(user.userId, 'Approved')} className="bg-green-500 hover:bg-green-600 text-white">Approve</Button>
                                        <Button onClick={() => handleUserApproval(user.userId, 'Rejected')} className="bg-red-500 hover:bg-red-600 text-white">Reject</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'ads' && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Pending Advertisements</h2>
                    {pendingAds.length === 0 ? (
                        <p>No pending advertisements.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pendingAds.map(ad => (
                                <div key={ad.id} className="bg-white p-4 rounded-lg shadow">
                                    <p className="font-bold">{ad.title}</p>
                                    {ad.imagePath && <img src={ad.imagePath} alt={ad.title} className="w-full h-32 object-cover my-2 rounded" />}
                                    <p className="text-sm text-gray-600">Position: {ad.position}</p>
                                    <p className="text-sm text-gray-600">Dates: {new Date(ad.startDate).toLocaleDateString()} - {new Date(ad.endDate).toLocaleDateString()}</p>
                                    <div className="mt-3 flex space-x-2">
                                        <Button onClick={() => handleAdAction(ad.id, true)} className="bg-green-500 hover:bg-green-600 text-white">Approve</Button>
                                        <Button onClick={() => handleAdAction(ad.id, false)} className="bg-red-500 hover:bg-red-600 text-white">Reject</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'users' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">All Users</h2>
                        <Button onClick={() => setIsCreateAdminModalOpen(true)}>Create New Admin</Button>
                    </div>
                    {users.length === 0 ? (
                        <p>No users found.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {users.map(user => (
                                <div key={user.id} className="bg-white p-4 rounded-lg shadow">
                                    <p className="font-bold">{user.fullName}</p>
                                    <p className="text-sm text-gray-600">Email: {user.email}</p>
                                    <p className="text-sm text-gray-600">Type: {user.userType}</p>
                                    <p className="text-sm text-gray-600">Status: {user.status}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            
            {/* Modals */}
            <Modal isOpen={isCreateAdminModalOpen} onClose={() => setIsCreateAdminModalOpen(false)} title="Create New Admin User">
                <form onSubmit={handleCreateAdmin} className="space-y-4">
                    <Input label="Full Name" id="admin-full-name" name="FullName" type="text" value={newAdmin.FullName} onChange={(e) => setNewAdmin({...newAdmin, FullName: e.target.value})} required />
                    <Input label="Email" id="admin-email" name="Email" type="email" value={newAdmin.Email} onChange={(e) => setNewAdmin({...newAdmin, Email: e.target.value})} required />
                    <Input label="Password" id="admin-password" name="Password" type="password" value={newAdmin.Password} onChange={(e) => setNewAdmin({...newAdmin, Password: e.target.value})} required />
                    <div className="text-right">
                        <Button type="submit" disabled={isCreatingAdmin}>
                            {isCreatingAdmin ? 'Creating...' : 'Create Admin'}
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isDocModalOpen} onClose={() => setIsDocModalOpen(false)} title={`Documents for ${selectedUserName}`}>
                <></>
            </Modal>
        </div>
    );
};

export default AdminDashboard;