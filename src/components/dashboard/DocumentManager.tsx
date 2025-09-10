import React, { useState, useEffect } from 'react';
// FIX: Corrected the function name from getRequiredDocuments to checkUserDocuments
import { checkUserDocuments, uploadDocument, RequiredDocument } from '../../api/userService';
import { getDocumentsTypes, BasicListDto } from '../../api/listsService';
import Button from '../ui/Button';

const DocumentManager: React.FC = () => {
    const [requiredDocs, setRequiredDocs] = useState<RequiredDocument[]>([]);
    const [docTypes, setDocTypes] = useState<BasicListDto[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedDocTypeId, setSelectedDocTypeId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // FIX: Use the correct function name here as well
            const [reqDocs, types] = await Promise.all([checkUserDocuments(), getDocumentsTypes()]);
            setRequiredDocs(reqDocs);
            setDocTypes(types);
            if (types.length > 0) {
                setSelectedDocTypeId(types[0].id.toString());
            }
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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedFile || !selectedDocTypeId) {
            alert('Please select a document type and a file.');
            return;
        }

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('documentFile', selectedFile);
        formData.append('documentTypeId', selectedDocTypeId);

        try {
            await uploadDocument(formData);
            alert('Document uploaded successfully! It will be reviewed by the admin.');
            // Refresh the list of documents after upload
            await fetchData();
            setSelectedFile(null); // Clear the file input
        } catch (err) {
            console.error("Failed to upload document:", err);
            setError('File upload failed. Please ensure the file is a valid format and try again.');
        } finally {
            setIsUploading(false);
        }
    };

    if (isLoading) {
        return <p>Loading document status...</p>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow mt-6">
            <h3 className="text-xl font-bold mb-4">Required Documents</h3>
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
            
            {/* List of required documents */}
            <ul className="space-y-3 mb-6">
                {requiredDocs.map((doc) => (
                    <li key={doc.documentName} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <span className="font-medium text-gray-800">{doc.documentName}</span>
                        {doc.isUploaded ? (
                             <span className={`px-3 py-1 text-xs font-semibold rounded-full ${doc.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {doc.isVerified ? 'Verified' : 'Pending Review'}
                            </span>
                        ) : (
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                Not Uploaded
                            </span>
                        )}
                    </li>
                ))}
            </ul>

            {/* Upload Form */}
            <form onSubmit={handleUpload}>
                <h4 className="font-bold mb-2">Upload a New Document</h4>
                <div className="grid sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                        <label htmlFor="doc-type" className="block text-sm font-medium text-gray-700">Document Type</label>
                        <select
                            id="doc-type"
                            value={selectedDocTypeId}
                            onChange={(e) => setSelectedDocTypeId(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                            disabled={isUploading}
                        >
                            {docTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="sm:col-span-2">
                         <label htmlFor="doc-file" className="block text-sm font-medium text-gray-700">File</label>
                        <input
                            id="doc-file"
                            type="file"
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                            disabled={isUploading}
                        />
                    </div>
                </div>

                <div className="mt-4 text-right">
                    <Button type="submit" disabled={isUploading || !selectedFile}>
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default DocumentManager;

