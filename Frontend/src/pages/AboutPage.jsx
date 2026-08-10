import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Users, Target, Heart } from 'lucide-react';

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

const contentContainerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const contentItemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const AboutPage = () => {
  return (
    <motion.div
      className="bg-[var(--color-bg)]"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tight text-[var(--color-text-strong)] sm:text-6xl"
          >
            About <span className="text-[var(--color-primary)]">HelpHive</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 mx-auto max-w-3xl text-lg leading-8 text-[var(--color-text)]"
          >
            We are dedicated to revolutionizing the domestic help sector by creating a safe, reliable, and transparent platform for families and professionals alike.
          </motion.p>
        </div>

        <motion.div
          className="mt-24 grid grid-cols-1 gap-16 md:grid-cols-3"
          variants={contentContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={contentItemVariants} className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
              <Target className="h-8 w-8" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-[var(--color-text-strong)]">Our Mission</h2>
            <p className="mt-4 text-[var(--color-text-muted)]">
              To empower domestic help professionals with better opportunities and provide families with trusted, verified, and skilled help, fostering relationships built on respect and trust.
            </p>
          </motion.div>
          <motion.div variants={contentItemVariants} className="flex flex-col items-center text-center">
             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
              <Heart className="h-8 w-8" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-[var(--color-text-strong)]">Our Values</h2>
            <p className="mt-4 text-[var(--color-text-muted)]">
              We operate on principles of safety, transparency, integrity, and compassion. Every connection we facilitate is handled with the utmost care for both parties.
            </p>
          </motion.div>
          <motion.div variants={contentItemVariants} className="flex flex-col items-center text-center">
             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
              <Users className="h-8 w-8" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-[var(--color-text-strong)]">Our Team</h2>
            <p className="mt-4 text-[var(--color-text-muted)]">
              Founded by a team passionate about solving real-world problems, HelpHive is a mix of tech enthusiasts and social innovators committed to making a difference.
            </p>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default AboutPage;