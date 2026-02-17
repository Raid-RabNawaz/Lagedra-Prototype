
import React, { useState } from 'react';
import { MOCK_USER_TENANT, MOCK_ACTIVE_DEAL, MOCK_DISPUTE_DEAL } from '../constants';
import VerificationBadge from '../components/VerificationBadge';
import TrustLedger from '../components/TrustLedger';
import TruthSurface from '../components/TruthSurface';
import DisputeCenter from '../components/DisputeCenter';
import TenantVerificationModal from '../components/TenantVerificationModal';
import UserProfileModal from '../components/UserProfileModal';
import ListingCard from '../components/ListingCard';
import { Check, Clock, AlertCircle, RefreshCw, MessageSquare, FileText, Ban, Users, Shield, ArrowRight, AlertTriangle, Heart } from 'lucide-react';
import { DealStatus, TenantVerificationStatus, Listing } from '../types';

interface Props {
  savedListingIds?: string[];
  onToggleSaved?: (id: string) => void;
  listings?: Listing[];
  onSelectList?: (id: string) => void;
}

const TenantDashboard: React.FC<Props> = ({ savedListingIds = [], onToggleSaved, listings = [], onSelectList }) => {
  // Demo State
  const [useDisputeMock, setUseDisputeMock] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'saved'>('overview');
  
  const currentDeal = useDisputeMock ? MOCK_DISPUTE_DEAL : MOCK_ACTIVE_DEAL;
  const verificationStatus = MOCK_USER_TENANT.tenantVerification || { identity: false, income: false, background: false, rentalHistory: false };

  // Filter saved listings
  const savedListings = listings.filter(l => savedListingIds.includes(l.id));

  const handleManageAction = (action: string) => {
    alert(`Mock Action: ${action} initiated.\nIn a real app, this would open the ${action} interface.`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Tenant Dashboard</h1>
            <p className="text-slate-500">Manage your verification, active deals, and protocol standing.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center">
             {/* Tab Switcher */}
             <div className="bg-slate-100 p-1 rounded-lg flex text-sm font-medium">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-1.5 rounded-md transition-all ${activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Overview
                </button>
                <button 
                    onClick={() => setActiveTab('saved')}
                    className={`px-4 py-1.5 rounded-md transition-all flex items-center gap-2 ${activeTab === 'saved' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Heart size={14} className={activeTab === 'saved' ? 'text-rose-500' : ''} />
                    Saved Homes
                    {savedListingIds.length > 0 && (
                        <span className="bg-slate-200 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full">{savedListingIds.length}</span>
                    )}
                </button>
             </div>

             {/* Consolidated Controls */}
             {activeTab === 'overview' && (
               <div className="flex gap-2">
                    {currentDeal.status !== DealStatus.DISPUTE ? (
                        <button 
                            onClick={() => setUseDisputeMock(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-white text-red-600 border border-red-200 hover:bg-red-50 shadow-sm"
                        >
                            <AlertTriangle size={14} />
                            File Dispute (Demo)
                        </button>
                    ) : (
                        <button 
                            onClick={() => setUseDisputeMock(false)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                        >
                            <RefreshCw size={14} />
                            Reset Simulation
                        </button>
                    )}
               </div>
             )}
        </div>
      </div>

      {activeTab === 'saved' ? (
          <div className="min-h-[50vh] space-y-6">
              <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-900">Saved Properties</h2>
                  <div className="text-sm text-slate-500">{savedListings.length} Saved</div>
              </div>
              
              {savedListings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {savedListings.map(listing => (
                          <div key={listing.id} className="relative group">
                              <ListingCard 
                                  listing={listing} 
                                  onClick={() => onSelectList && onSelectList(listing.id)}
                                  isSaved={true}
                                  onToggleSaved={onToggleSaved}
                              />
                              <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                  Saved
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Heart size={32} className="text-slate-300" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">No saved homes yet</h3>
                      <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                          When you find a place you like, click the heart icon to save it here for quick access.
                      </p>
                      <button 
                          onClick={() => setActiveTab('overview')} // Ideally redirect to home, but switching tab works for now
                          className="text-emerald-600 font-bold hover:underline"
                      >
                          Browse Listings
                      </button>
                  </div>
              )}
          </div>
      ) : (
        /* OVERVIEW TAB CONTENT */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2">
            {/* Left Column: Profile & Stats */}
            <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowProfileModal(true)}>
                    <img src={MOCK_USER_TENANT.avatarUrl} className="w-16 h-16 rounded-full border-2 border-slate-100 object-cover" alt="Profile" />
                    <div>
                        <h2 className="font-bold text-slate-900">{MOCK_USER_TENANT.name}</h2>
                        <div className="text-sm text-slate-500">{MOCK_USER_TENANT.verifiedAffiliation}</div>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <div className="text-xs text-slate-500 uppercase mb-1 flex justify-between">
                            <span>Verification Class</span>
                            {!verificationStatus.background && (
                                <span className="text-emerald-600 font-bold cursor-pointer hover:underline" onClick={() => setShowVerificationModal(true)}>Upgrade</span>
                            )}
                        </div>
                        <VerificationBadge vClass={MOCK_USER_TENANT.verificationClass} confidence={MOCK_USER_TENANT.confidence} className="w-full justify-center" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase mb-1">Insurance Status</div>
                        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded text-sm font-medium">
                            <Check size={16} /> {MOCK_USER_TENANT.insuranceStatus}
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-6">
                    <button 
                        onClick={() => setShowProfileModal(true)}
                        className="text-sm text-slate-600 border border-slate-300 rounded py-2 hover:bg-slate-50 font-medium"
                    >
                        View Profile
                    </button>
                    <button 
                        onClick={() => setShowVerificationModal(true)}
                        className="text-sm bg-slate-900 text-white rounded py-2 hover:bg-slate-800 font-medium flex items-center justify-center gap-1"
                    >
                        <Shield size={14} /> Verify
                    </button>
                </div>
            </div>

            <TrustLedger user={MOCK_USER_TENANT} />
            </div>

            {/* Right Column: Active Deal or Dispute Center */}
            <div className="lg:col-span-2 space-y-6">
                <div className={`bg-white border rounded-lg shadow-sm ${currentDeal.status === DealStatus.DISPUTE ? 'border-amber-200' : 'border-slate-200'}`}>
                    {/* Header Logic */}
                    <div className={`px-6 py-4 rounded-t-lg flex justify-between items-center ${currentDeal.status === DealStatus.DISPUTE ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white'}`}>
                        <h3 className="font-semibold">
                            {currentDeal.status === DealStatus.DISPUTE ? 'Protocol Alert: Dispute #8821' : `Active Deal: ${currentDeal.listingId === '101' ? 'Modern Loft in Arts District' : 'Quiet Bungalow for Remote Work'}`}
                        </h3>
                        
                        {currentDeal.status === DealStatus.DISPUTE ? (
                            <span className="bg-white/20 text-white border border-white/30 px-2 py-1 rounded text-xs font-medium">
                                Action Required
                            </span>
                        ) : (
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded text-xs">
                                Protocol Active
                            </span>
                        )}
                    </div>
                    
                    {currentDeal.status === DealStatus.DISPUTE ? (
                        <DisputeCenter deal={currentDeal} userRole="tenant" />
                    ) : (
                        <div className="p-6">
                            <div className="flex items-center gap-8 mb-8">
                                <div className="flex-1 bg-slate-50 p-4 rounded border border-slate-100 text-center">
                                    <div className="text-xs text-slate-500 uppercase">Days Remaining</div>
                                    <div className="text-2xl font-bold text-slate-900">42</div>
                                    <div className="text-xs text-slate-400">Until {currentDeal.endDate}</div>
                                </div>
                                <div className="flex-1 bg-slate-50 p-4 rounded border border-slate-100 text-center">
                                    <div className="text-xs text-slate-500 uppercase">Protocol Protection</div>
                                    <div className="text-2xl font-bold text-emerald-600">Active</div>
                                    <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                                        <Check size={12} /> Fee Paid by Host
                                    </div>
                                </div>
                                <div className="flex-1 bg-slate-50 p-4 rounded border border-slate-100 text-center">
                                    <div className="text-xs text-slate-500 uppercase">Compliance</div>
                                    <div className="text-2xl font-bold text-emerald-600">100%</div>
                                    <div className="text-xs text-slate-400">No Violations</div>
                                </div>
                            </div>

                            {/* Booking Management Actions */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                                <button onClick={() => handleManageAction('Message Host')} className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-300 transition-colors">
                                    <MessageSquare size={18} className="text-slate-600 mb-1" />
                                    <span className="text-xs font-medium text-slate-700">Message Host</span>
                                </button>
                                <button onClick={() => handleManageAction('View Itinerary')} className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-300 transition-colors">
                                    <FileText size={18} className="text-slate-600 mb-1" />
                                    <span className="text-xs font-medium text-slate-700">View Itinerary</span>
                                </button>
                                <button onClick={() => handleManageAction('Invite Co-Travelers')} className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-300 transition-colors">
                                    <Users size={18} className="text-slate-600 mb-1" />
                                    <span className="text-xs font-medium text-slate-700">Add Guests</span>
                                </button>
                                <button onClick={() => handleManageAction('Cancel / Modify')} className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors group">
                                    <Ban size={18} className="text-slate-600 group-hover:text-red-500 mb-1" />
                                    <span className="text-xs font-medium text-slate-700 group-hover:text-red-600">Cancel / Modify</span>
                                </button>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                    <Clock size={16} className="text-slate-500" />
                                    Next Steps
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 border border-slate-200 rounded bg-white opacity-50">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs">✓</div>
                                        <span className="text-sm text-slate-500 line-through">Move-in Evidence Uploaded</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 border border-blue-200 bg-blue-50 rounded">
                                        <AlertCircle size={16} className="text-blue-600" />
                                        <span className="text-sm text-blue-900 font-medium">Pre-Exit Inspection (Due in 35 days)</span>
                                        <button className="ml-auto text-xs bg-white border border-blue-200 px-3 py-1 rounded hover:bg-blue-100">View Guide</button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Truth Surface Preview */}
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-3">Deal Record</h4>
                                <TruthSurface items={currentDeal.truthSurface} isLocked={true} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* Modals */}
      {showVerificationModal && (
        <TenantVerificationModal 
            onClose={() => setShowVerificationModal(false)} 
            status={verificationStatus}
        />
      )}
      
      {showProfileModal && (
        <UserProfileModal 
            user={MOCK_USER_TENANT}
            onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
};

export default TenantDashboard;
