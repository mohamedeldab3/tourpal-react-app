import React, { useState, useEffect } from 'react';
import { 
  getPendingApprovals, 
  approveUser, 
  suspendUser, 
  getUsersList, 
  PendingUser, 
  User, 
  Document as UserDocument 
} from '../../api/userService';
import { getPendingAdvertisements, handleAdvertisement, AdvertisementDto } from '../../api/bannerService';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const AdminDashboard: React.FC = () => {
    // State for user management
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    // State for advertisement management
    const [pendingAds, setPendingAds] = useState<AdvertisementDto[]>([]);

    // General state
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'approvals' | 'users' | 'ads'>('approvals');
    
    // State for the documents modal
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [selectedUserDocs, setSelectedUserDocs] = useState<UserDocument[]>([]);
    const [selectedUserName, setSelectedUserName] = useState('');

    useEffect(() => {
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
        fetchData();
    }, [activeTab]);

    // User handling functions
    const handleApprove = async (userId: string) => {
        try {
            await approveUser({ userId, status: 'Approved', notes: 'Approved by admin' });
            setPendingUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
            alert('User approved successfully!');
        } catch (error) {
            console.error("Failed to approve user:", error);
            alert("An error occurred while approving the user.");
        }
    };

    const handleReject = async (userId: string) => {
        try {
            await approveUser({ userId, status: 'Rejected', notes: 'Rejected by admin' });
            setPendingUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
            alert('User rejected successfully!');
        } catch (error) {
            console.error("Failed to reject user:", error);
            alert("An error occurred while rejecting the user.");
        }
    };

    const handleSuspend = async (userId: string) => {
        if (!window.confirm("Are you sure you want to suspend this user?")) return;
        try {
            await suspendUser(userId);
            // Refresh the users list to show the change
            const response = await getUsersList();
            setUsers(response || []);
            alert('User suspended successfully!');
        } catch (error) {
            console.error("Failed to suspend user:", error);
            alert("An error occurred while suspending the user.");
        }
    };

    // This function now takes the user object directly, no need for a new API call.
    const handleViewDocuments = (user: PendingUser) => {
        setSelectedUserDocs(user.documents || []);
        setSelectedUserName(user.fullName);
        setIsDocModalOpen(true);
    };

    // Ad handling function
    const handleAdApproval = async (adId: string, isApproved: boolean) => {
        try {
            await handleAdvertisement(adId, isApproved);
            setPendingAds(prevAds => prevAds.filter(ad => ad.id !== adId));
            alert(`Advertisement has been ${isApproved ? 'approved' : 'rejected'}.`);
        } catch (error) {
            console.error("Failed to handle advertisement:", error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                      onClick={() => setActiveTab('approvals')}
                      className={`${activeTab === 'approvals' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Pending Approvals ({pendingUsers.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('users')}
                      className={`${activeTab === 'users' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        User Management
                    </button>
                    <button
                      onClick={() => setActiveTab('ads')}
                      className={`${activeTab === 'ads' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Advertisements ({pendingAds.length})
                    </button>
                </nav>
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {activeTab === 'approvals' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Membership Requests</h2>
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <ul className="divide-y divide-gray-200">
                                    {pendingUsers.length > 0 ? pendingUsers.map((user) => (
                                        <li key={user.userId} className="p-4 sm:p-6">
                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                <div>
                                                    <p className="text-lg font-medium text-purple-600">{user.fullName}</p>
                                                    <p className="text-sm text-gray-500">{user.userType} - Requested on {new Date(user.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div className="flex-shrink-0 flex items-center space-x-2 sm:space-x-4">
                                                    <Button variant="secondary" size="sm" onClick={() => handleViewDocuments(user)}>View Documents</Button>
                                                    <Button size="sm" onClick={() => handleApprove(user.userId)}>Approve</Button>
                                                    <Button variant="danger" size="sm" onClick={() => handleReject(user.userId)}>Reject</Button>
                                                </div>
                                            </div>
                                        </li>
                                    )) : <p className="p-6 text-center text-gray-500">No pending approvals.</p>}
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">All Users</h2>
                            <div className="bg-white shadow overflow-x-auto sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.fullName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.userType}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Suspended' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {user.status !== 'Suspended' && (
                                                        <Button variant="danger" size="sm" onClick={() => handleSuspend(user.id)}>Suspend</Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ads' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Pending Advertisements</h2>
                            <div className="bg-white shadow sm:rounded-lg">
                                <ul className="divide-y divide-gray-200">
                                    {pendingAds.length > 0 ? pendingAds.map((ad) => (
                                        <li key={ad.id} className="p-4 sm:p-6">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <img src={ad.imagePath} alt={ad.title} className="w-24 h-16 object-cover rounded-md"/>
                                                    <div>
                                                        <p className="font-medium text-purple-600">{ad.title}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(ad.startDate).toLocaleDateString()} - {new Date(ad.endDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Button size="sm" onClick={() => handleAdApproval(ad.id, true)}>Approve</Button>
                                                    <Button variant="danger" size="sm" onClick={() => handleAdApproval(ad.id, false)}>Reject</Button>
                                                </div>
                                            </div>
                                        </li>
                                    )) : <p className="p-6 text-center text-gray-500">No pending advertisements.</p>}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {/* Modal to display documents */}
            <Modal isOpen={isDocModalOpen} onClose={() => setIsDocModalOpen(false)} title={`Documents for ${selectedUserName}`}>
                <div>
                    {selectedUserDocs.length > 0 ? (
                        <ul className="space-y-3">
                            {selectedUserDocs.map((doc) => (
                                <li key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                    <span className="font-medium text-gray-700">{doc.documentTypeName}</span>
                                    <a href={doc.filePath} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                                        View
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500">This user has not uploaded any documents yet.</p>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
