import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Upload, Save, ShieldCheck } from 'lucide-react';

const VerificationDocs = () => {
    const { user, updateUser } = useAuth();
    const [idProofFile, setIdProofFile] = useState(null);
    const [policeFile, setPoliceFile] = useState(null);
    const [panFile, setPanFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.name === 'idProof') {
            setIdProofFile(e.target.files[0]);
        } else if (e.target.name === 'policeVerification') {
            setPoliceFile(e.target.files[0]);
        } else if (e.target.name === 'panCard') {
            setPanFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!idProofFile && !policeFile && !panFile) {
            toast.error("Please select at least one file to upload.");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Uploading documents...");

        const dataToSubmit = new FormData();
        if (idProofFile) dataToSubmit.append('idProof', idProofFile);
        if (policeFile) dataToSubmit.append('policeVerification', policeFile);
        if (panFile) dataToSubmit.append('panCard', panFile);

        try {
            const response = await api.patch('/users/me/verification-documents', dataToSubmit, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            updateUser(response.data.data); // Update user in context to get new doc URLs
            toast.success("Documents uploaded successfully!", { id: toastId });
            setIdProofFile(null);
            setPoliceFile(null);
            setPanFile(null);
        } catch (error) {
            console.error("Document upload failed:", error);
            toast.error(error.response?.data?.message || "Failed to upload documents.", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-lg bg-[var(--color-bg-component)] p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-[var(--color-text-strong)] mb-2">Verification Documents</h2>
            <p className="text-[var(--color-text-muted)] mb-4">Upload your documents to get verified. This increases trust and your chances of being hired.</p>

            {/* ✨ AI OCR Status Banner */}
            <div className="mb-6 rounded-lg bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-purple-900/30 p-4 border border-purple-500/30">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-purple-400" />
                    <h4 className="text-sm font-bold text-purple-300">✨ AI OCR Automated Document Scanner Active</h4>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">Uploaded documents will be scanned by AI for automatic Name, DOB, and ID Number verification.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <label className="block text-sm font-medium leading-6 text-[var(--color-text)]">ID Proof (Aadhaar, Voter ID, etc.)</label>
                    {user.verificationDocuments?.idProof && <p className="text-xs text-green-400 mt-1">A document has already been uploaded.</p>}
                    <div className="mt-2 flex items-center gap-4">
                        <input type="file" name="idProof" onChange={handleFileChange} accept="image/*,.pdf" className="flex-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-bg-component-subtle)] file:text-[var(--color-text)] hover:file:bg-[var(--color-border)]" />
                    </div>
                    {idProofFile && <p className="text-xs text-[var(--color-text-muted)] mt-1">Selected: {idProofFile.name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium leading-6 text-[var(--color-text)]">Police Verification Certificate</label>
                    {user.verificationDocuments?.policeVerification && <p className="text-xs text-green-400 mt-1">A document has already been uploaded.</p>}
                    <div className="mt-2 flex items-center gap-4">
                        <input type="file" name="policeVerification" onChange={handleFileChange} accept="image/*,.pdf" className="flex-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-bg-component-subtle)] file:text-[var(--color-text)] hover:file:bg-[var(--color-border)]" />
                    </div>
                     {policeFile && <p className="text-xs text-[var(--color-text-muted)] mt-1">Selected: {policeFile.name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium leading-6 text-[var(--color-text)]">PAN Card</label>
                    {user.verificationDocuments?.panCard && <p className="text-xs text-green-400 mt-1">A document has already been uploaded.</p>}
                    <div className="mt-2 flex items-center gap-4">
                        <input type="file" name="panCard" onChange={handleFileChange} accept="image/*,.pdf" className="flex-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-bg-component-subtle)] file:text-[var(--color-text)] hover:file:bg-[var(--color-border)]" />
                    </div>
                     {panFile && <p className="text-xs text-[var(--color-text-muted)] mt-1">Selected: {panFile.name}</p>}
                </div>

                <div className="flex justify-end pt-4 border-t border-[var(--color-border)]">
                    <button type="submit" className="btn btn-primary flex items-center gap-2" disabled={loading}>
                        <Upload size={18}/> {loading ? 'Uploading...' : 'Upload Selected Files'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VerificationDocs;