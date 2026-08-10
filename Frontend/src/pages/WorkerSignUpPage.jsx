import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Hexagon, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
// UPDATED: Import the new, specific list for worker registration
import { WorkerRegisterableServices } from '../constants/services'; 

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

const WorkerSignUpPage = () => {
    const navigate = useNavigate();
    const { registerWorker } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        // UPDATED: Default to the first service in the specific worker list
        primaryService: WorkerRegisterableServices[0], 
        experience: '',
    });
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleFileChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

    const handleDragEvents = (e, dragging) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(dragging);
    };

    const handleDrop = (e) => {
        handleDragEvents(e, false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setProfileImage(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Submitting application...");

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        data.append('role', 'WORKER');
        if (profileImage) {
            data.append('profileImage', profileImage);
        }
        
        try {
            await registerWorker(data);
            toast.success("Application submitted! Please log in.", { id: toastId });
            navigate('/worker-login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Application submission failed.', { id: toastId });
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
              Join HelpHive as a Professional
            </h2>
            <p className="mt-2 text-center text-sm text-[var(--color-text-muted)]">
              Start getting job requests from your area. Already registered?{' '}
              <Link to="/worker-login" className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
                Login here
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

                <div className="col-span-full border-t border-[var(--color-border)] my-2"></div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium leading-6 text-[var(--color-text)]">Primary Service</label>
                  {/* UPDATED: Dynamically generate options from the specific worker list */}
                  <select name="primaryService" value={formData.primaryService} onChange={handleChange}>
                    {WorkerRegisterableServices.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-3"><label className="block text-sm font-medium leading-6 text-[var(--color-text)]">Years of Experience</label><input type="number" name="experience" required value={formData.experience} onChange={handleChange} /></div>
                
                <div className="col-span-full">
                    <label className="block text-sm font-medium leading-6 text-[var(--color-text)]">Upload Profile Photo</label>
                    <div 
                        className={`mt-2 flex justify-center rounded-lg border border-dashed border-[var(--color-border)] px-6 py-10 transition-colors duration-300 ${isDragging ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)]' : ''}`}
                        onDragEnter={(e) => handleDragEvents(e, true)}
                        onDragOver={(e) => handleDragEvents(e, true)}
                        onDragLeave={(e) => handleDragEvents(e, false)}
                        onDrop={handleDrop}
                    >
                        <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-[var(--color-text-muted)]" />
                            <div className="mt-4 flex text-sm leading-6 text-[var(--color-text-muted)]">
                                <label htmlFor="profileImage" className="relative cursor-pointer rounded-md bg-[var(--color-bg-component)] font-semibold text-[var(--color-primary)] focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--color-bg-component)] hover:text-[var(--color-primary-hover)]">
                                    <span>{profileImage ? 'File selected' : 'Upload a file'}</span>
                                    <input id="profileImage" name="profileImage" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs leading-5 text-[var(--color-text-muted)]/80">
                                {profileImage ? profileImage.name : 'PNG, JPG up to 5MB'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pt-6">
              <button type="submit" className="flex w-full justify-center btn btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default WorkerSignUpPage;