import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Upload, Save, DollarSign } from 'lucide-react';

const ProfileManagement = () => {
    const { user, updateUser } = useAuth();
    const isWorker = user?.role === 'WORKER';
    
    const [formData, setFormData] = useState({
        fullName: '', tagline: '', description: '', skills: '', availability: 'Available',
        street: '', city: '', state: '', zipCode: '',
        rate: '', per: 'month',
    });
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [aiGenerating, setAiGenerating] = useState(false);

    const handleGenerateAiBio = async () => {
        setAiGenerating(true);
        const toastId = toast.loading("Generating AI Bio & Tagline...");
        try {
            const response = await api.post('/ai/generate-bio', {
                primaryService: user?.primaryService || 'Cook',
                experience: user?.experience || 3,
                skills: formData.skills || 'Cooking, Cleaning, Hygiene',
                city: formData.city || 'Mumbai'
            });

            const { tagline, description } = response.data.data;
            setFormData(prev => ({
                ...prev,
                tagline: tagline || prev.tagline,
                description: description || prev.description
            }));
            toast.success("✨ AI Tagline & Bio generated!", { id: toastId });
        } catch (err) {
            console.error("AI Bio Generation failed:", err);
            toast.error("Failed to generate AI Bio.", { id: toastId });
        } finally {
            setAiGenerating(false);
        }
    };

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                tagline: user.tagline || '',
                description: user.description || '',
                skills: user.skills?.join(', ') || '',
                availability: user.availability || 'Available',
                street: user.address?.street || '',
                city: user.address?.city || '',
                state: user.address?.state || '',
                zipCode: user.address?.zipCode || '',
                rate: user.pricing?.rate || '',
                per: user.pricing?.per || 'month',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.name === 'profileImage') {
            setProfileImageFile(e.target.files[0]);
        } else if (e.target.name === 'galleryImages') {
            setGalleryFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Updating profile...");

        const dataToSubmit = new FormData();
        for (const key in formData) {
            dataToSubmit.append(key, formData[key]);
        }
        if (profileImageFile) {
            dataToSubmit.append('profileImage', profileImageFile);
        }
        galleryFiles.forEach(file => {
            dataToSubmit.append('galleryImages', file);
        });

        try {
            const response = await api.patch('/users/me/profile', dataToSubmit, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            updateUser(response.data.data);
            toast.success("Profile updated successfully!", { id: toastId });
            setProfileImageFile(null);
            setGalleryFiles([]);
        } catch (error) {
            console.error("Profile update failed:", error);
            toast.error(error.response?.data?.message || "Failed to update profile.", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-lg bg-[var(--color-bg-component)] p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-[var(--color-text-strong)] mb-6">Manage Your Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6 divide-y divide-[var(--color-border)]">
                
                <section className="pt-6">
                    <h3 className="text-lg font-medium text-[var(--color-text-strong)]">Personal Info & Profile Photo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 items-center">
                        <div>
                            <label className="block text-sm font-medium">Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Profile Photo Upload</label>
                            <div className="mt-2 flex items-center gap-4">
                                <img
                                    src={profileImageFile ? URL.createObjectURL(profileImageFile) : (user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600')}
                                    alt="Profile Preview"
                                    className="h-16 w-16 rounded-full object-cover border-2 border-[var(--color-primary)] shadow-md"
                                />
                                <input
                                    type="file"
                                    name="profileImage"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-[var(--color-primary)] file:text-white hover:file:bg-[var(--color-primary-hover)] cursor-pointer"
                                />
                            </div>
                            {profileImageFile && <p className="text-xs text-green-400 mt-1">New photo selected: {profileImageFile.name}</p>}
                        </div>
                    </div>
                </section>
                
                <section className="pt-6">
                    <h3 className="text-lg font-medium text-[var(--color-text-strong)]">Address</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium">Street</label>
                            <input type="text" name="street" value={formData.street} onChange={handleChange} />
                        </div>
                         <div>
                            <label className="block text-sm font-medium">City</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} />
                        </div>
                         <div>
                            <label className="block text-sm font-medium">State</label>
                            <input type="text" name="state" value={formData.state} onChange={handleChange} />
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Zip Code</label>
                            <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} />
                        </div>
                    </div>
                </section>

                {isWorker && (
                    <>
                        <section className="pt-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-[var(--color-text-strong)]">Professional Details</h3>
                                <button type="button" onClick={handleGenerateAiBio} disabled={aiGenerating} className="btn bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 !px-3 !py-1.5 shadow-md hover:from-purple-700 hover:to-indigo-700">
                                    <span>✨ Generate Bio with AI</span>
                                </button>
                            </div>
                            <div className="space-y-4 mt-4">
                                <div>
                                    <label className="block text-sm font-medium">Tagline / Short Bio</label>
                                    <input type="text" name="tagline" placeholder="e.g., Expert in South Indian cuisine" value={formData.tagline} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">About Me (Description)</label>
                                    <textarea name="description" rows={4} value={formData.description} onChange={handleChange} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium">Skills (comma-separated)</label>
                                        <input type="text" name="skills" placeholder="e.g., Cooking, Cleaning, Child Care" value={formData.skills} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Current Availability</label>
                                       <select name="availability" value={formData.availability} onChange={handleChange}>
                                            <option>Available</option>
                                            <option>Not Available</option>
                                       </select>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="pt-6">
                            <h3 className="text-lg font-medium text-[var(--color-text-strong)]">Pricing</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end mt-4">
                                <div>
                                    <label className="block text-sm font-medium">Rate</label>
                                    <div className="relative">
                                       <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-muted)]" />
                                       <input type="number" name="rate" className="pl-10" placeholder="500" value={formData.rate} onChange={handleChange} />
                                    </div>
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium">Per</label>
                                    <select name="per" value={formData.per} onChange={handleChange}>
                                        <option value="hour">Hour</option>
                                        <option value="day">Day</option>
                                        <option value="month">Month</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        <section className="pt-6">
                            <h3 className="text-lg font-medium text-[var(--color-text-strong)]">My Gallery</h3>
                             <div className="mt-4">
                                <label className="block text-sm font-medium">Upload New Gallery Photos</label>
                                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-[var(--color-border)] px-6 py-10">
                                   <div className="text-center">
                                        <Upload className="mx-auto h-12 w-12 text-[var(--color-text-muted)]" />
                                        <div className="mt-4 flex text-sm leading-6 text-[var(--color-text-muted)]">
                                            <label htmlFor="galleryImages" className="relative cursor-pointer rounded-md bg-[var(--color-bg-component)] font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
                                                <span>{galleryFiles.length > 0 ? `${galleryFiles.length} files selected` : 'Select files'}</span>
                                                <input id="galleryImages" name="galleryImages" type="file" multiple className="sr-only" onChange={handleFileChange} accept="image/*" />
                                            </label>
                                        </div>
                                         <p className="text-xs leading-5 text-[var(--color-text-muted)]/80">Add up to 5 photos of your work</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                )}
                
                <div className="flex justify-end pt-6">
                    <button type="submit" className="btn btn-primary flex items-center gap-2" disabled={loading}>
                        <Save size={18}/> {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileManagement;