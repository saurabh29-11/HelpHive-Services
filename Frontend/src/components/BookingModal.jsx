import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MessageSquare, Clock, DollarSign, Briefcase, Hourglass, Download, CheckCircle } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const durationOptions = [
  "1 Month",
  "3 Months",
  "6 Months",
  "1 Year",
  "1 Week",
  "1 Day"
];

const workShiftOptions = [
  "Full Time (8 Hours)",
  "Live-in (24 Hours)",
  "Part Time (4 Hours)",
  "Hourly / Short Task"
];

const BookingModal = ({ helper, show, onClose, onBookingSuccess }) => {
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [duration, setDuration] = useState('1 Month');
  const [workShift, setWorkShift] = useState('Full Time (8 Hours)');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdResult, setCreatedResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Sending booking request...");
    try {
      const response = await api.post('/bookings', {
        helperId: helper._id,
        bookingDate,
        bookingTime,
        duration,
        workShift,
        message,
      });
      if (response.data.success) {
        toast.success("Booking request sent successfully!", { id: toastId });
        setCreatedResult(response.data.data);
        if (onBookingSuccess) onBookingSuccess();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send booking request.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const downloadContractPDF = () => {
    const content = `
===========================================================
               HELPHIVE OFFICIAL SERVICE AGREEMENT
===========================================================
Booking ID: ${createdResult?._id || 'BOOKING_1001'}
Date: ${new Date().toLocaleDateString()}
Status: REQUEST SENT & PENDING INTERVIEW

HELPER / PROFESSIONAL DETAILS:
Name: ${helper?.fullName || 'Helper'}
Service Role: ${helper?.primaryService || 'Domestic Help'}

JOB & CONTRACT TERMS:
Duration: ${duration}
Work Shift: ${workShift}
Interview Date: ${bookingDate} at ${bookingTime}

HelpHive Verification Stamp: [VERIFIED REQUEST]
===========================================================
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HelpHive_Agreement_Contract.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Service Agreement Contract Downloaded!");
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg rounded-xl bg-[var(--color-bg-component)] p-8 shadow-2xl my-8 border border-[var(--color-border)]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-strong)]"
          >
            <X size={24} />
          </button>

          {!createdResult ? (
            <>
              <h2 className="text-2xl font-bold text-[var(--color-text-strong)]">Book Interview: {helper.fullName}</h2>

              <div className="mt-4 rounded-lg bg-[var(--color-bg-component-subtle)] p-4 border border-[var(--color-border)]">
                  <h3 className="font-semibold text-[var(--color-text-strong)] flex items-center gap-2">
                      <DollarSign size={20} className="text-[var(--color-primary)]" />
                      Quoted Price / Rate
                  </h3>
                  {helper.pricing?.rate > 0 ? (
                    <p className="text-[var(--color-text)] mt-1">
                        Rate: <strong>₹{helper.pricing.rate} / {helper.pricing.per}</strong>
                    </p>
                  ) : (
                    <p className="text-[var(--color-text-muted)] mt-1 text-xs">
                        To be discussed during the interview.
                    </p>
                  )}
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)]">Interview Date *</label>
                    <div className="relative mt-1">
                       <Calendar className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-muted)]" />
                       <input
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          required
                          className="pl-10"
                          min={new Date().toISOString().split("T")[0]}
                       />
                    </div>
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-[var(--color-text)]">Interview Time *</label>
                    <div className="relative mt-1">
                       <Clock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-muted)]" />
                       <input
                          type="time"
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          required
                          className="pl-10"
                       />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)]">Job Duration / Period</label>
                    <div className="relative mt-1">
                       <Hourglass className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-muted)]" />
                       <select
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="pl-10"
                       >
                         {durationOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                         ))}
                       </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)]">Shift / Work Type</label>
                    <div className="relative mt-1">
                       <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-muted)]" />
                       <select
                          value={workShift}
                          onChange={(e) => setWorkShift(e.target.value)}
                          className="pl-10"
                       >
                         {workShiftOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                         ))}
                       </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)]">Message to Worker (Optional)</label>
                   <div className="relative mt-1">
                     <MessageSquare className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-[var(--color-text-muted)]" />
                     <textarea
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={`e.g., "Hi ${(helper?.fullName || 'Helper').split(' ')[0]}, looking for a full-time cook for ${duration}."`}
                        className="pl-10 !py-2.5"
                     ></textarea>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[var(--color-border)]">
                  <button type="button" onClick={onClose} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary font-bold" disabled={loading}>
                    {loading ? 'Sending Request...' : 'Send Booking Request'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-4 space-y-4">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto" />
              <h3 className="text-2xl font-bold text-[var(--color-text-strong)]">Booking Request Sent!</h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                Your interview request has been sent to {helper.fullName}. You can chat or start a 1-Click Video Call in your Dashboard!
              </p>

              <div className="pt-4 flex flex-col gap-3">
                <button onClick={downloadContractPDF} className="btn btn-primary flex items-center justify-center gap-2 w-full">
                  <Download size={18} /> Download Service Agreement Contract
                </button>
                <button onClick={onClose} className="btn btn-secondary w-full">Close Window</button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingModal;