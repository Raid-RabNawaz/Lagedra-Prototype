import React from 'react';
import { UserRole } from '../types';
import { Users, Gavel, ShieldAlert, Key as KeyIcon } from 'lucide-react';

interface Props {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const RoleSwitcher: React.FC<Props> = ({ currentRole, onRoleChange }) => {
  return (
    <div className="bg-slate-900 text-white p-2 flex items-center justify-center gap-4 text-xs select-none">
      <span className="opacity-50 uppercase tracking-widest font-bold hidden sm:block">Demo Context:</span>
      
      <button 
        onClick={() => onRoleChange('tenant')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${currentRole === 'tenant' ? 'bg-emerald-600 text-white font-medium' : 'hover:bg-slate-800 text-slate-400'}`}
      >
        <Users size={12} /> Tenant
      </button>

      <button 
        onClick={() => onRoleChange('landlord')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${currentRole === 'landlord' ? 'bg-blue-600 text-white font-medium' : 'hover:bg-slate-800 text-slate-400'}`}
      >
        <KeyIcon size={12} /> Landlord
      </button>

      <button 
        onClick={() => onRoleChange('arbitrator')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${currentRole === 'arbitrator' ? 'bg-amber-600 text-white font-medium' : 'hover:bg-slate-800 text-slate-400'}`}
      >
        <Gavel size={12} /> Arbitrator
      </button>

      <button 
        onClick={() => onRoleChange('admin')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${currentRole === 'admin' ? 'bg-purple-600 text-white font-medium' : 'hover:bg-slate-800 text-slate-400'}`}
      >
        <ShieldAlert size={12} /> Ops Admin
      </button>
    </div>
  );
};

export default RoleSwitcher;
