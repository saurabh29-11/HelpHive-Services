import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelperCard from '../components/HelperCard';
import api from '../api/axios';
import { ShieldCheck, HeartHandshake, CheckCircle } from 'lucide-react';

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2 }
  },
};

const featureItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const whyChooseUsFeatures = [
    {
        icon: <ShieldCheck />,
        title: "Verified Professionals",
        description: "Every professional on our platform undergoes a rigorous background and ID verification process.",
    },
    {
        icon: <CheckCircle />,
        title: "Transparent Process",
        description: "No hidden fees. Watch video intros, interview candidates, and hire with complete clarity.",
    },
    {
        icon: <HeartHandshake />,
        title: "Replacement Guarantee",
        description: "Not a perfect match? We offer a free replacement guarantee to ensure your satisfaction.",
    },
];

const HomePage = () => {
    const [featuredHelpers, setFeaturedHelpers] = useState([]);

    useEffect(() => {
        const fetchFeaturedHelpers = async () => {
            try {
                // Fetch helpers and take the first 3 as featured
                const response = await api.get('/helpers');
                setFeaturedHelpers(Array.isArray(response?.data?.data) ? response.data.data.slice(0, 3) : []);
            } catch (error) {
                console.error("Failed to fetch featured helpers:", error);
            }
        };
        fetchFeaturedHelpers();
    }, []);

  return (
    <div className="bg-[var(--color-bg)]">
      <Navbar />

      <main>
        {/* Hero Section */}
        <div className="relative flex h-[90vh] items-center justify-center px-6 text-center isolate">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute left-0 top-0 h-full w-full object-cover -z-20"
              src="https://videos.pexels.com/video-files/7516936/7516936-uhd_2560_1440_25fps.mp4"
            ></video>
            <div className="absolute left-0 top-0 h-full w-full bg-slate-900/60 -z-10"></div>
            
            <div className="mx-auto max-w-3xl">
                <motion.h1 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
                >
                    Find Trusted Househelp <span className="text-teal-400">Near You</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mt-6 text-lg leading-8 text-slate-200"
                >
                    Connect with verified, reliable, and skilled maids, cooks, babysitters, and more. Your home is in safe hands.
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="mt-10 flex items-center justify-center gap-x-6"
                >
                    <Link to="/find" className="btn btn-primary">
                        Find Help Now
                    </Link>
                    <Link to="/worker-signup" className="text-sm font-semibold leading-6 text-slate-200 transition-colors hover:text-white">
                        Join as a Professional <span aria-hidden="true">→</span>
                    </Link>
                </motion.div>
            </div>
        </div>

        {/* Why Choose Us Section */}
        <motion.div
          className="bg-[var(--color-bg)] py-24 sm:py-32"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-[var(--color-primary)]">The HelpHive Advantage</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text-strong)] sm:text-4xl">Why Families Trust Us</p>
            </div>
            <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-x-8 gap-y-10 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3">
              {whyChooseUsFeatures.map((feature) => (
                <motion.div key={feature.title} variants={featureItemVariants} className="flex flex-col items-center rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-component)] p-8 text-center transition-all duration-300 hover:border-[var(--color-primary)]/50 hover:shadow-2xl hover:shadow-[var(--color-primary)]/10">
                  {React.cloneElement(feature.icon, {className: "h-8 w-8 text-[var(--color-primary)]"})}
                  <h3 className="mt-6 text-xl font-semibold text-[var(--color-text-strong)]">{feature.title}</h3>
                  <p className="mt-2 text-[var(--color-text-muted)]">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Featured Helpers Section */}
        <motion.div 
          className="py-24 sm:py-32"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
           <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-[var(--color-primary)]">Top Professionals</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text-strong)] sm:text-4xl">
                Meet our highly-rated and verified helpers
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {featuredHelpers.map((helper, index) => (
                <motion.div
                  key={helper._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.5 }}
                >
                  <HelperCard helper={{
                        id: helper._id,
                        name: helper.fullName,
                        imageUrl: helper.profileImage,
                        role: helper.primaryService,
                        location: helper.address?.city,
                        tagline: helper.tagline || 'Eager to help your family!',
                        rating: 'N/A', // Simplified for homepage, full data on profile page
                        reviews: 0,
                        verified: helper.isVerified,
                        hasVideo: !!helper.introVideo,
                    }} />
                </motion.div>
              ))}
            </div>
             <div className="mt-16 text-center">
              <Link to="/find" className="text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
                View all professionals <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* For Professionals CTA Section */}
        <div className="py-16">
            <div className="mx-auto max-w-4xl px-6 lg:px-8">
                <div className="relative isolate overflow-hidden bg-[var(--color-primary)]/90 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
                    <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Are you a domestic help professional?
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-teal-100">
                        Join HelpHive to connect with families in your area, manage your own schedule, and increase your earnings.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            to="/worker-signup"
                            className="btn bg-white px-5 py-2.5 text-[var(--color-primary)] hover:-translate-y-px hover:shadow-lg focus:ring-white"
                        >
                            Create a Worker Profile
                        </Link>
                        <Link to="/worker-login" className="text-sm font-semibold leading-6 text-white">
                            Worker Login <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                    <svg
                        viewBox="0 0 1024 1024"
                        className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
                        aria-hidden="true"
                    >
                        <circle cx={512} cy={512} r={512} fill="url(#8d958450-c69f-4251-94bc-4e091a323369)" fillOpacity="0.7" />
                        <defs>
                            <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
                                <stop stopColor="#14B8A6" />
                                <stop offset={1} stopColor="#0F766E" />
                            </radialGradient>
                        </defs>
                    </svg>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;