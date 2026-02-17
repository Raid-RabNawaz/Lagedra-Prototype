import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface Props {
  onGoHome: () => void;
}

const Unauthorized: React.FC<Props> = ({ onGoHome }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-red-50 p-4 rounded-full mb-4">
        <ShieldAlert size={48} className="text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
      <p className="text-slate-600 max-w-md mb-8">
        Your current role does not have permission to access this area. 
        Lagedra Protocol enforces strict role-based separation of concerns.
      </p>
      <button 
        onClick={onGoHome}
        className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded font-medium hover:bg-slate-800 transition-colors"
      >
        <ArrowLeft size={16} /> Return Home
      </button>
    </div>
  );
};

export default Unauthorized;