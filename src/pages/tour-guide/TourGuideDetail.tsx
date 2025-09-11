import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTourGuideDetails, requestTourGuide, TourGuideDetails } from '../../api/tourGuideService';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import RequestGuideModal, { GuideRequestPayload } from '../../components/booking/RequestGuideModal';
import { toast } from "sonner"; // Import toast

const TourGuideDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const auth = useAuth(); // استخدام hook المصادقة

    const [guide, setGuide] = useState<TourGuideDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // حالة للنافذة المنبثقة وحالة التحميل للطلب
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchGuideDetails = async () => {
                // ... الكود السابق لجلب البيانات
                setIsLoading(true);
                setError(null);
                try {
                    const data = await getTourGuideDetails(id);
                    setGuide(data);
                } catch (err) {
                    setError('Failed to load guide details. Please try again later.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchGuideDetails();
        }
    }, [id]);

    const handleRequestClick = () => {
        if (!auth.isAuthenticated) {
            navigate('/login'); // توجيه المستخدم لتسجيل الدخول إذا لم يكن مسجلاً
        } else {
            setIsModalOpen(true);
        }
    };

    const handleRequestSubmit = async (payload: GuideRequestPayload) => {
        if (!id) return;
        setIsSubmitting(true);
        try {
            await requestTourGuide({
                tourGuideId: id,
                startDate: payload.startDate,
                endDate: payload.endDate,
                requestNotes: payload.notes,
                requiredLanguageId: 1 // قيمة افتراضية مؤقتًا
            });
            toast.success('Request sent successfully!'); // Use toast.success
            setIsModalOpen(false);
        } catch (error) {
            toast.error('Failed to send request. Please try again.'); // Use toast.error
            console.error('Request submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="text-center py-20">Loading guide profile...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!guide) return <div className="text-center py-20">Tour guide not found.</div>;

    return (
        <>
            <div className="bg-gray-50 min-h-screen py-12">
                <div className="container mx-auto px-6">
                    <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 flex flex-col md:flex-row gap-8">
                        {/* ... (الكود السابق لعرض الصورة والتفاصيل) */}
                        <div className="md:w-1/3 text-center">
                            <img 
                                src={guide.profilePictureUrl || `https://placehold.co/400x400/E2E8F0/4A5568?text=${guide.fullName.charAt(0)}`} 
                                alt={guide.fullName}
                                className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-purple-200"
                            />
                            <h1 className="text-3xl font-bold mt-4 text-gray-800">{guide.fullName}</h1>
                            <p className="text-gray-600">{guide.city}</p>
                            <Button className="mt-6 w-full" onClick={handleRequestClick}>Request This Guide</Button>
                        </div>

                        <div className="md:w-2/3">
                             <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">About Me</h2>
                            <p className="text-gray-700 mt-4 text-lg leading-relaxed">
                                {guide.bio || "No biography provided."}
                            </p>
                             <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-700">Experience</h3>
                                    <p className="text-gray-600 mt-2">{guide.experienceYears} Years</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-700">Languages</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {guide.languages.length > 0 ? guide.languages.map(lang => (
                                            <span key={lang} className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">{lang}</span>
                                        )) : <p className="text-gray-500">No languages listed.</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* إضافة النافذة المنبثقة هنا */}
            {guide && (
                <RequestGuideModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleRequestSubmit}
                    guideName={guide.fullName}
                    isLoading={isSubmitting}
                />
            )}
        </>
    );
};

export default TourGuideDetail;