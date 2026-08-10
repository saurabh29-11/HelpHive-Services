import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MessageSquare } from 'lucide-react';
import api from '../api/axios';

const ReviewModal = ({ booking, show, onClose, onReviewSuccess }) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/reviews', {
        bookingId: booking._id,
        rating,
        content,
      });
      if (response.data.success) {
        onReviewSuccess(booking._id, response.data.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-lg rounded-xl bg-[var(--color-bg-component)] p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-strong)]">
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold text-[var(--color-text-strong)]">Leave a Review for {booking.helper.fullName}</h2>
                <p className="mt-2 text-[var(--color-text-muted)]">Share your experience to help others in the community.</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    {error && <p className="text-red-500 text-sm text-center bg-red-500/10 p-3 rounded-md">{error}</p>}
                    
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Rating</label>
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, index) => {
                                const starValue = index + 1;
                                return (
                                    <button type="button" key={starValue} onClick={() => setRating(starValue)}>
                                        <Star className={`h-8 w-8 cursor-pointer transition-colors ${starValue <= rating ? 'text-yellow-400' : 'text-slate-500 hover:text-yellow-300'}`} fill={starValue <= rating ? 'currentColor' : 'none'} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-[var(--color-text)]">Review</label>
                       <div className="relative mt-2">
                         <MessageSquare className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-[var(--color-text-muted)]" />
                         <textarea id="content" name="content" rows={4} value={content} onChange={(e) => setContent(e.target.value)} required placeholder="Describe your experience..." className="pl-10 !py-2.5" />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Submitting...' : 'Submit Review'}</button>
                    </div>
                </form>
            </motion.div>
        </div>
    </AnimatePresence>
  );
};

export default ReviewModal;