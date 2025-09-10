import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: { startDate: string; endDate: string; requestNotes: string }) => void;
  carPricePerDay: number;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onSubmit, carPricePerDay }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [requestNotes, setRequestNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ startDate, endDate, requestNotes });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request to Book">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Start Date"
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            label="End Date"
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
          <Input
            label="Additional Notes (optional)"
            type="text"
            id="notes"
            value={requestNotes}
            onChange={(e) => setRequestNotes(e.target.value)}
          />
          <div className="pt-2 text-lg font-semibold">
            Price per day: <span className="text-purple-600">${carPricePerDay}</span>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Send Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BookingModal;
