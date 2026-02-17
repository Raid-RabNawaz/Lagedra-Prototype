import React from 'react';
import { VerificationClass, ConfidenceLevel } from '../types';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

interface Props {
  vClass: VerificationClass;
  confidence?: ConfidenceLevel;
  className?: string;
  showLabel?: boolean;
}

const VerificationBadge: React.FC<Props> = ({ vClass, confidence, className = '', showLabel = true }) => {
  let colorClass = 'bg-gray-100 text-gray-600 border-gray-200';
  let Icon = Shield;

  switch (vClass) {
    case VerificationClass.LOW_RISK:
      colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      Icon = ShieldCheck;
      break;
    case VerificationClass.MEDIUM_RISK:
      colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
      Icon = Shield;
      break;
    case VerificationClass.HIGH_RISK:
      colorClass = 'bg-red-50 text-red-700 border-red-200';
      Icon = ShieldAlert;
      break;
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${colorClass} ${className}`}>
      <Icon size={16} className="shrink-0" />
      {showLabel && (
        <div className="flex flex-col leading-none">
          <span className="font-semibold text-sm">{vClass}</span>
          {confidence && (
            <span className="text-[10px] opacity-80 uppercase tracking-wider">
              {confidence} Confidence
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default VerificationBadge;