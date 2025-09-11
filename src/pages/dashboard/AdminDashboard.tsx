import React, { useState, useEffect } from 'react';
import { 
  getPendingApprovals, 
  approveUser, 
  suspendUser, 
  getUsersList, 
  verifyUserDocument,
  PendingUser, 
  User, 
  Document as UserDocument 
} from '../../api/userService';
import { register } from '../../api/authService'; // Import register function
import { getPendingAdvertisements, handleAdvertisement, AdvertisementDto } from '../../api/bannerService';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

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
    
    // State for the documents modal
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [selectedUserDocs, setSelectedUserDocs] = useState<UserDocument[]>([]);
    const [selectedUserName, setSelectedUserName] = useState('');
    const [rejectionNotes, setRejectionNotes] = useState<{ [key: string]: string }>({});

    const fetchData = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'approvals') {
                const response = await getPendingApprovals();
                setPendingUsers(response || []);
            } else if (activeTab === 'users') {
                const response = await getUsersList();
                setUsers(response || []);
            } else if (activeTab === 'ads') {
                const response = await getPendingAdvertisements();
                setPendingAds(response || []);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
            alert("Could not fetch data. Please try refreshing the page.");
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
                UserType: 1, // Assuming 1 is System Admin
                Phone: '0000000000', // Add dummy data for required fields
                CityId: '1', // Add dummy data for required fields
             });
            alert('Admin user created successfully!');
            setIsCreateAdminModalOpen(false);
            setNewAdmin({ FullName: '', Email: '', Password: '' });
            fetchData(); // Refresh user list
        } catch (error: any) {
            console.error("Failed to create admin:", error);
            alert(error.response?.data?.message || "An error occurred while creating the admin.");
        } finally {
            setIsCreatingAdmin(false);
        }
    };

    // Other handlers...

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {/* Tabs */}
            {/* ... */}

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {/* ... other tabs */}
                    {activeTab === 'users' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">User Management</h2>
                                <Button onClick={() => setIsCreateAdminModalOpen(true)}>Create New Admin</Button>
                            </div>
                            {/* User table as before */}
                        </div>
                    )}
                    {/* ... other tabs */}
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
                {/* Document verification modal as before */}
            </Modal>
        </div>
    );
};

export default AdminDashboard;
