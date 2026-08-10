import React from 'react';
import { ShieldCheck, Award } from 'lucide-react';

const TrustScoreBadge = ({ helper }) => {
  let score = 75; // base score
  if (helper?.isVerified?.idProof) score += 10;
  if (helper?.isVerified?.policeVerification) score += 10;
  if (helper?.isVerified?.pan) score += 5;

  let badgeTier = "Gold Verified";
  let badgeColor = "from-amber-500 to-yellow-400";
  if (score >= 95) {
    badgeTier = "Diamond Verified";
    badgeColor = "from-cyan-500 to-blue-500";
  } else if (score >= 85) {
    badgeTier = "Platinum Verified";
    badgeColor = "from-purple-500 to-indigo-500";
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-bg-component-subtle)] px-3 py-1 border border-[var(--color-border)] shadow-sm">
      <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r ${badgeColor} text-white font-black text-[10px]`}>
        {score}
      </div>
      <div className="flex items-center gap-1 text-xs font-bold text-[var(--color-text-strong)]">
        <Award size={14} className="text-amber-400" />
        <span>{badgeTier}</span>
      </div>
    </div>
  );
};

export default TrustScoreBadge;
