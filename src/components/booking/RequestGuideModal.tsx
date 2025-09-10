import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

// واجهة للبيانات التي يتم إرسالها عند تقديم الطلب
export interface GuideRequestPayload {
    startDate: string;
    endDate: string;
    notes: string;
}

interface RequestGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: GuideRequestPayload) => void;
    guideName: string;
    isLoading: boolean;
}

const RequestGuideModal: React.FC<RequestGuideModalProps> = ({ isOpen, onClose, onSubmit, guideName, isLoading }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // التحقق من أن تاريخ البداية ليس بعد تاريخ النهاية
        if (new Date(startDate) > new Date(endDate)) {
            alert("Start date cannot be after end date.");
            return;
        }
        onSubmit({ startDate, endDate, notes });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Request ${guideName}`}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <Input
                        label="Start Date"
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                    <Input
                        label="End Date"
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                            Notes (Optional)
                        </label>
                        <textarea
                            id="notes"
                            rows={4}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Any specific requests or details for the tour..."
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send Request'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default RequestGuideModal;
