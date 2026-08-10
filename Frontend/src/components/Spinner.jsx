import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

const Spinner = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center text-lg text-[var(--color-text-muted)]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader className="h-10 w-10 text-[var(--color-primary)]" />
      </motion.div>
      <p className="font-semibold">{text}</p>
    </div>
  );
};

export default Spinner;