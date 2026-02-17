import React from 'react';
import { TruthSurfaceItem } from '../types';
import { FileCheck, Lock as LockIcon, Fingerprint } from 'lucide-react';

interface Props {
  items: TruthSurfaceItem[];
  isLocked: boolean;
  hash?: string;
  signature?: string;
}

const TruthSurface: React.FC<Props> = ({ items, isLocked, hash, signature }) => {
  // Group items by category
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, TruthSurfaceItem[]>);

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileCheck size={20} className="text-emerald-400" />
          <h3 className="font-bold">Truth Surface</h3>
        </div>
        {isLocked && (
          <div className="flex items-center gap-1 text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700">
            <LockIcon size={12} /> Immutable Snapshot
          </div>
        )}
      </div>
      
      <div className="p-0">
        {(Object.entries(grouped) as [string, TruthSurfaceItem[]][]).map(([category, items], idx) => (
          <div key={category} className={`border-b border-slate-100 last:border-0`}>
             <div className="bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                {category}
             </div>
             <div className="divide-y divide-slate-50">
                {items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center px-4 py-3 text-sm">
                        <span className="text-slate-600 font-medium">{item.key}</span>
                        <div className="flex items-center gap-3">
                            <span className="text-slate-900">{item.value}</span>
                            {item.confirmed && <div className="w-2 h-2 rounded-full bg-emerald-500" title="Confirmed"></div>}
                        </div>
                    </div>
                ))}
             </div>
          </div>
        ))}
      </div>
      
      {/* Cryptographic Proof Section */}
      <div className="bg-slate-50 p-4 border-t border-slate-200">
        <div className="flex items-start gap-3 mb-3">
             <Fingerprint size={24} className="text-slate-300 shrink-0" />
             <div className="w-full overflow-hidden">
                 <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Cryptographic Proof (SHA-256)</div>
                 <div className="font-mono text-xs text-slate-600 break-all bg-white border border-slate-200 p-2 rounded">
                    {hash || 'PENDING_GENERATION'}
                 </div>
             </div>
        </div>
        <div className="text-[10px] text-slate-400 text-center leading-normal max-w-lg mx-auto">
            This surface is signed by Lagedra KMS. Any modification to the data above invalidates the signature.
            Used as the sole reference for Arbitration.
        </div>
      </div>
    </div>
  );
};

export default TruthSurface;
