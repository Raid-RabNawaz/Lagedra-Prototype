import React from 'react';
import { User, TrustLedgerEntry } from '../types';
import { CheckCircle2, AlertTriangle, Gavel } from 'lucide-react';

interface Props {
  user: User;
}

const TrustLedger: React.FC<Props> = ({ user }) => {
  const getIcon = (type: TrustLedgerEntry['type']) => {
    switch (type) {
      case 'Deal Completed':
      case 'Active Month':
        return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'Compliance Violation':
        return <AlertTriangle className="text-red-500" size={18} />;
      case 'Arbitration Won':
      case 'Arbitration Lost':
        return <Gavel className="text-blue-500" size={18} />;
      default:
        return <div className="w-4 h-4 bg-gray-200 rounded-full" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Objective Trust Ledger
        </h3>
        <span className="text-xs text-slate-500 uppercase tracking-wide">Immutable Record</span>
      </div>
      <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
        {user.trustLedger.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">No recorded history yet.</div>
        ) : (
          user.trustLedger.map((entry) => (
            <div key={entry.id} className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors">
              <div className="mt-1">{getIcon(entry.type)}</div>
              <div>
                <p className="text-sm font-medium text-slate-800">{entry.type}</p>
                <p className="text-xs text-slate-500">{entry.description}</p>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">{entry.date}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TrustLedger;