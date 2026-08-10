import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, CreditCard, Lock, Download, CheckCircle } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const EscrowModal = ({ booking, show, onClose, onPaymentSuccess }) => {
  const [amount, setAmount] = useState(500);
  const [paymentMethod, setPaymentMethod] = useState('UPI / GPay');
  const [loading, setLoading] = useState(false);
  const [paymentDone, setPaymentDone] = useState(null);

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Holding payment in Escrow...");

    try {
      const response = await api.post('/payments/escrow', {
        bookingId: booking._id,
        amount: Number(amount),
        paymentMethod
      });

      if (response.data.success) {
        toast.success("₹" + amount + " held safely in Escrow!", { id: toastId });
        setPaymentDone(response.data.data);
        if (onPaymentSuccess) onPaymentSuccess();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Escrow payment failed.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const downloadContractPDF = () => {
    const content = `
===========================================================
               HELPHIVE OFFICIAL SERVICE AGREEMENT
===========================================================
Transaction ID: ${paymentDone?.transactionId || 'HH_ESCROW_9912'}
Date: ${new Date().toLocaleDateString()}
Status: HELD IN ESCROW (100% SAFE & GUARANTEED)

CLIENT DETAILS:
Name: ${booking?.client?.fullName || 'Client'}
Email: ${booking?.client?.email || 'N/A'}

HELPER / PROFESSIONAL DETAILS:
Name: ${booking?.helper?.fullName || 'Helper'}
Service Role: ${booking?.helper?.primaryService || 'Domestic Help'}

JOB & CONTRACT TERMS:
Duration: ${booking?.duration || '1 Month'}
Work Shift: ${booking?.workShift || 'Full Time'}
Start Date: ${booking?.bookingDate || new Date().toLocaleDateString()}
Escrow Token Amount Held: ₹${amount}

TERMS & GUARANTEE:
1. Funds are held safely in HelpHive Escrow and released to helper upon completion.
2. 100% Refund Guarantee: If interview fails, full amount is refunded to client.
3. Includes 30-Day Free Replacement Guarantee.

HelpHive Verification Seal: [VERIFIED & STAMPED]
===========================================================
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HelpHive_Agreement_${booking?._id?.substring(18) || 'Contract'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Service Agreement Contract Downloaded!");
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-lg rounded-xl bg-[var(--color-bg-component)] p-8 shadow-2xl my-8 border border-purple-500/30"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-strong)]">
            <X size={24} />
          </button>

          {!paymentDone ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="h-7 w-7 text-purple-400" />
                <h2 className="text-2xl font-bold text-[var(--color-text-strong)]">Advance Escrow Deposit</h2>
              </div>

              <div className="rounded-lg bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-purple-900/30 p-4 border border-purple-500/30 mb-6">
                <p className="text-xs text-purple-200 flex items-center gap-1.5 font-semibold">
                  <Lock size={14} /> 100% Escrow Protection: Money is held safely in HelpHive Escrow and only released when the job is active & completed.
                </p>
              </div>

              <form onSubmit={handlePay} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)]">Advance Deposit Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min={100}
                    className="mt-2"
                  />
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">Recommended token amount: ₹500</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)]">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-2"
                  >
                    <option value="UPI / GPay">UPI / Google Pay / PhonePe / Paytm</option>
                    <option value="Debit / Credit Card">Debit / Credit Card (Razorpay)</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                  <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-2" disabled={loading}>
                    <CreditCard size={18} /> {loading ? 'Processing Escrow...' : `Pay ₹${amount} in Escrow`}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-4 space-y-4">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto" />
              <h3 className="text-2xl font-bold text-[var(--color-text-strong)]">Payment Held in Escrow!</h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                Transaction ID: <strong>{paymentDone.transactionId}</strong><br />
                Amount: <strong>₹{paymentDone.amount}</strong> (Held Safely)
              </p>

              <div className="pt-4 flex flex-col gap-3">
                <button onClick={downloadContractPDF} className="btn btn-primary flex items-center justify-center gap-2 w-full">
                  <Download size={18} /> Download Digital Service Contract
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

export default EscrowModal;
