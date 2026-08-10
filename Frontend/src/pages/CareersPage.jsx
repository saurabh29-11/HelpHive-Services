import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import { motion } from 'framer-motion';
import { MapPin, Briefcase } from 'lucide-react';

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

const jobOpenings = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    location: 'Remote',
    type: 'Full-time',
    description: 'We are looking for a passionate Frontend Engineer to join our team. You will be responsible for building the next generation of user-facing features for HelpHive.'
  },
  {
    id: 2,
    title: 'Digital Marketing Manager',
    location: 'Bengaluru, India',
    type: 'Full-time',
    description: 'Lead our marketing efforts to grow the HelpHive community. Develop and execute strategies to reach both families and professional workers.'
  },
  {
    id: 3,
    title: 'Customer Support Specialist',
    location: 'Remote',
    type: 'Part-time',
    description: 'Be the first point of contact for our users. Help them navigate the platform, resolve issues, and ensure they have a great experience.'
  }
];

const CareersPage = () => {
  return (
    <motion.div
      className="bg-[var(--color-bg)]"
      initial="initial" animate="in" exit="out"
      variants={pageVariants} transition={pageTransition}
    >
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <PageHeader 
          title="Join Our Team"
          subtitle="We're building the future of domestic help services. Come be a part of our mission-driven company."
        />
        <div className="space-y-8">
          {jobOpenings.map((job, index) => (
            <motion.div
              key={job.id}
              className="rounded-lg border bg-[var(--color-bg-component)] p-6 shadow-lg transition-all duration-300 hover:border-[var(--color-primary)]/50 hover:shadow-2xl hover:shadow-[var(--color-primary)]/10"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <h3 className="text-2xl font-semibold text-[var(--color-text-strong)]">{job.title}</h3>
                <a href="mailto:careers@helphive.com?subject=Application for [Job Title]" className="btn btn-primary mt-4 sm:mt-0">Apply Now</a>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-[var(--color-text-muted)]">
                <div className="flex items-center gap-2">
                  <Briefcase size={16} />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{job.location}</span>
                </div>
              </div>
              <p className="mt-4 text-[var(--color-text)]">{job.description}</p>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default CareersPage;