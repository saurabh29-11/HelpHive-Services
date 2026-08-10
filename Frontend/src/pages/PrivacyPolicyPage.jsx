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

const PrivacyPolicyPage = () => {
  return (
    <motion.div
      className="bg-[var(--color-bg)]"
      initial="initial" animate="in" exit="out"
      variants={pageVariants} transition={pageTransition}
    >
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <PageHeader 
          title="Privacy Policy"
          subtitle="Your privacy is important to us. This policy explains what data we collect and why."
        />
        <div className="prose prose-lg dark:prose-invert mx-auto text-[var(--color-text)] space-y-6">
          <p>Last updated: October 26, 2025</p>

          <h2 className="text-[var(--color-text-strong)]">1. Introduction</h2>
          <p>
            Welcome to HelpHive. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at privacy@helphive.com.
          </p>

          <h2 className="text-[var(--color-text-strong)]">2. Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us.
          </p>
          <p>The personal information that we collect depends on the context of your interactions with us and the website, the choices you make, and the products and features you use. The personal information we collect may include the following:</p>
          <ul>
            <li>Personal Information Provided by You: Name, phone numbers, email addresses, mailing addresses, job titles, passwords, and contact preferences.</li>
            <li>For Workers: We may also collect verification documents such as government-issued ID and police verification certificates to ensure the safety and security of our platform.</li>
            <li>Payment Data: We may collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a credit card number). All payment data is stored by our payment processor.</li>
          </ul>

          <h2 className="text-[var(--color-text-strong)]">3. How We Use Your Information</h2>
          <p>
            We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default PrivacyPolicyPage;