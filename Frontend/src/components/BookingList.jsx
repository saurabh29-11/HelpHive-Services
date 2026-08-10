import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Check, X, Clock, Star, MapPin, AlertTriangle, CreditCard, MessageSquare, Calendar, RefreshCw } from 'lucide-react';
import EscrowModal from './EscrowModal';
import DirectChatModal from './DirectChatModal';
import AttendanceTracker from './AttendanceTracker';
import { useNavigate } from 'react-router-dom';

const statusStyles = {
    PENDING: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    CONFIRMED: 'bg-green-500/20 text-green-300 border-green-500/30',
    REJECTED: 'bg-red-500/20 text-red-300 border-red-500/30',
    COMPLETED: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    CANCELLED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const BookingList = ({ bookings, isWorker, onUpdateStatus, onLeaveReview, onCancelBooking }) => {
    const navigate = useNavigate();
    const [chatBooking, setChatBooking] = useState(null);
    const [attendanceBookingId, setAttendanceBookingId] = useState(null);
    
    if (!bookings || bookings.length === 0) {
        return <p className="text-center text-[var(--color-text-muted)] py-8">No bookings found.</p>;
    }

    return (
        <>
            {chatBooking && (
                <DirectChatModal
                    booking={chatBooking}
                    show={!!chatBooking}
                    onClose={() => setChatBooking(null)}
                />
            )}

            <div className="space-y-4">
                {bookings.map((booking, index) => {
                    if (!booking.client || !booking.helper) {
                        return null;
                    }

                    const canBeCancelled = booking.status === 'PENDING' || booking.status === 'CONFIRMED';
                    const showAttendance = attendanceBookingId === booking._id;

                    return (
                        <motion.div
                            key={booking._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="rounded-lg border bg-[var(--color-bg-component)] p-4 shadow-md transition-all hover:shadow-lg"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={isWorker ? booking.client?.profileImage || 'https://via.placeholder.com/48' : booking.helper?.profileImage || 'https://via.placeholder.com/48'}
                                        alt="profile"
                                        className="h-12 w-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-bold text-[var(--color-text-strong)]">{isWorker ? booking.client?.fullName : booking.helper?.fullName}</p>
                                        <p className="text-sm text-[var(--color-text-muted)]">{isWorker ? booking.client?.email : booking.helper?.primaryService}</p>
                                    </div>
                                </div>
                                <div className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusStyles[booking.status]}`}>
                                    {booking.status}
                                </div>
                            </div>

                            <div className="mt-4 border-t border-[var(--color-border-subtle)] pt-4 space-y-3 text-sm text-[var(--color-text)]">
                               <p className="flex items-center gap-2">
                                   <Clock size={16} className="text-[var(--color-text-muted)]" />
                                   Requested: <strong>{format(new Date(booking.bookingDate), 'PPP')} at {booking.bookingTime}</strong>
                                </p>
                                {(booking.duration || booking.workShift) && (
                                    <p className="flex items-center gap-2 text-xs text-[var(--color-primary)] font-semibold bg-[var(--color-bg-component-subtle)] px-2 py-1 rounded w-fit">
                                        <span>Job Period: <strong>{booking.duration || '1 Month'}</strong> | Shift: <strong>{booking.workShift || 'Full Time'}</strong></span>
                                    </p>
                                )}
                                {isWorker && (
                                    <>
                                        {booking.client.address === '[hidden]' ? (
                                            <div className="flex items-center gap-2 p-3 rounded-md bg-yellow-500/10 text-yellow-300 text-xs">
                                                <AlertTriangle size={16} />
                                                <span>Accept the request to view the client's full address and contact details.</span>
                                            </div>
                                        ) : (
                                            <p className="flex items-center gap-2">
                                               <MapPin size={16} className="text-[var(--color-text-muted)]" />
                                               Client Location: <strong>{booking.client.address.city}, {booking.client.address.state}</strong>
                                            </p>
                                        )}
                                    </>
                                )}
                               {booking.message && <blockquote className="italic text-[var(--color-text-muted)] border-l-2 border-[var(--color-border)] pl-3">"{booking.message}"</blockquote>}
                            </div>
                            
                            {/* Actions Toolbar */}
                            <div className="mt-4 flex justify-end items-center flex-wrap gap-2 pt-3 border-t border-[var(--color-border-subtle)]">
                                {/* Chat & Video Call Button */}
                                <button
                                  onClick={() => setChatBooking(booking)}
                                  className="btn bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/30 !px-3 !py-1.5 flex items-center gap-1.5 text-xs font-semibold"
                                >
                                  <MessageSquare size={15} /> 💬 Live Chat & 📹 Video Call
                                </button>

                                {/* Download Contract PDF Button */}
                                {!isWorker && (booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                                  <button
                                    onClick={() => {
                                      const content = `
===========================================================
               HELPHIVE OFFICIAL SERVICE AGREEMENT
===========================================================
Booking ID: ${booking._id}
Date: ${new Date(booking.createdAt || Date.now()).toLocaleDateString()}
Status: REQUEST PENDING / CONFIRMED

CLIENT DETAILS:
Name: ${booking.client?.fullName || 'Client'}

HELPER DETAILS:
Name: ${booking.helper?.fullName || 'Helper'}
Service: ${booking.helper?.primaryService || 'Help'}

CONTRACT TERMS:
Duration: ${booking.duration || '1 Month'}
Work Shift: ${booking.workShift || 'Full Time'}
Interview Schedule: ${booking.bookingDate} at ${booking.bookingTime}

HelpHive Verification Stamp: [VERIFIED & STAMPED]
===========================================================
                                      `;
                                      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                                      const url = URL.createObjectURL(blob);
                                      const link = document.createElement('a');
                                      link.href = url;
                                      link.download = `HelpHive_Agreement_${booking._id.substring(18)}.txt`;
                                      link.click();
                                      URL.revokeObjectURL(url);
                                    }}
                                    className="btn bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600/30 !px-3 !py-1.5 flex items-center gap-1 text-xs font-semibold"
                                  >
                                    📄 Download Contract PDF
                                  </button>
                                )}

                                {/* Attendance Tracker Toggle */}
                                {(booking.status === 'CONFIRMED' || booking.status === 'COMPLETED') && (
                                  <button
                                    onClick={() => setAttendanceBookingId(showAttendance ? null : booking._id)}
                                    className="btn bg-teal-600/20 text-teal-300 border border-teal-500/40 hover:bg-teal-600/30 !px-3 !py-1.5 flex items-center gap-1.5 text-xs font-semibold"
                                  >
                                    <Calendar size={15} /> {showAttendance ? 'Hide Attendance' : '📅 Work Log & Attendance'}
                                  </button>
                                )}

                                {/* Free Replacement Guarantee Button for Client when Cancelled */}
                                {!isWorker && booking.status === 'CANCELLED' && (
                                  <button
                                    onClick={() => navigate('/find')}
                                    className="btn bg-green-600/20 text-green-300 border border-green-500/40 hover:bg-green-600/30 !px-3 !py-1.5 flex items-center gap-1.5 text-xs font-bold"
                                  >
                                    <RefreshCw size={15} /> 🔄 Request Free Replacement Worker
                                  </button>
                                )}

                                {!isWorker && booking.status === 'CONFIRMED' && (
                                    <button onClick={() => onCancelBooking(booking._id, 'terminate')} className="btn bg-red-600/20 text-red-300 border border-red-500/40 hover:bg-red-600/30 !px-3 !py-1.5 flex items-center gap-1 text-xs font-semibold">
                                        <X size={16} /> Terminate Contract
                                    </button>
                                )}
                                {!isWorker && booking.status === 'PENDING' && (
                                    <button onClick={() => onCancelBooking(booking._id, 'cancel')} className="btn btn-subtle !text-red-400 !px-3 !py-1.5 flex items-center gap-1 text-xs">
                                        <X size={16} /> Cancel Request
                                    </button>
                                )}
                                {isWorker && canBeCancelled && (
                                    <button onClick={() => onCancelBooking(booking._id, 'cancel')} className="btn btn-subtle !text-red-400 !px-3 !py-1.5 flex items-center gap-1 text-xs">
                                        <X size={16} /> Cancel
                                    </button>
                                )}
                                {isWorker && booking.status === 'PENDING' && (
                                    <div className='flex gap-2'>
                                        <button onClick={() => onUpdateStatus(booking._id, 'REJECTED')} className="btn btn-secondary !px-3 !py-1.5 flex items-center gap-1 text-xs"><X size={15} /> Reject</button>
                                        <button onClick={() => onUpdateStatus(booking._id, 'CONFIRMED')} className="btn btn-primary !px-3 !py-1.5 flex items-center gap-1 text-xs"><Check size={15} /> Accept</button>
                                    </div>
                                )}
                                {isWorker && booking.status === 'CONFIRMED' && (
                                     <button onClick={() => onUpdateStatus(booking._id, 'COMPLETED')} className="btn btn-primary !px-3 !py-1.5 flex items-center gap-1 text-xs"><Check size={15} /> Mark as Complete</button>
                                )}
                                {!isWorker && booking.status === 'COMPLETED' && !booking.review && (
                                    <button onClick={() => onLeaveReview(booking)} className="btn btn-primary !px-3 !py-1.5 flex items-center gap-1 text-xs"><Star size={15} /> Leave Review</button>
                                )}
                                {!isWorker && booking.status === 'COMPLETED' && booking.review && (
                                    <p className="text-xs text-green-400 flex items-center gap-1"><Check size={15}/> Review Submitted</p>
                                )}
                            </div>

                            {/* Attendance Tracker Collapsible Drawer */}
                            {showAttendance && (
                              <AttendanceTracker booking={booking} isWorker={isWorker} />
                            )}
                        </motion.div>
                    )
                })}
            </div>
        </>
    );
};

export default BookingList;