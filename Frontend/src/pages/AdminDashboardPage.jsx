import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldCheck, ShieldX, User, Users } from 'lucide-react';
import VerificationBadge from '../components/VerificationBadge';

const AdminDashboardPage = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const fetchVerificationRequests = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/verification-requests');
            setRequests(response.data.data);
        } catch (error) {
            console.error("Failed to fetch verification requests:", error);
            toast.error("Could not load requests.");
        } finally {
            setLoading(false);
        }
    }, []);
    
    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== 'ADMIN') {
                toast.error("Access Denied. Admins only.");
                navigate('/');
            } else {
                fetchVerificationRequests();
            }
        }
    }, [user, authLoading, navigate, fetchVerificationRequests]);

    const handleVerification = async (workerId, verificationUpdate) => {
        const toastId = toast.loading("Updating verification...");
        try {
            await api.patch(`/admin/verify-worker/${workerId}`, verificationUpdate);
            toast.success("Verification updated successfully!", { id: toastId });
            // Refresh the list after update
            fetchVerificationRequests();
        } catch (error) {
            toast.error("Failed to update verification.", { id: toastId });
            console.error("Verification update error:", error);
        }
    };
    
    if (authLoading || loading) {
        return <div className="text-center py-20 text-lg">Loading Admin Panel...</div>;
    }

    return (
        <div className="flex min-h-screen flex-col bg-[var(--color-bg)]">
            <Navbar />
            <main className="flex-grow py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <header className="mb-10">
                        <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-strong)]">
                            Admin Dashboard
                        </h1>
                        <p className="mt-2 text-lg text-[var(--color-text)]">
                            Manage worker verifications and platform users.
                        </p>
                    </header>
                    
                    <div className="rounded-lg bg-[var(--color-bg-component)] p-6 shadow-lg">
                        <h2 className="text-2xl font-semibold text-[var(--color-text-strong)] mb-6">Pending Verification Requests</h2>
                        
                        {requests.length > 0 ? (
                            <div className="space-y-4">
                                {requests.map(worker => (
                                    <div key={worker._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-md border border-[var(--color-border)] p-4">
                                        <div className="flex items-center gap-4">
                                            <img src={worker.profileImage || 'https://via.placeholder.com/48'} alt={worker.fullName} className="h-12 w-12 rounded-full" />
                                            <div>
                                                <Link to={`/helper/${worker._id}`} className="font-bold text-[var(--color-text-strong)] hover:underline">{worker.fullName}</Link>
                                                <p className="text-sm text-[var(--color-text-muted)]">{worker.email}</p>
                                            </div>
                                        </div>
                                         <div className="flex items-center gap-4 flex-wrap">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm">ID:</span>
                                                <VerificationBadge type="id" isVerified={worker.isVerified.id} />
                                            </div>
                                             <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm">Police:</span>
                                                <VerificationBadge type="police" isVerified={worker.isVerified.police} />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm">PAN:</span>
                                                <VerificationBadge type="pan" isVerified={worker.isVerified.pan} />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <button 
                                                onClick={() => handleVerification(worker._id, { idVerified: !worker.isVerified.id })}
                                                className={`btn btn-subtle !px-2 !py-1 text-xs ${worker.isVerified.id ? 'text-red-500' : 'text-green-500'}`}
                                            >
                                                {worker.isVerified.id ? <ShieldX size={14} className="mr-1" /> : <ShieldCheck size={14} className="mr-1" />} Toggle ID
                                            </button>
                                            <button 
                                                onClick={() => handleVerification(worker._id, { policeVerified: !worker.isVerified.police })}
                                                className={`btn btn-subtle !px-2 !py-1 text-xs ${worker.isVerified.police ? 'text-red-500' : 'text-blue-500'}`}
                                            >
                                                 {worker.isVerified.police ? <ShieldX size={14} className="mr-1" /> : <ShieldCheck size={14} className="mr-1" />} Toggle Police
                                            </button>
                                            <button 
                                                onClick={() => handleVerification(worker._id, { panVerified: !worker.isVerified.pan })}
                                                className={`btn btn-subtle !px-2 !py-1 text-xs ${worker.isVerified.pan ? 'text-red-500' : 'text-purple-500'}`}
                                            >
                                                 {worker.isVerified.pan ? <ShieldX size={14} className="mr-1" /> : <ShieldCheck size={14} className="mr-1" />} Toggle PAN
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-[var(--color-text-muted)] py-8">No pending verification requests.</p>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AdminDashboardPage;