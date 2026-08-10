import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelperCard from '../components/HelperCard';
import api from '../api/axios';
import { Search, MapPin, X } from 'lucide-react';
import { AvailableServiceTypes } from '../constants/services'; // <-- IMPORT SERVICES

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, }, }, };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 }, };

const initialFilters = {
  searchTerm: '',
  locationTerm: '',
  service: 'All',
  verified: false,
  availability: 'All',
};

const FindHelpPage = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMatches, setAiMatches] = useState(null);

  const handleAiSearch = async (e) => {
    e.preventDefault();
    if (!aiPrompt || aiPrompt.trim() === '') return;

    setAiLoading(true);
    try {
      const response = await api.post('/ai/match', { prompt: aiPrompt });
      setAiMatches(response.data.data);
    } catch (err) {
      console.error("AI Matchmaking error:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const clearAiSearch = () => {
    setAiPrompt('');
    setAiMatches(null);
  };

  useEffect(() => {
    const fetchHelpers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
        if (filters.locationTerm) params.append('locationTerm', filters.locationTerm);
        if (filters.service && filters.service !== 'All') params.append('service', filters.service);
        if (filters.verified) params.append('verified', filters.verified);
        if (filters.availability && filters.availability !== 'All') params.append('availability', filters.availability);

        const response = await api.get(`/helpers?${params.toString()}`);
        setHelpers(response.data.data);
      } catch (error) {
        console.error("Failed to fetch helpers:", error);
        setHelpers([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(() => {
      fetchHelpers();
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const clearFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)]">
      <Navbar />
      <div className="container mx-auto max-w-7xl flex-grow px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-strong)] sm:text-5xl">Find Your Perfect Help</h1>
          <p className="mt-4 text-lg text-[var(--color-text)]">Search manually or use our AI Smart Matchmaker for instant recommendations.</p>
        </header>

        {/* AI Smart Matchmaker Card */}
        <div className="mb-8 rounded-xl bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-purple-900/30 p-6 border border-purple-500/30 shadow-2xl backdrop-blur-md">
            <h2 className="text-xl font-bold text-purple-300 flex items-center gap-2 mb-2">
                <span>✨ AI Smart Matchmaker</span>
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">Describe what you need in plain words (e.g. <i>"South Indian cook in Bengaluru HSR layout"</i> or <i>"Babysitter for toddler in Mumbai"</i>).</p>
            <form onSubmit={handleAiSearch} className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Need a full-time cook who speaks Hindi in Bangalore under ₹500/hr..."
                    className="flex-1 !py-3 !px-4 rounded-lg bg-[var(--color-bg-component)] border border-purple-500/40 text-[var(--color-text)] focus:ring-2 focus:ring-purple-500"
                />
                <button type="submit" className="btn bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center justify-center gap-2 !px-6" disabled={aiLoading}>
                    {aiLoading ? 'Matching with AI...' : '✨ Match with AI'}
                </button>
                {aiMatches && (
                    <button type="button" onClick={clearAiSearch} className="btn btn-subtle text-xs">Clear AI Results</button>
                )}
            </form>
        </div>

        {/* Filters Section */}
        <div className="mb-10 rounded-lg border bg-[var(--color-bg-component)] p-6 shadow-lg">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                <div className="relative lg:col-span-3">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input
                      type="text" name="searchTerm" placeholder="Search by name or role" className="pl-12"
                      value={filters.searchTerm} onChange={handleFilterChange}
                    />
                </div>
                <div className="relative lg:col-span-3">
                    <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input
                      type="text" name="locationTerm" placeholder="e.g., Mumbai, Bengaluru" className="pl-12"
                      value={filters.locationTerm} onChange={handleFilterChange}
                    />
                </div>
                <div className="lg:col-span-2">
                  {/* UPDATED: Dynamically generate options */}
                  <select name="service" className="w-full" value={filters.service} onChange={handleFilterChange}>
                      <option value="All">All Services</option>
                      {AvailableServiceTypes.map(service => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                  </select>
                </div>
                <div className="lg:col-span-2">
                    <select name="availability" className="w-full" value={filters.availability} onChange={handleFilterChange}>
                        <option value="All">Any Availability</option>
                        <option value="Available">Available</option>
                        <option value="Not Available">Not Available</option>
                    </select>
                </div>
                <div className="flex items-center justify-center rounded-md bg-[var(--color-bg-component-subtle)] ring-1 ring-[var(--color-border)] lg:col-span-1">
                    <label htmlFor="verified" className="flex h-full w-full cursor-pointer items-center justify-center gap-2 p-2.5 text-sm text-[var(--color-text)]">
                        <input
                            type="checkbox" id="verified" name="verified"
                            className="h-4 w-4 rounded border-[var(--color-border)] bg-[var(--color-bg-component-subtle)] text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-component-subtle)]"
                            checked={filters.verified} onChange={handleFilterChange}
                        />
                        Verified
                    </label>
                </div>
                <div className="lg:col-span-1">
                   <button onClick={clearFilters} className="h-full w-full btn btn-subtle">
                        <X className="h-4 w-4 mr-2" />
                        Clear
                    </button>
                </div>
            </div>
        </div>

        {/* Results Section */}
        <div className="mt-8">
          {aiMatches ? (
            <div>
               <h3 className="text-2xl font-bold text-purple-300 mb-6 flex items-center gap-2">
                 <span>✨ AI Recommended Top Matches for "{aiPrompt}"</span>
               </h3>
               <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                 {aiMatches.map(helper => (
                    <div key={helper._id} className="relative">
                      <div className="absolute -top-3 right-4 z-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1 text-xs font-extrabold text-white shadow-lg border border-purple-300">
                        ✨ {helper.matchScore}% AI Match
                      </div>
                      <HelperCard helper={{
                            id: helper._id,
                            name: helper.fullName,
                            imageUrl: helper.profileImage,
                            role: helper.primaryService,
                            location: helper.address?.city,
                            tagline: helper.matchReason || helper.tagline || 'Matched by AI',
                            rating: (helper.averageRating || 5).toFixed(1),
                            reviews: helper.reviewCount || 0,
                            verified: helper.isVerified,
                            isCurrentlyBooked: helper.isCurrentlyBooked,
                            hasVideo: !!helper.introVideo,
                      }} />
                    </div>
                 ))}
               </div>
            </div>
          ) : loading ? (
             <div className="py-16 text-center text-lg font-semibold text-[var(--color-text-muted)]">Searching...</div>
          ) : helpers.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {helpers.map(helper => (
                <motion.div key={helper._id} variants={itemVariants}>
                  <HelperCard helper={{
                        id: helper._id,
                        name: helper.fullName,
                        imageUrl: helper.profileImage,
                        role: helper.primaryService,
                        location: helper.address?.city,
                        tagline: helper.tagline || 'Eager to help your family!',
                        rating: helper.averageRating.toFixed(1),
                        reviews: helper.reviewCount,
                        verified: helper.isVerified,
                        hasVideo: !!helper.introVideo,
                  }} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="py-16 text-center">
              <h3 className="text-xl font-semibold text-[var(--color-text-strong)]">No Helpers Found</h3>
              <p className="mt-2 text-[var(--color-text-muted)]">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FindHelpPage;