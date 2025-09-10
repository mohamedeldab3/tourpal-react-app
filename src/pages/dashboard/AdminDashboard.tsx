import React, { useState, useEffect } from 'react';
import { getPendingApprovals, approveUser, suspendUser, getUsersList } from '../../api/userService'; // Mock API functions
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

// Define types for the data
interface PendingUser {
  userId: string;
  fullName: string;
  userType: string;
  createdAt: string;
}

interface User {
    id: string;
    fullName: string;
    email: string;
    userType: string;
    status: string;
}

const AdminDashboard: React.FC = () => {
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('approvals');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            if (activeTab === 'approvals') {
                const response = await getPendingApprovals();
                setPendingUsers(response);
            } else if (activeTab === 'users') {
                const response = await getUsersList();
                setUsers(response);
            }
            setIsLoading(false);
        };
        fetchData();
    }, [activeTab]);

    const handleApprove = async (userId: string) => {
        await approveUser({ userId, status: 'Approved', notes: 'Approved by admin' });
        setPendingUsers(pendingUsers.filter(user => user.userId !== userId));
        alert('User approved successfully!');
    };
    
    const handleReject = async (userId: string) => {
        await approveUser({ userId, status: 'Rejected', notes: 'Rejected by admin' });
        setPendingUsers(pendingUsers.filter(user => user.userId !== userId));
        alert('User rejected successfully!');
    };

    const handleSuspend = async (userId: string) => {
        await suspendUser(userId);
        setUsers(users.map(user => user.id === userId ? { ...user, status: 'Suspended' } : user));
        alert('User suspended successfully!');
    };


  return (
    <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                    onClick={() => setActiveTab('approvals')}
                    className={`${
                        activeTab === 'approvals'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    Pending Approvals
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`${
                        activeTab === 'users'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    User Management
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
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-lg font-medium text-purple-600">{user.fullName}</p>
                                                <p className="text-sm text-gray-500">{user.userType} - Requested on {new Date(user.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex space-x-4">
                                                <Button onClick={() => handleApprove(user.userId)}>Approve</Button>
                                                <Button variant="danger" onClick={() => handleReject(user.userId)}>Reject</Button>
                                            </div>
                                        </div>
                                    </li>
                                )) : <p className="p-4">No pending approvals.</p>}
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
            </div>
        )}
    </div>
  );
};

export default AdminDashboard;

