import React, { useState, useEffect } from 'react';
// FIX: Corrected the function names to match the exports in the service files
import { getCarTypesList, getCarFeatures, getCities, BasicListDto } from '../../api/listsService';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { toast } from "sonner"; // Import toast

interface CarFormProps {
    onSubmit: (data: any) => void;
    initialData?: any;
    isSubmitting: boolean;
}

const CarForm: React.FC<CarFormProps> = ({ onSubmit, initialData = {}, isSubmitting }) => {
    const [formData, setFormData] = useState({
        carTypeId: initialData.carTypeId || '',
        brand: initialData.brand || '',
        model: initialData.model || '',
        year: initialData.year || new Date().getFullYear(),
        plateNumber: initialData.plateNumber || '',
        capacity: initialData.capacity || 4,
        pricePerDay: initialData.pricePerDay || 50,
        description: initialData.description || '',
        cityId: initialData.cityId || '',
        featureIds: initialData.featureIds || [],
    });

    const [carTypes, setCarTypes] = useState<BasicListDto[]>([]);
    const [features, setFeatures] = useState<BasicListDto[]>([]);
    const [cities, setCities] = useState<BasicListDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                // FIX: Use the correct function names here
                const [types, feats, allCities] = await Promise.all([
                    getCarTypesList(),
                    getCarFeatures(),
                    getCities(),
                ]);
                setCarTypes(types);
                setFeatures(feats);
                setCities(allCities);
                // Set default values if not already set
                if (!formData.carTypeId && types.length > 0) {
                    setFormData(prev => ({ ...prev, carTypeId: types[0].id.toString() }));
                }
                if (!formData.cityId && allCities.length > 0) {
                    setFormData(prev => ({ ...prev, cityId: allCities[0].id.toString() }));
                }
            } catch (error) {
                console.error("Failed to load car form data", error);
                toast.error("Could not load necessary data for the form. Please try again later."); // Use toast.error
            } finally {
                setIsLoading(false);
            }
        };
        fetchDropdownData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFeatureChange = (featureId: string) => {
        setFormData(prev => {
            const newFeatureIds = prev.featureIds.includes(featureId)
                ? prev.featureIds.filter((id: string) => id !== featureId)
                : [...prev.featureIds, featureId];
            return { ...prev, featureIds: newFeatureIds };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (isLoading) {
        return <p>Loading form...</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Car Type and City */}
                <div>
                    <label htmlFor="carTypeId" className="block text-sm font-medium text-gray-700">Car Type</label>
                    <select id="carTypeId" name="carTypeId" value={formData.carTypeId} onChange={handleChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm">
                        {carTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="cityId" className="block text-sm font-medium text-gray-700">City</label>
                    <select id="cityId" name="cityId" value={formData.cityId} onChange={handleChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm">
                        {cities.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
                    </select>
                </div>

                {/* Brand and Model */}
                <Input label="Brand" name="brand" value={formData.brand} onChange={handleChange} required />
                <Input label="Model" name="model" value={formData.model} onChange={handleChange} required />

                {/* Year and Plate Number */}
                 <Input label="Year" name="year" type="number" value={formData.year} onChange={handleChange} required />
                <Input label="Plate Number" name="plateNumber" value={formData.plateNumber} onChange={handleChange} required />

                 {/* Capacity and Price */}
                <Input label="Capacity (Seats)" name="capacity" type="number" value={formData.capacity} onChange={handleChange} required />
                <Input label="Price per Day ($)" name="pricePerDay" type="number" value={formData.pricePerDay} onChange={handleChange} required />
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm"></textarea>
            </div>

            {/* Features */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Features</label>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {features.map(feature => (
                        <div key={feature.id} className="flex items-center">
                            <input
                                id={`feature-${feature.id}`}
                                type="checkbox"
                                checked={formData.featureIds.includes(feature.id.toString())}
                                onChange={() => handleFeatureChange(feature.id.toString())}
                                className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                            />
                            <label htmlFor={`feature-${feature.id}`} className="ml-2 block text-sm text-gray-900">{(feature.name)}</label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Vehicle'}
                </Button>
            </div>
        </form>
    );
};

export default CarForm;