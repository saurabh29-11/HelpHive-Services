import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DollarSign, Zap, ShieldCheck, Users } from 'lucide-react';

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

const benefits = [
  {
    icon: <DollarSign className="h-8 w-8 text-[var(--color-primary)]" />,
    title: "Increase Your Earnings",
    description: "Access a wide network of families actively seeking your skills. Get more job opportunities and set competitive rates for your services."
  },
  {
    icon: <Zap className="h-8 w-8 text-[var(--color-primary)]" />,
    title: "Manage Your Own Schedule",
    description: "You are in control. Accept or reject job requests based on your availability and preferences, all through our easy-to-use dashboard."
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-[var(--color-primary)]" />,
    title: "Build Trust & Credibility",
    description: "Our verification badge shows clients you are a trusted professional. Collect reviews and build a strong online profile to attract better job offers."
  },
  {
    icon: <Users className="h-8 w-8 text-[var(--color-primary)]" />,
    title: "Direct Communication, No Middlemen",
    description: "Connect and communicate directly with potential clients. Discuss job details, schedules, and expectations transparently before you accept a job."
  }
];

const PartnerBenefitsPage = () => {
  return (
    <motion.div
      className="bg-[var(--color-bg)]"
      initial="initial" animate="in" exit="out"
      variants={pageVariants} transition={pageTransition}
    >
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <PageHeader 
          title="Benefits for Our Professional Partners"
          subtitle="Joining HelpHive means more than just finding jobs. It's about building a sustainable career with the support and tools you need to succeed."
        />
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-x-8 gap-y-10 sm:max-w-none md:grid-cols-2">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className="flex flex-col items-center rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-component)] p-8 text-center transition-all duration-300 hover:border-[var(--color-primary)]/50 hover:shadow-2xl hover:shadow-[var(--color-primary)]/10"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.1 }}
            >
              {benefit.icon}
              <h3 className="mt-6 text-xl font-semibold text-[var(--color-text-strong)]">{benefit.title}</h3>
              <p className="mt-2 text-[var(--color-text-muted)]">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-20 text-center">
            <Link to="/worker-signup" className="btn btn-primary text-lg">
                Join as a Professional Today
            </Link>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default PartnerBenefitsPage;