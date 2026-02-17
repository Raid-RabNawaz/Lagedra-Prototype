
import React, { useState } from 'react';
import { OpsQueueItem } from '../types';
import { X, Check, AlertTriangle, UserCheck, Building, MapPin, Search, ExternalLink, Download, ChevronRight, Eye, ShieldCheck, Ban, Camera } from 'lucide-react';

interface Props {
  item: OpsQueueItem;
  onClose: () => void;
  onResolve: (id: string, decision: 'approved' | 'rejected') => void;
}

const AdminReviewModal: React.FC<Props> = ({ item, onClose, onResolve }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = (decision: 'approved' | 'rejected') => {
    if (decision === 'rejected' && !showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    
    setIsProcessing(true);
    setTimeout(() => {
        onResolve(item.id, decision);
        setIsProcessing(false);
    }, 1000);
  };

  const renderTenantReview = () => (
    <div className="flex flex-col h-full">
        <div className="grid grid-cols-2 gap-6 flex-1 overflow-y-auto p-1">
            <div className="space-y-4">
                <h4 className="font-bold text-slate-700 text-sm uppercase">Submitted ID Document</h4>
                <div className="bg-slate-100 rounded-lg p-4 border border-slate-200 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                            <Eye size={16} /> Zoom
                        </button>
                    </div>
                    {/* Mock ID Card */}
                    <div className="w-64 h-40 bg-blue-50 rounded-lg shadow-sm border-2 border-slate-200 p-3 relative">
                        <div className="w-16 h-16 bg-slate-300 rounded mb-2"></div>
                        <div className="h-2 w-32 bg-slate-300 rounded mb-1"></div>
                        <div className="h-2 w-24 bg-slate-300 rounded"></div>
                        <div className="absolute top-3 right-3 text-[10px] font-bold text-slate-400">PASSPORT</div>
                    </div>
                    <div className="mt-4 text-xs text-slate-500 font-mono">
                        Extracted Name: Sarah Chen<br/>
                        DOB: 1990-05-12<br/>
                        Doc ID: P882***91
                    </div>
                </div>
            </div>
            
            <div className="space-y-4">
                <h4 className="font-bold text-slate-700 text-sm uppercase">Liveness Selfie</h4>
                <div className="bg-slate-100 rounded-lg p-4 border border-slate-200 flex flex-col items-center justify-center min-h-[300px]">
                     <div className="w-48 h-48 bg-slate-200 rounded-full overflow-hidden border-4 border-white shadow-sm relative">
                         <img src="https://picsum.photos/id/64/400/400" className="w-full h-full object-cover" alt="Selfie" />
                     </div>
                     <div className="mt-4 flex items-center gap-2">
                         <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                             Match Score: 98%
                         </div>
                         <div className="px-3 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-full border border-slate-300">
                             Liveness: Pass
                         </div>
                     </div>
                </div>
            </div>
        </div>

        <div className="mt-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Search size={16} /> Risk Signals
            </h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                    <span className="text-slate-500 block text-xs uppercase">Watchlist</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1"><Check size={14} /> Clear</span>
                </div>
                <div>
                    <span className="text-slate-500 block text-xs uppercase">Device Fingerprint</span>
                    <span className="text-slate-900 font-medium">New Device (Mac OS)</span>
                </div>
                <div>
                    <span className="text-slate-500 block text-xs uppercase">IP Geolocation</span>
                    <span className="text-slate-900 font-medium">San Francisco, US</span>
                </div>
            </div>
        </div>
    </div>
  );

  const renderHostReview = () => (
    <div className="flex flex-col h-full space-y-6">
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-3 flex justify-between items-center">
                <h4 className="font-bold text-slate-700 text-sm">Business Entity Details</h4>
                <button className="text-blue-600 text-xs font-medium hover:underline flex items-center gap-1">
                    <ExternalLink size={12} /> Verify in State Registry
                </button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-y-4 text-sm">
                <div>
                    <span className="text-slate-500 block text-xs">Entity Name</span>
                    <span className="font-medium">Urban Properties LLC</span>
                </div>
                <div>
                    <span className="text-slate-500 block text-xs">Tax ID / EIN</span>
                    <span className="font-mono bg-slate-100 px-1 rounded">12-3456789</span>
                </div>
                <div>
                    <span className="text-slate-500 block text-xs">Formation Date</span>
                    <span>2018-04-12 (5 years)</span>
                </div>
                <div>
                    <span className="text-slate-500 block text-xs">Registered Agent</span>
                    <span>LegalZoom Inc.</span>
                </div>
            </div>
        </div>

        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-bold text-slate-700 text-sm mb-4">Submitted Documentation</h4>
            <div className="space-y-2">
                {[
                    { name: 'Articles_of_Organization.pdf', size: '1.2 MB', verified: true },
                    { name: 'IRS_SS4_Letter.pdf', size: '0.8 MB', verified: true },
                    { name: 'Beneficial_Ownership_Form.pdf', size: '2.4 MB', verified: false }
                ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded hover:border-blue-300 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-50 text-red-600 rounded flex items-center justify-center font-bold text-xs">PDF</div>
                            <div>
                                <div className="text-sm font-medium text-slate-900">{doc.name}</div>
                                <div className="text-xs text-slate-500">{doc.size}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {doc.verified ? (
                                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded">
                                    <ShieldCheck size={12} /> OCR Verified
                                </span>
                            ) : (
                                <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded">
                                    Manual Review
                                </span>
                            )}
                            <button className="text-slate-400 hover:text-slate-600">
                                <Eye size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderPropertyReview = () => (
    <div className="flex flex-col h-full">
        <div className="grid grid-cols-2 gap-6 flex-1 min-h-[300px]">
            <div className="space-y-2">
                <h4 className="font-bold text-slate-700 text-sm flex justify-between">
                    <span>Reference Imagery</span>
                    <span className="text-xs font-normal text-slate-500">Google Street View (2023)</span>
                </h4>
                <div className="h-64 bg-slate-200 rounded-lg overflow-hidden relative">
                    <img 
                        src="https://picsum.photos/id/129/600/400?grayscale" 
                        className="w-full h-full object-cover opacity-80" 
                        alt="Reference" 
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded">
                        Lat: 34.0522, Long: -118.2437
                    </div>
                </div>
            </div>
            
            <div className="space-y-2">
                <h4 className="font-bold text-slate-700 text-sm flex justify-between">
                    <span>User Upload</span>
                    <span className="text-xs font-normal text-slate-500">iPhone 14 Pro • Yesterday</span>
                </h4>
                <div className="h-64 bg-slate-200 rounded-lg overflow-hidden relative border-2 border-emerald-500">
                    <img 
                        src="https://picsum.photos/id/129/600/400" 
                        className="w-full h-full object-cover" 
                        alt="User Upload" 
                    />
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                        Verified Original
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded">
                        Lat: 34.0523, Long: -118.2438
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
            <div>
                <h4 className="font-bold text-slate-900 text-sm">GPS Analysis</h4>
                <p className="text-xs text-slate-500">Distance between reference and upload coordinates.</p>
            </div>
            <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">12 meters</div>
                <div className="text-xs font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded inline-block">Within Threshold</div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[85vh] flex flex-col animate-in zoom-in duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                    item.type.includes('Tenant') ? 'bg-blue-100 text-blue-600' :
                    item.type.includes('Host') ? 'bg-purple-100 text-purple-600' :
                    'bg-amber-100 text-amber-600'
                }`}>
                    {item.type.includes('Tenant') ? <UserCheck size={20} /> :
                     item.type.includes('Host') ? <Building size={20} /> :
                     <MapPin size={20} />}
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-900">{item.type}</h2>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-mono">Task ID: {item.id}</span>
                        <span>•</span>
                        <span>{item.created}</span>
                    </div>
                </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
            {item.description && (
                <div className="mb-6 bg-yellow-50 border border-yellow-100 p-3 rounded text-sm text-yellow-800 flex items-start gap-2">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                    <p>{item.description}</p>
                </div>
            )}

            {item.type === 'Tenant Verification' && renderTenantReview()}
            {item.type === 'Host Verification' && renderHostReview()}
            {item.type === 'Property Verification' && renderPropertyReview()}
            
            {/* Fallback for other types */}
            {!['Tenant Verification', 'Host Verification', 'Property Verification'].includes(item.type) && (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <Search size={48} className="mb-4 opacity-50" />
                    <p>Standard task review interface loading...</p>
                </div>
            )}
        </div>

        {/* Action Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
            {showRejectInput ? (
                <div className="flex-1 flex gap-2 animate-in slide-in-from-bottom-2">
                    <input 
                        type="text" 
                        placeholder="Reason for rejection (required)..." 
                        className="flex-1 border border-red-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        autoFocus
                    />
                    <button 
                        onClick={() => setShowRejectInput(false)}
                        className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button 
                        disabled={!rejectionReason || isProcessing}
                        onClick={() => handleAction('rejected')}
                        className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                        Confirm Rejection
                    </button>
                </div>
            ) : (
                <>
                    <button 
                        onClick={() => onClose()}
                        className="px-6 py-3 border border-slate-300 text-slate-600 font-bold rounded-lg hover:bg-white transition-colors"
                    >
                        Skip Task
                    </button>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => handleAction('rejected')}
                            className="px-6 py-3 bg-red-50 text-red-700 border border-red-200 font-bold rounded-lg hover:bg-red-100 flex items-center gap-2 transition-colors"
                        >
                            <Ban size={18} /> Reject
                        </button>
                        <button 
                            onClick={() => handleAction('approved')}
                            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 flex items-center gap-2 shadow-lg shadow-slate-900/20 transition-all active:scale-95"
                        >
                            {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check size={18} /> Approve</>}
                        </button>
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviewModal;
