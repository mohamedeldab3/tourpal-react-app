import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRequiredDocumentsPerUserType, getCarTypesList, getUserTypes, RequiredDoc, BasicListDto } from '../../api/listsService';
import { register } from '../../api/authService';
import { uploadDocument } from '../../api/userService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

interface UserType {
  id: number;
  name: string;
}

const RegisterStep2 = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const registrationData = location.state?.formData;

    const [requiredDocs, setRequiredDocs] = useState<RequiredDoc[]>([]);
    const [files, setFiles] = useState<{ [key: number]: File | null }>({});
    const [carTypes, setCarTypes] = useState<BasicListDto[]>([]);
    const [userTypes, setUserTypes] = useState<UserType[]>([]); // New state for user types
    const [carDetails, setCarDetails] = useState({ CarTypeId: '', CarLicense: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Dynamically find Car Owner UserType ID
    const carOwnerTypeId = userTypes.find(type => type.name === 'Car Owner')?.id;
    const isCarOwner = registrationData?.UserType === carOwnerTypeId;

    useEffect(() => {
        if (!registrationData) {
            navigate('/register');
            return;
        }

        const fetchInitialData = async () => {
            try {
                const fetchedUserTypes = await getUserTypes(); // Fetch user types
                setUserTypes(fetchedUserTypes);

                const docs = await getRequiredDocumentsPerUserType(registrationData.UserType);
                setRequiredDocs(docs);

                // Use the dynamically found carOwnerTypeId
                if (registrationData.UserType === fetchedUserTypes.find(type => type.name === 'Car Owner')?.id) {
                    const types = await getCarTypesList();
                    setCarTypes(types);
                }
            } catch (err) {
                setError('Failed to load required data. Please go back and try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, [registrationData, navigate]); // Removed isCarOwner from dependency array

    const handleFileChange = (docId: number, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFiles(prev => ({ ...prev, [docId]: event.target.files[0] }));
        }
    };

    const handleCarDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCarDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const areMandatoryFieldsFilled = () => {
        const mandatoryDocsUploaded = requiredDocs
            .filter(doc => doc.isMandatory)
            .every(doc => !!files[doc.id]);
        
        if (isCarOwner) {
            return mandatoryDocsUploaded && carDetails.CarTypeId && carDetails.CarLicense;
        }

        return mandatoryDocsUploaded;
    };

    const handleSubmit = async () => {
        if (!areMandatoryFieldsFilled()) {
            alert('Please fill all mandatory fields and upload all required documents.');
            return;
        }

        setIsRegistering(true);
        setError(null);

        try {
            // 1. Register the user (with car details if applicable)
            // IMPORTANT: This assumes the backend `register` endpoint can handle these extra fields.
            const finalRegistrationData = isCarOwner ? { ...registrationData, ...carDetails } : registrationData;
            await register(finalRegistrationData);

            // 2. Upload documents
            for (const docId in files) {
                const file = files[docId];
                if (file) {
                    const formData = new FormData();
                    formData.append('File', file);
                    formData.append('DocumentType', docId);
                    formData.append('Email', registrationData.Email);
                    await uploadDocument(formData);
                }
            }

            // 3. Navigate to confirmation page
            navigate('/please-confirm', { state: { email: registrationData.Email } });

        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred during registration. Please try again.');
            console.error(err);
        } finally {
            setIsRegistering(false);
        }
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 text-center">Final Step</h2>
                {error && <p className="text-red-500 bg-red-100 p-3 rounded-md my-4">{error}</p>}
                
                {isCarOwner && (
                    <div className="mt-6">
                        <h3 className="text-xl font-bold mb-4">Car Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="car-type">Car Type <span className="text-red-500">*</span></label>
                                <select id="car-type" name="CarTypeId" value={carDetails.CarTypeId} onChange={handleCarDetailsChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md">
                                    <option value="" disabled>Select car type</option>
                                    {carTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                                </select>
                            </div>
                            <Input label="Car License Number" id="car-license" name="CarLicense" type="text" value={carDetails.CarLicense} onChange={handleCarDetailsChange} required />
                        </div>
                    </div>
                )}

                <div className="mt-6">
                    <h3 className="text-xl font-bold mb-4">Required Documents</h3>
                    <div className="space-y-4">
                        {requiredDocs.map(doc => (
                            <div key={doc.id} className="p-4 border rounded-lg">
                                <label htmlFor={`file-${doc.id}`} className="font-medium">
                                    {doc.name} {doc.isMandatory && <span className="text-red-500">*</span>}
                                </label>
                                <input id={`file-${doc.id}`} type="file" onChange={(e) => handleFileChange(doc.id, e)} className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Button onClick={handleSubmit} disabled={isRegistering || !areMandatoryFieldsFilled()}>
                        {isRegistering ? 'Registering...' : 'Complete Registration'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RegisterStep2;
