import React, { useState, useEffect } from 'react';
import { getProviderCars, addCar, deleteCar } from '../../api/carService'; // Mock API functions
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

// Define types for the data
interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  status: string;
}

const ProviderDashboard: React.FC = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCar, setNewCar] = useState({ brand: '', model: '', year: 2024, pricePerDay: 100 });

    useEffect(() => {
        const fetchCars = async () => {
            setIsLoading(true);
            const response = await getProviderCars(); // API call
            setCars(response);
            setIsLoading(false);
        };
        fetchCars();
    }, []);

    const handleAddCar = async (e: React.FormEvent) => {
        e.preventDefault();
        const addedCar = await addCar(newCar);
        setCars([...cars, addedCar]);
        setIsModalOpen(false);
        alert('Vehicle added successfully!');
    };
    
    const handleDeleteCar = async (carId: string) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            await deleteCar(carId);
            setCars(cars.filter(car => car.id !== carId));
            alert('Vehicle deleted successfully!');
        }
    };


  return (
    <div className="p-8">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Provider Dashboard</h1>
            <Button onClick={() => setIsModalOpen(true)}>Add New Vehicle</Button>
        </div>
        
        {isLoading ? (
            <p>Loading your listings...</p>
        ) : (
            <div className="bg-white shadow overflow-x-auto sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
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
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
            <form onSubmit={handleAddCar}>
                <div className="space-y-4">
                    <Input label="Brand" value={newCar.brand} onChange={(e) => setNewCar({...newCar, brand: e.target.value})} required />
                    <Input label="Model" value={newCar.model} onChange={(e) => setNewCar({...newCar, model: e.target.value})} required />
                    <Input label="Year" type="number" value={newCar.year} onChange={(e) => setNewCar({...newCar, year: parseInt(e.target.value)})} required />
                    <Input label="Price per Day ($)" type="number" value={newCar.pricePerDay} onChange={(e) => setNewCar({...newCar, pricePerDay: parseFloat(e.target.value)})} required />
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit">Add Vehicle</Button>
                </div>
            </form>
        </Modal>
    </div>
  );
};

export default ProviderDashboard;

