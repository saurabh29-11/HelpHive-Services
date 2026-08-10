import React from 'react';
import { ShieldCheck, BadgeCheck, CreditCard } from 'lucide-react';

const VerificationBadge = ({ type, isVerified }) => {
  if (!isVerified) return null;

  const badgeConfig = {
    police: {
      icon: <ShieldCheck className="h-4 w-4 text-white" />,
      text: 'Police Verified',
      style: 'bg-blue-500 text-white',
    },
    id: {
      icon: <BadgeCheck className="h-4 w-4 text-white" />,
      text: 'ID Verified',
      style: 'bg-green-500 text-white',
    },
    pan: {
      icon: <CreditCard className="h-4 w-4 text-white" />,
      text: 'PAN Verified',
      style: 'bg-purple-600 text-white',
    },
  };

  const config = badgeConfig[type];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${config.style}`}>
      {config.icon}
      {config.text}
    </span>
  );
};

export default VerificationBadge;