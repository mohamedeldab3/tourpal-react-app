import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { checkUserDocuments, uploadDocument, deleteDocument, RequiredDocument } from '../../api/userService';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { toast } from "sonner"; // Import toast

const DocumentManager: React.FC = () => {
    const [requiredDocs, setRequiredDocs] = useState<RequiredDocument[]>([]);
    const [files, setFiles] = useState<{ [key: string]: File | null }>({});
    const [notes, setNotes] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState<string | null>(null); // Track by doc name
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const reqDocs = await checkUserDocuments();
            setRequiredDocs(reqDocs);
        } catch (err) {
            console.error("Failed to fetch document data:", err);
            setError("Could not load document information. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFileChange = (docName: string, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFiles(prev => ({ ...prev, [docName]: event.target.files[0] }));
        }
    };

    const handleNotesChange = (docName: string, event: React.ChangeEvent<HTMLInputElement>) => {
        setNotes(prev => ({ ...prev, [docName]: event.target.value }));
    };

    const handleUpload = async (doc: RequiredDocument) => {
        const file = files[doc.documentName];
        if (!file || !user?.email) {
            toast.error('Please select a file and ensure you are logged in.'); // Use toast.error
            return;
        }

        setIsUploading(doc.documentName);
        setError(null);

        const formData = new FormData();
        formData.append('File', file);
        formData.append('DocumentType', doc.documentType.toString());
        formData.append('Email', user.email);
        formData.append('Notes', notes[doc.documentName] || '');

        try {
            await uploadDocument(formData);
            toast.success('Document uploaded successfully!'); // Use toast.success
            await fetchData();
            setFiles(prev => ({ ...prev, [doc.documentName]: null }));
            setNotes(prev => ({ ...prev, [doc.documentName]: '' }));
        } catch (err) {
            console.error("Failed to upload document:", err);
            setError(`Failed to upload ${doc.documentName}. Please try again.`);
        } finally {
            setIsUploading(null);
        }
    };

    const handleDelete = async (documentId: number) => {
        if (!window.confirm('Are you sure you want to delete this document?')) {
            return;
        }

        try {
            await deleteDocument(documentId);
            toast.success('Document deleted successfully.'); // Use toast.success
            await fetchData();
        } catch (err) {
            console.error("Failed to delete document:", err);
            setError('Failed to delete document. Please try again.');
        }
    };

    if (isLoading) {
        return <p>Loading document status...</p>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow mt-6">
            <h3 className="text-xl font-bold mb-4">Your Documents</h3>
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
            
            <div className="space-y-6">
                {requiredDocs.map((doc) => (
                    <div key={doc.documentName} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800">{doc.documentName}</span>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${doc.isUploaded ? (doc.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800') : 'bg-red-100 text-red-800'}`}>
                                {doc.isUploaded ? (doc.isVerified ? 'Verified' : 'Pending Review') : 'Not Uploaded'}
                            </span>
                        </div>

                        {doc.isUploaded && (
                            <div className="text-right mt-2">
                                <Button onClick={() => handleDelete(doc.id)} variant="danger" size="sm">
                                    Delete
                                </Button>
                            </div>
                        )}

                        {!doc.isUploaded && (
                            <div className="mt-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor={`file-${doc.documentName}`} className="sr-only">File</label>
                                        <input
                                            id={`file-${doc.documentName}`}
                                            type="file"
                                            onChange={(e) => handleFileChange(doc.documentName, e)}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            id={`notes-${doc.documentName}`}
                                            type="text"
                                            placeholder="Notes (optional)"
                                            value={notes[doc.documentName] || ''}
                                            onChange={(e) => handleNotesChange(doc.documentName, e)}
                                        />
                                    </div>
                                </div>
                                <div className="text-right mt-2">
                                    <Button 
                                        onClick={() => handleUpload(doc)} 
                                        disabled={isUploading === doc.documentName || !files[doc.documentName]}>
                                        {isUploading === doc.documentName ? 'Uploading...' : 'Upload'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DocumentManager;