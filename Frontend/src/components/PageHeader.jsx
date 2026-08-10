import React from 'react';
import { motion } from 'framer-motion';

const PageHeader = ({ title, subtitle }) => {
  return (
    <motion.div
      className="text-center mb-16"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-strong)] sm:text-5xl">
        {title}
      </h1>
      <p className="mt-6 mx-auto max-w-3xl text-lg leading-8 text-[var(--color-text)]">
        {subtitle}
      </p>
    </motion.div>
  );
};

export default PageHeader;