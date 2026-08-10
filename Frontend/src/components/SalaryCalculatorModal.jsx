import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calculator, DollarSign, MapPin, Clock, Users } from 'lucide-react';

const SalaryCalculatorModal = ({ show, onClose }) => {
  const [service, setService] = useState('Cook');
  const [city, setCity] = useState('Bengaluru');
  const [hours, setHours] = useState(2);
  const [familyMembers, setFamilyMembers] = useState(4);

  const calculateEstimate = () => {
    let baseRate = 3000;
    if (service === 'Cook') baseRate = 4000;
    if (service === 'Babysitter') baseRate = 5000;
    if (service === 'Elderly Care') baseRate = 6000;

    if (city === 'Mumbai' || city === 'Bengaluru' || city === 'Delhi NCR') baseRate *= 1.25;

    const hourMultiplier = hours * 0.4 + 0.6;
    const memberMultiplier = familyMembers > 3 ? 1.2 : 1.0;

    const estimatedSalary = Math.round(baseRate * hourMultiplier * memberMultiplier);
    return estimatedSalary;
  };

  if (!show) return null;

  const estimatedWage = calculateEstimate();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-md rounded-2xl bg-[var(--color-bg-component)] p-6 shadow-2xl border border-[var(--color-border)]"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-strong)]">
            <X size={20} />
          </button>

          <div className="flex items-center gap-2 mb-4">
            <Calculator className="h-6 w-6 text-[var(--color-primary)]" />
            <h3 className="text-xl font-bold text-[var(--color-text-strong)]">Fair Wage & Salary Estimator</h3>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <label className="block font-medium text-[var(--color-text)]">Select Service</label>
              <select value={service} onChange={(e) => setService(e.target.value)} className="mt-1">
                <option value="Cook">Cook / Chef</option>
                <option value="Maid">Maid / Housekeeping</option>
                <option value="Babysitter">Babysitter / Nanny</option>
                <option value="Elderly Care">Elderly Caretaker</option>
                <option value="Driver">Personal Driver</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[var(--color-text)]">City Location</label>
              <select value={city} onChange={(e) => setCity(e.target.value)} className="mt-1">
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Lucknow">Lucknow</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[var(--color-text)]">Working Hours / Day</label>
                <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} min={1} max={12} className="mt-1" />
              </div>
              <div>
                <label className="block font-medium text-[var(--color-text)]">Family Members</label>
                <input type="number" value={familyMembers} onChange={(e) => setFamilyMembers(e.target.value)} min={1} max={10} className="mt-1" />
              </div>
            </div>

            {/* Estimated Salary Box */}
            <div className="mt-6 rounded-xl bg-gradient-to-r from-teal-900/30 via-emerald-900/30 to-teal-900/30 p-5 border border-teal-500/30 text-center">
              <span className="text-xs font-semibold text-teal-300 block uppercase tracking-wider">Recommended Fair Monthly Salary</span>
              <span className="text-3xl font-extrabold text-white mt-1 block">₹{estimatedWage.toLocaleString()} / month</span>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-2">Based on city market benchmark standard rates.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SalaryCalculatorModal;
