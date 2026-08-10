import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
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

const TermsOfServicePage = () => {
  return (
    <motion.div
      className="bg-[var(--color-bg)]"
      initial="initial" animate="in" exit="out"
      variants={pageVariants} transition={pageTransition}
    >
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <PageHeader 
          title="Terms of Service"
          subtitle="Please read these terms carefully before using our service."
        />
        <div className="prose prose-lg dark:prose-invert mx-auto text-[var(--color-text)] space-y-6">
          <p>Last updated: October 26, 2025</p>

          <h2 className="text-[var(--color-text-strong)]">1. Agreement to Terms</h2>
          <p>
            By using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
          </p>

          <h2 className="text-[var(--color-text-strong)]">2. User Accounts</h2>
          <p>
            When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
          </p>

          <h2 className="text-[var(--color-text-strong)]">3. Service Description</h2>
          <p>
            HelpHive provides a platform to connect users seeking domestic help ("Clients") with individuals providing such services ("Workers"). We are not an employer of Workers. We provide verification services, but the final decision to hire a Worker rests solely with the Client. We are not responsible for the conduct of any user of the Service.
          </p>
          
          <h2 className="text-[var(--color-text-strong)]">4. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default TermsOfServicePage;