import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAdvertisement } from '../../api/bannerService';
import { getAdvPostionsList, BasicListDto } from '../../api/listsService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from "sonner"; // Import toast

const CreateAdvertisement: React.FC = () => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [position, setPosition] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [positions, setPositions] = useState<BasicListDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const data = await getAdvPostionsList();
                setPositions(data);
                if (data.length > 0) {
                    setPosition(data[0].id.toString());
                }
            } catch (err) {
                console.error("Failed to fetch ad positions", err);
            }
        };
        fetchPositions();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) {
            setError("Please upload an image for the advertisement.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await createAdvertisement({
                title,
                image,
                position: parseInt(position),
                startDate,
                endDate
            });
            toast.success('Advertisement created successfully! It is now pending admin approval.'); // Use toast.success
            navigate('/dashboard/profile'); // Redirect to a relevant page
        } catch (err) {
            setError('Failed to create advertisement. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Create a New Advertisement</h1>
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <p className="text-red-500 text-center p-3 bg-red-50 rounded-md">{error}</p>}
                    <Input label="Ad Title" id="ad-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    
                    <div>
                        <label htmlFor="ad-position" className="block text-sm font-medium text-gray-700 mb-1">Placement</label>
                        <select id="ad-position" value={position} onChange={(e) => setPosition(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            {positions.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <Input label="Start Date" id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                    <Input label="End Date" id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                    
                    <div>
                        <label htmlFor="ad-image" className="block text-sm font-medium text-gray-700 mb-1">Ad Image</label>
                        <input id="ad-image" type="file" onChange={handleImageChange} accept="image/*" required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"/>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Submitting...' : 'Submit for Approval'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default CreateAdvertisement;