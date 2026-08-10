import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingList from '../components/BookingList';
import ReviewModal from '../components/ReviewModal';
import ProfileManagement from '../components/ProfileManagement';
import VerificationDocs from '../components/VerificationDocs';
import api from '../api/axios';
import { Send, Inbox, User, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion'; // NEW: Import motion

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [sentBookings, setSentBookings] = useState([]);
  const [receivedBookings, setReceivedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewingBooking, setReviewingBooking] = useState(null);

  const isWorker = user?.role === 'WORKER';

  const [activeTab, setActiveTab] = useState(isWorker ? 'profile' : 'sent');

  useEffect(() => {
    if (!authLoading && user) {
        setActiveTab(isWorker ? 'profile' : 'sent');
    }
  }, [isWorker, authLoading, user]);


  const fetchBookings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const promises = [api.get('/bookings/sent')];
      if (isWorker) {
        promises.push(api.get('/bookings/received'));
      }
      
      const results = await Promise.allSettled(promises);
      
      if (results[0].status === 'fulfilled') {
        setSentBookings(results[0].value.data.data);
      } else {
        console.error("Failed to fetch sent bookings:", results[0].reason);
        setError('Could not load sent bookings.');
      }

      if (isWorker && results[1]) {
        if (results[1].status === 'fulfilled') {
            setReceivedBookings(results[1].value.data.data);
        } else {
            console.error("Failed to fetch received bookings:", results[1].reason);
            setError(prev => prev ? `${prev} Could not load received bookings.` : 'Could not load received bookings.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred while fetching bookings.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, isWorker]);

  useEffect(() => {
    if (!authLoading) {
        if (!user) {
            navigate('/login');
            return;
        }
        if(activeTab === 'sent' || activeTab === 'received') {
            fetchBookings();
        }
    }
  }, [user, authLoading, navigate, fetchBookings, activeTab]);

  const handleUpdateStatus = async (bookingId, status) => {
    const toastId = toast.loading("Updating status...");
    try {
        await api.patch(`/bookings/${bookingId}/status`, { status });
        toast.success("Status updated successfully!", { id: toastId });
        fetchBookings();
    } catch (err) {
        console.error("Failed to update status:", err);
        toast.error(err.response?.data?.message || 'Failed to update booking status.', { id: toastId });
    }
  };

  const handleReviewSuccess = () => {
      fetchBookings();
  };
  
  const handleCancelBooking = async (bookingId, actionType = 'cancel') => {
    const isTermination = actionType === 'terminate';
    const confirmMessage = isTermination
      ? "Are you sure you want to terminate this active contract with the helper? The worker will be released immediately."
      : "Are you sure you want to cancel this booking request?";

    if (window.confirm(confirmMessage)) {
        const toastId = toast.loading(isTermination ? "Terminating contract..." : "Cancelling booking...");
        try {
            await api.patch(`/bookings/${bookingId}/cancel`);
            toast.success(isTermination ? "Contract terminated successfully!" : "Booking cancelled.", { id: toastId });
            fetchBookings();
        } catch (err) {
            console.error("Failed to cancel/terminate booking:", err);
            toast.error(err.response?.data?.message || 'Failed to update booking.', { id: toastId });
        }
    }
  };

  if (authLoading || (!user && !authLoading)) {
    return (
        <div className="flex min-h-screen flex-col bg-[var(--color-bg)]">
            <Navbar /> <main className="flex-grow py-20 text-center text-lg text-[var(--color-text-muted)]">Loading...</main> <Footer />
        </div>
    );
  }

  // UPDATED: Extracted tab button into a component for clarity
  const TabButton = ({ tabName, activeTab, onClick, children }) => {
    const isActive = activeTab === tabName;
    return (
      <button 
        onClick={() => onClick(tabName)} 
        className={`relative whitespace-nowrap py-4 px-1 text-sm font-medium transition-colors ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
      >
        {children}
        {isActive && (
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"
            layoutId="active-tab-indicator" // This ID enables the animation
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </button>
    );
  };

  return (
    <>
      <ReviewModal booking={reviewingBooking} show={!!reviewingBooking} onClose={() => setReviewingBooking(null)} onReviewSuccess={handleReviewSuccess} />
      <div className="flex min-h-screen flex-col bg-[var(--color-bg)]">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <header className="mb-10">
              <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-strong)]">Dashboard</h1>
              <p className="mt-2 text-lg text-[var(--color-text)]">Welcome, {user.fullName}. Manage your account and activities here.</p>
            </header>
            
            {error && <p className="text-red-500 text-center bg-red-500/10 p-4 rounded-md mb-6">{error}</p>}
            
            <div className="mb-6 border-b border-[var(--color-border)]">
                {/* UPDATED: Using the new TabButton component */}
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <TabButton tabName="profile" activeTab={activeTab} onClick={setActiveTab}>
                       <User className="inline-block mr-2 h-5 w-5"/> My Profile
                    </TabButton>
                    {isWorker && (
                         <TabButton tabName="verification" activeTab={activeTab} onClick={setActiveTab}>
                           <ShieldCheck className="inline-block mr-2 h-5 w-5"/> Verification
                        </TabButton>
                    )}
                    {isWorker && (
                        <TabButton tabName="received" activeTab={activeTab} onClick={setActiveTab}>
                           <Inbox className="inline-block mr-2 h-5 w-5"/> Received Requests
                        </TabButton>
                    )}
                    <TabButton tabName="sent" activeTab={activeTab} onClick={setActiveTab}>
                       <Send className="inline-block mr-2 h-5 w-5"/> My Sent Requests
                    </TabButton>
                </nav>
            </div>
            
            <div className="mt-8">
                {loading && (activeTab === 'sent' || activeTab === 'received') ? (
                    <p className="text-center text-[var(--color-text-muted)] py-8">Loading bookings...</p>
                ) : (
                    <>
                        {activeTab === 'profile' && <ProfileManagement />}
                        {activeTab === 'sent' && <BookingList bookings={sentBookings} isWorker={false} onLeaveReview={setReviewingBooking} onCancelBooking={handleCancelBooking}/>}
                        {isWorker && activeTab === 'received' && <BookingList bookings={receivedBookings} isWorker={true} onUpdateStatus={handleUpdateStatus} onCancelBooking={handleCancelBooking}/>}
                        {isWorker && activeTab === 'verification' && <VerificationDocs />}
                    </>
                )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default DashboardPage;