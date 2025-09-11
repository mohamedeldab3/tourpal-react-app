import React, { useState, useEffect, useCallback } from 'react';
import { getProviderCars, addCar, deleteCar } from '../../api/carService';
import type { Car } from '../../api/carService';
import type { CarFormData } from '../../components/dashboard/CarForm'; // Import form data type
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import CarForm from '../../components/dashboard/CarForm'; // Import the new form
import { toast } from "sonner"; // Import toast

const ProviderDashboard: React.FC = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchCars = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getProviderCars();
            setCars(response);
        } catch (error) {
            console.error("Failed to fetch provider cars:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCars();
    }, [fetchCars]);

    const handleAddCar = async (formData: CarFormData) => {
        setIsSubmitting(true);
        try {
            await addCar(formData);
            setIsModalOpen(false);
            toast.success('Vehicle added successfully!'); // Use toast.success
            fetchCars(); // Refresh the list
        } catch (error) {
            console.error("Failed to add car:", error);
            toast.error('Failed to add vehicle. Please try again.'); // Use toast.error
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDeleteCar = async (carId: string) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            try {
                await deleteCar(carId);
                setCars(cars.filter(car => car.id !== carId));
                toast.success('Vehicle deleted successfully!'); // Use toast.success
            } catch (error) {
                console.error("Failed to delete car:", error);
                toast.error('Failed to delete vehicle. Please try again.'); // Use toast.error
            }
        }
    };

  return (
    <div className="p-8">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Vehicles</h1>
            <Button onClick={() => setIsModalOpen(true)}>Add New Vehicle</Button>
        </div>
        
        {isLoading ? (
            <p>Loading your listings...</p>
        ) : (
            <div className="bg-white shadow overflow-x-auto sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {/* Table headers remain the same */}
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/Day</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {cars.length > 0 ? cars.map((car) => (
                            <tr key={car.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">{car.brand} {car.model}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{car.year}</td>
                                <td className="px-6 py-4 whitespace-nowrap">${car.pricePerDay}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${car.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {car.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <Button variant="secondary" size="sm">Edit</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteCar(car.id)}>Delete</Button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={5} className="text-center py-4">No vehicles found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add a New Vehicle">
            <CarForm onSubmit={handleAddCar} isLoading={isSubmitting} />
        </Modal>
    </div>
  );
};

export default ProviderDashboard;