
import React from 'react';
import { User } from '../types';
import { UserCircle, Mail, Phone, MapPin, Building, Shield, Calendar, X, Globe, Link as LinkIcon, Edit2 } from 'lucide-react';
import VerificationBadge from './VerificationBadge';

interface Props {
  user: User;
  onClose: () => void;
}

const UserProfileModal: React.FC<Props> = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row animate-in fade-in zoom-in duration-200">
        
        {/* Left Column: ID Card Style */}
        <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-200 p-8 flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden mb-6">
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{user.name}</h2>
            <div className="flex flex-col items-center gap-2 mb-6">
                <span className="bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded font-bold uppercase tracking-wide">
                    {user.role}
                </span>
                {user.verifiedAffiliation && (
                    <div className="flex items-center gap-1 text-sm text-blue-700 font-medium">
                        <Building size={14} /> {user.verifiedAffiliation}
                    </div>
                )}
            </div>

            <div className="w-full space-y-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Protocol Risk Class</div>
                    <VerificationBadge vClass={user.verificationClass || 'Unverified' as any} confidence={user.confidence} className="w-full justify-center" />
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-left space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                        <Mail size={16} className="text-slate-400" />
                        <span className="truncate">{user.email || 'No email verified'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                        <Phone size={16} className="text-slate-400" />
                        <span>{user.phone || 'No phone verified'}</span>
                    </div>
                     <div className="flex items-center gap-3 text-sm text-slate-700">
                        <MapPin size={16} className="text-slate-400" />
                        <span>San Francisco, CA</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Detailed Attributes */}
        <div className="flex-1 p-8">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Trust Passport</h3>
                    <p className="text-sm text-slate-500">Your decentralized identity and reputation record.</p>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
                    <X size={24} />
                </button>
            </div>

            <div className="space-y-8">
                {/* About */}
                <section>
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                            <UserCircle size={18} /> About
                        </h4>
                        <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                            <Edit2 size={12} /> Edit
                        </button>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                        {user.bio || "No bio provided."}
                    </p>
                </section>

                {/* Verification Status Matrix */}
                <section>
                    <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                        <Shield size={18} /> Verification Matrix
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border border-slate-200 rounded-lg flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-slate-900">Government ID</div>
                                <div className="text-xs text-slate-500">Global Watchlist Check</div>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${user.tenantVerification?.identity ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                        </div>
                         <div className="p-4 border border-slate-200 rounded-lg flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-slate-900">Income Source</div>
                                <div className="text-xs text-slate-500">Payroll API Connected</div>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${user.tenantVerification?.income ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                        </div>
                         <div className="p-4 border border-slate-200 rounded-lg flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-slate-900">Rental History</div>
                                <div className="text-xs text-slate-500">Ledger Analysis</div>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${user.tenantVerification?.rentalHistory ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                        </div>
                         <div className="p-4 border border-slate-200 rounded-lg flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-slate-900">Background Check</div>
                                <div className="text-xs text-slate-500">Criminal & Eviction</div>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${user.tenantVerification?.background ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                        </div>
                    </div>
                </section>

                {/* Linked Accounts */}
                <section>
                    <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                        <LinkIcon size={18} /> Linked Accounts
                    </h4>
                    <div className="flex gap-3">
                         <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded text-sm text-slate-700 bg-white">
                            <Globe size={14} className="text-blue-600" /> LinkedIn
                         </div>
                         <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded text-sm text-slate-700 bg-white">
                            <Building size={14} className="text-slate-600" /> Employer Portal
                         </div>
                    </div>
                </section>

                <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                     <button onClick={onClose} className="px-4 py-2 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 text-sm font-medium">
                         Close
                     </button>
                     <button className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 text-sm font-medium">
                         Update Information
                     </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
