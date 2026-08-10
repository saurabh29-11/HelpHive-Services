import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Hexagon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

const SignUpPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth(); // Use the generic register function
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Creating your account...");

        const userData = {
            ...formData,
            role: 'USER', // Explicitly set role to USER
        };
        
        try {
            await register(userData);
            toast.success("Account created! Please log in.", { id: toastId });
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };


  return (
    <motion.div 
        className="flex min-h-screen flex-col bg-[var(--color-bg)]"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
    >
      <Navbar />
      <main className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl space-y-8">
          <div>
            <Hexagon className="mx-auto h-12 w-auto text-[var(--color-primary)]" fill="currentColor" />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[var(--color-text-strong)]">
              Create your HelpHive account
            </h2>
            <p className="mt-2 text-center text-sm text-[var(--color-text-muted)]">
              Looking to offer your services?{' '}
              <Link to="/worker-signup" className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
                Join as a professional
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6 rounded-lg border bg-[var(--color-bg-component)] p-8 shadow-lg" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3"><label className="block text-sm font-medium leading-6 text-[var(--color-text)]">Full Name</label><input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} /></div>
                <div className="sm:col-span-3"><label className="block text-sm font-medium leading-6 text-[var(--color-text)]">Phone Number</label><input type="tel" name="phone" required value={formData.phone} onChange={handleChange} /></div>
                <div className="sm:col-span-3"><label className="block text-sm font-medium leading-6 text-[var(--color-text)]">Email</label><input type="email" name="email" required value={formData.email} onChange={handleChange} /></div>
                <div className="sm:col-span-3"><label className="block text-sm font-medium leading-6 text-[var(--color-text)]">Password</label><input type="password" name="password" required value={formData.password} onChange={handleChange} /></div>
                
                <div className="col-span-full border-t border-[var(--color-border)] my-2"></div>
                
                <div className="sm:col-span-6"><label className="block text-sm font-medium leading-6 text-[var(--color-text)]">Street Address</label><input type="text" name="street" required value={formData.street} onChange={handleChange} /></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium leading-6 text-[var(--color-text)]">City</label><input type="text" name="city" required value={formData.city} onChange={handleChange} /></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium leading-6 text-[var(--color-text)]">State</label><input type="text" name="state" required value={formData.state} onChange={handleChange} /></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium leading-6 text-[var(--color-text)]">Zip Code</label><input type="text" name="zipCode" required value={formData.zipCode} onChange={handleChange} /></div>
            </div>
            <div className="pt-6">
              <button type="submit" className="flex w-full justify-center btn btn-primary" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default SignUpPage;