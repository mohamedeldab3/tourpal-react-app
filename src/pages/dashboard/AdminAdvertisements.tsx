import React, { useEffect, useState } from 'react';
import { getPendingAdvertisements, handleAdvertisement, AdvertisementDto } from '../../api/bannerService';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const AdminAdvertisements: React.FC = () => {
    const [advertisements, setAdvertisements] = useState<AdvertisementDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [currentAdId, setCurrentAdId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchAdvertisements();
    }, []);

    const fetchAdvertisements = async () => {
        try {
            setLoading(true);
            const data = await getPendingAdvertisements();
            // Filter for pending ads if the API returns all ads
            // Assuming status 1 is pending based on common enum practices, adjust if needed
            setAdvertisements(data.filter(ad => ad.status === 1)); 
        } catch (err) {
            console.error("Failed to fetch advertisements", err);
            setError("Failed to load advertisements.");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (adId: string, isApproved: boolean) => {
        try {
            await handleAdvertisement(adId, isApproved);
            alert(`Advertisement ${isApproved ? 'approved' : 'rejected'} successfully!`);
            fetchAdvertisements(); // Refresh the list
        } catch (err) {
            console.error(`Failed to ${isApproved ? 'approve' : 'reject'} advertisement`, err);
            setError(`Failed to ${isApproved ? 'approve' : 'reject'} advertisement.`);
        }
    };

    const handleRejectClick = (adId: string) => {
        setCurrentAdId(adId);
        setShowRejectModal(true);
    };

    const confirmReject = async () => {
        if (currentAdId) {
            try {
                await handleAdvertisement(currentAdId, false, rejectionReason);
                alert('Advertisement rejected successfully!');
                setShowRejectModal(false);
                setRejectionReason('');
                setCurrentAdId(null);
                fetchAdvertisements();
            } catch (err) {
                console.error('Failed to reject advertisement', err);
                setError('Failed to reject advertisement.');
            }
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading advertisements...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Manage Advertisements</h1>
            {advertisements.length === 0 ? (
                <p className="text-center text-gray-600">No pending advertisements to review.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {advertisements.map((ad) => (
                        <div key={ad.id} className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-2">{ad.title}</h2>
                            {ad.imagePath && (
                                <img src={ad.imagePath} alt={ad.title} className="w-full h-48 object-cover rounded-md mb-4"/>
                            )}
                            <p className="text-gray-700 mb-2">Description: {ad.description}</p>
                            <p className="text-sm text-gray-500">Position: {ad.position}</p>
                            <p className="text-sm text-gray-500">Start Date: {new Date(ad.startDate).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-500">End Date: {new Date(ad.endDate).toLocaleDateString()}</p>
                            <div className="mt-4 flex space-x-2">
                                <Button onClick={() => handleAction(ad.id, true)} className="bg-green-500 hover:bg-green-600 text-white">Approve</Button>
                                <Button onClick={() => handleRejectClick(ad.id)} className="bg-red-500 hover:bg-red-600 text-white">Reject</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal show={showRejectModal} onClose={() => setShowRejectModal(false)} title="Reject Advertisement">
                <div className="p-4">
                    <p className="mb-4">Please provide a reason for rejecting this advertisement:</p>
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                        rows={4}
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Reason for rejection..."
                    ></textarea>
                    <div className="flex justify-end space-x-2">
                        <Button onClick={() => setShowRejectModal(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Cancel</Button>
                        <Button onClick={confirmReject} className="bg-red-500 hover:bg-red-600 text-white" disabled={!rejectionReason.trim()}>Confirm Reject</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminAdvertisements;
