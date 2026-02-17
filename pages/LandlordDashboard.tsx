
import React, { useState } from 'react';
import { MOCK_USER_LANDLORD, MOCK_LISTINGS, MOCK_ACTIVE_DEAL, MOCK_DISPUTE_DEAL } from '../constants';
import VerificationBadge from '../components/VerificationBadge';
import { VerificationClass, DealStatus, Listing, ConfidenceLevel, Inquiry, ListingStatus } from '../types';
import DisputeCenter from '../components/DisputeCenter';
import TruthSurface from '../components/TruthSurface';
import HostVerificationModal from '../components/HostVerificationModal';
import PropertyVerificationModal from '../components/PropertyVerificationModal';
import { useToast } from '../components/ToastProvider';
import { Plus, Users, ArrowRight, Wallet, Check, X, ShieldCheck, Building, User, CreditCard, Lock, Loader2, RefreshCw, Ban, AlertTriangle, FileSignature, PenTool, CheckCircle2, BarChart3, Eye, MessageSquare, TrendingUp, MapPin, Send, Home, DollarSign, List, ChevronRight, ChevronLeft, Wifi, Cigarette, Dog, Accessibility, MoreHorizontal, Calendar, Search } from 'lucide-react';

interface Props {
  inquiries?: Inquiry[];
  onAnswerInquiry?: (id: string, answer: string) => void;
}

const LandlordDashboard: React.FC<Props> = ({ inquiries = [], onAnswerInquiry }) => {
  const { addToast } = useToast();
  const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hostSignature, setHostSignature] = useState<string | null>(null);
  
  // Inquiry Response State
  const [answeringInquiryId, setAnsweringInquiryId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');

  // Verification State
  const [showHostVerify, setShowHostVerify] = useState(false);
  const [listingToVerify, setListingToVerify] = useState<Listing | null>(null);
  
  // Listing Management State
  const [showAddListing, setShowAddListing] = useState(false);
  const [myListings, setMyListings] = useState<Listing[]>(MOCK_LISTINGS.filter(l => l.hostId === MOCK_USER_LANDLORD.id));
  
  // Add Listing Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [newListing, setNewListing] = useState({
      title: '',
      description: '',
      propertyType: 'Apartment',
      address: '',
      city: '',
      state: '',
      zip: '',
      price: '',
      deposit: '',
      bedrooms: 1,
      bathrooms: 1,
      sqft: '',
      furnished: true,
      utilitiesIncluded: false,
      amenities: [] as string[],
      accessibility: [] as string[],
      requirements: {
          minCreditScore: 650,
          incomeMultiplier: 2.5,
          smokingAllowed: false,
          petsAllowed: false
      }
  });

  // Deal Management State
  const [activeTab, setActiveTab] = useState<'overview' | 'deals' | 'listings' | 'inquiries'>('overview');
  const [showDisputeSim, setShowDisputeSim] = useState(false);

  // Mock Deals List
  const myDeals = [
      showDisputeSim ? MOCK_DISPUTE_DEAL : { ...MOCK_ACTIVE_DEAL, id: 'd_101', listingId: '101' },
      { ...MOCK_ACTIVE_DEAL, id: 'd_102', listingId: '102', tenantId: 't2', startDate: '2023-12-01', endDate: '2024-03-01' }
  ];

  // Filter inquiries for this landlord's listings
  const myInquiries = inquiries.filter(inq => myListings.some(l => l.id === inq.listingId));
  const pendingInquiriesCount = myInquiries.filter(i => i.status === 'pending').length;

  const handleApprove = () => {
    setHostSignature(null); // Reset signature state for new flow
    setShowPaymentModal(true);
  };

  const handleSignProtocol = () => {
    // Simulate cryptographic signing
    setHostSignature('0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''));
    addToast("Signature generated successfully.", 'success');
  };

  const handleConfirmActivation = () => {
    if (!hostSignature) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowPaymentModal(false);
      setSelectedApplicant(null);
      setHostSignature(null);
      addToast("Protocol Activated! Funds are now in Escrow.", 'success');
    }, 2000);
  };

  const toggleAmenity = (amenity: string) => {
      setNewListing(prev => {
          const amenities = prev.amenities.includes(amenity)
            ? prev.amenities.filter(a => a !== amenity)
            : [...prev.amenities, amenity];
          return { ...prev, amenities };
      });
  };

  const toggleAccessibility = (feature: string) => {
      setNewListing(prev => {
          const accessibility = prev.accessibility.includes(feature)
            ? prev.accessibility.filter(a => a !== feature)
            : [...prev.accessibility, feature];
          return { ...prev, accessibility };
      });
  };

  const handleAddListing = () => {
    const listing: Listing = {
        id: Math.random().toString(),
        title: newListing.title || 'Untitled Listing',
        description: newListing.description || 'No description provided.',
        status: ListingStatus.DRAFT,
        priceDisplay: parseInt(newListing.price) || 0,
        location: { 
            city: newListing.city || 'Unknown', 
            state: newListing.state || 'CA', 
            zip: newListing.zip || '00000', 
            approximate: true 
        },
        depositGuidance: { 
            min: Math.floor(parseInt(newListing.deposit || '0') * 0.5), 
            max: parseInt(newListing.deposit || '0'), 
            recommended: Math.floor(parseInt(newListing.deposit || '0') * 0.8) 
        },
        details: { 
            bedrooms: newListing.bedrooms, 
            bathrooms: newListing.bathrooms, 
            sqft: parseInt(newListing.sqft) || 500, 
            furnished: newListing.furnished, 
            utilitiesIncluded: newListing.utilitiesIncluded 
        },
        amenities: newListing.amenities,
        accessibility: newListing.accessibility,
        requirements: newListing.requirements,
        imageUrl: 'https://picsum.photos/seed/new/800/600',
        hostId: MOCK_USER_LANDLORD.id,
        verificationStatus: {
            photoMatch: false,
            videoTour: false,
            documents: false,
            mailCode: false,
            gpsMatch: false
        }
    };
    setMyListings([...myListings, listing]);
    setShowAddListing(false);
    setWizardStep(1);
    addToast("Listing created successfully!", 'success');
    // Reset form
    setNewListing({
      title: '', description: '', propertyType: 'Apartment', address: '', city: '', state: '', zip: '',
      price: '', deposit: '', bedrooms: 1, bathrooms: 1, sqft: '', furnished: true, utilitiesIncluded: false,
      amenities: [], accessibility: [],
      requirements: { minCreditScore: 650, incomeMultiplier: 2.5, smokingAllowed: false, petsAllowed: false }
    });
  };

  const submitAnswer = (id: string) => {
      if (onAnswerInquiry && answerText) {
          onAnswerInquiry(id, answerText);
          setAnsweringInquiryId(null);
          setAnswerText('');
          addToast("Reply sent to tenant.", 'success');
      }
  };

  const getStatusColor = (status: ListingStatus) => {
      switch (status) {
          case ListingStatus.ACTIVE: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
          case ListingStatus.PENDING_VERIFICATION: return 'bg-amber-100 text-amber-700 border-amber-200';
          case ListingStatus.DRAFT: return 'bg-slate-100 text-slate-600 border-slate-200';
          case ListingStatus.OCCUPIED: return 'bg-blue-100 text-blue-700 border-blue-200';
          case ListingStatus.SUSPENDED: return 'bg-red-100 text-red-700 border-red-200';
          default: return 'bg-slate-100 text-slate-600 border-slate-200';
      }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Landlord Portal</h1>
            <p className="text-slate-500">Risk intelligence and protocol enforcement center.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
             {/* Host Verification Status/CTA */}
             <button 
                onClick={() => setShowHostVerify(true)}
                className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm"
             >
                <div className="relative">
                    <User size={16} />
                    {MOCK_USER_LANDLORD.hostVerification?.govtId && <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"></div>}
                </div>
                {MOCK_USER_LANDLORD.hostVerification?.govtId ? 'Identity Verified' : 'Verify Identity'}
             </button>

            <div className="bg-slate-100 p-1 rounded-lg flex text-sm font-medium">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-1.5 rounded-md transition-all ${activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Overview
                </button>
                <button 
                    onClick={() => setActiveTab('inquiries')}
                    className={`px-4 py-1.5 rounded-md transition-all flex items-center gap-2 ${activeTab === 'inquiries' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Inquiries
                    {pendingInquiriesCount > 0 && (
                        <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingInquiriesCount}</span>
                    )}
                </button>
                <button 
                    onClick={() => setActiveTab('deals')}
                    className={`px-4 py-1.5 rounded-md transition-all ${activeTab === 'deals' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Active Deals
                </button>
                <button 
                    onClick={() => setActiveTab('listings')}
                    className={`px-4 py-1.5 rounded-md transition-all ${activeTab === 'listings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Listings
                </button>
            </div>
            <button 
                onClick={() => setShowAddListing(true)}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition-colors text-sm font-medium shadow-md shadow-slate-900/10 active:scale-95"
            >
                <Plus size={16} /> New Listing
            </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <div className="text-slate-500 text-sm font-medium uppercase mb-2">Active Protocols</div>
                    <div className="text-3xl font-bold text-slate-900">12</div>
                    <div className="text-emerald-600 text-sm mt-1 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> All Compliant
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <div className="text-slate-500 text-sm font-medium uppercase mb-2">Pending Inquiries</div>
                    <div className="text-3xl font-bold text-slate-900">{pendingInquiriesCount}</div>
                    <div className="text-blue-600 text-sm mt-1">Requires Response</div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <div className="text-slate-500 text-sm font-medium uppercase mb-2">Avoided Disputes</div>
                    <div className="text-3xl font-bold text-slate-900">100%</div>
                    <div className="text-slate-400 text-sm mt-1">Last 12 months</div>
                </div>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-4">Incoming Applications</h2>
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden mb-12 shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                            <th className="p-4">Applicant</th>
                            <th className="p-4">Listing</th>
                            <th className="p-4">Risk Class</th>
                            <th className="p-4">Insurance</th>
                            <th className="p-4">Rec. Deposit</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                                <div className="font-medium text-slate-900">Dr. Emily Zhang</div>
                                <div className="text-xs text-slate-500">UCSF Resident</div>
                            </td>
                            <td className="p-4 text-sm text-slate-600">Executive Suite SF</td>
                            <td className="p-4"><VerificationBadge vClass={VerificationClass.LOW_RISK} /></td>
                            <td className="p-4 text-sm text-emerald-600 font-medium">Institution-Backed</td>
                            <td className="p-4 text-sm font-bold text-slate-700">$500</td>
                            <td className="p-4">
                                <button 
                                    onClick={() => setSelectedApplicant({ 
                                        name: "Dr. Emily Zhang", 
                                        listing: "Executive Suite SF", 
                                        risk: VerificationClass.LOW_RISK, 
                                        deposit: 500, 
                                        insurance: "Institution-Backed",
                                        confidence: ConfidenceLevel.HIGH,
                                        affiliation: "UCSF Resident"
                                    })}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                >
                                    Review <ArrowRight size={14} />
                                </button>
                            </td>
                        </tr>
                        <tr className="hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                                <div className="font-medium text-slate-900">James Smith</div>
                                <div className="text-xs text-slate-500">Freelance Consultant</div>
                            </td>
                            <td className="p-4 text-sm text-slate-600">Modern Loft LA</td>
                            <td className="p-4"><VerificationBadge vClass={VerificationClass.MEDIUM_RISK} /></td>
                            <td className="p-4 text-sm text-emerald-600 font-medium">Active (Lemonade)</td>
                            <td className="p-4 text-sm font-bold text-slate-700">$1,500</td>
                            <td className="p-4">
                                <button 
                                    onClick={() => setSelectedApplicant({ 
                                        name: "James Smith", 
                                        listing: "Modern Loft LA", 
                                        risk: VerificationClass.MEDIUM_RISK, 
                                        deposit: 1500, 
                                        insurance: "Active (Lemonade)",
                                        confidence: ConfidenceLevel.MEDIUM,
                                        affiliation: "Freelance Consultant"
                                    })}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                >
                                    Review <ArrowRight size={14} />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
      )}

      {/* INQUIRIES TAB */}
      {activeTab === 'inquiries' && (
          <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Message Center</h2>
                  <div className="text-sm text-slate-500">{pendingInquiriesCount} pending responses</div>
              </div>
              
              <div className="space-y-4">
                  {myInquiries.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-200 text-slate-500">
                          <MessageSquare className="mx-auto h-12 w-12 text-slate-300 mb-2" />
                          <p>No inquiries found.</p>
                      </div>
                  ) : (
                      myInquiries.map(inq => {
                          const listing = myListings.find(l => l.id === inq.listingId);
                          return (
                              <div key={inq.id} className={`bg-white border rounded-xl p-5 shadow-sm transition-all ${inq.status === 'pending' ? 'border-blue-200 ring-1 ring-blue-50' : 'border-slate-200'}`}>
                                  <div className="flex justify-between items-start mb-3">
                                      <div className="flex items-center gap-3">
                                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${inq.status === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                              {inq.tenantName.charAt(0)}
                                          </div>
                                          <div>
                                              <div className="font-bold text-slate-900">{inq.tenantName}</div>
                                              <div className="text-xs text-slate-500">Re: {listing?.title || 'Unknown Listing'}</div>
                                          </div>
                                      </div>
                                      <div className="flex flex-col items-end">
                                          <span className="text-xs text-slate-400">{new Date(inq.timestamp).toLocaleDateString()}</span>
                                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${inq.status === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                              {inq.status.toUpperCase()}
                                          </span>
                                      </div>
                                  </div>
                                  
                                  <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700 mb-4">
                                      <span className="font-bold text-slate-900 block text-xs uppercase mb-1">{inq.topic}</span>
                                      "{inq.question}"
                                  </div>

                                  {inq.status === 'pending' ? (
                                      <div className="animate-in fade-in">
                                          {answeringInquiryId === inq.id ? (
                                              <div>
                                                  <textarea 
                                                      className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:border-slate-500 mb-2"
                                                      rows={3}
                                                      placeholder="Type your official response..."
                                                      value={answerText}
                                                      onChange={(e) => setAnswerText(e.target.value)}
                                                  ></textarea>
                                                  <div className="flex gap-2 justify-end">
                                                      <button 
                                                          onClick={() => setAnsweringInquiryId(null)}
                                                          className="px-4 py-2 text-slate-600 text-sm font-medium hover:text-slate-900"
                                                      >
                                                          Cancel
                                                      </button>
                                                      <button 
                                                          onClick={() => submitAnswer(inq.id)}
                                                          disabled={!answerText}
                                                          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
                                                      >
                                                          Send Response
                                                      </button>
                                                  </div>
                                              </div>
                                          ) : (
                                              <button 
                                                  onClick={() => { setAnsweringInquiryId(inq.id); setAnswerText(''); }}
                                                  className="text-blue-600 font-medium text-sm hover:underline flex items-center gap-1"
                                              >
                                                  <MessageSquare size={14} /> Reply to Inquiry
                                              </button>
                                          )}
                                      </div>
                                  ) : (
                                      <div className="pl-4 border-l-2 border-emerald-300">
                                          <div className="text-xs font-bold text-emerald-600 mb-1">Your Answer:</div>
                                          <p className="text-sm text-slate-600">{inq.answer}</p>
                                      </div>
                                  )}
                              </div>
                          );
                      })
                  )}
              </div>
          </div>
      )}

      {/* ACTIVE DEALS TAB */}
      {activeTab === 'deals' && (
          <div className="space-y-6">
              <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-900">Active Contracts</h2>
                  <div className="flex gap-2">
                        <button 
                            onClick={() => setShowDisputeSim(!showDisputeSim)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium border transition-colors ${showDisputeSim ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white text-slate-600 border-slate-200'}`}
                        >
                            <RefreshCw size={12} /> {showDisputeSim ? 'Reset Simulation' : 'Simulate Dispute'}
                        </button>
                  </div>
              </div>

              {myDeals.map(deal => {
                  const listing = MOCK_LISTINGS.find(l => l.id === deal.listingId);
                  if (!listing) return null;

                  return (
                      <div key={deal.id} className={`bg-white border rounded-xl overflow-hidden shadow-sm ${deal.status === DealStatus.DISPUTE ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200'}`}>
                          {deal.status === DealStatus.DISPUTE ? (
                              <DisputeCenter deal={deal as any} userRole="landlord" />
                          ) : (
                              <div className="p-6">
                                  <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                                      <div className="flex items-start gap-4">
                                          <img src={listing.imageUrl} className="w-20 h-20 rounded-lg object-cover" alt="Property" />
                                          <div>
                                              <h3 className="font-bold text-slate-900 text-lg">{listing.title}</h3>
                                              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                                                  <MapPin size={14} /> {listing.location.city}, {listing.location.state}
                                              </div>
                                              <div className="flex gap-2">
                                                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                                      <ShieldCheck size={12} /> Protocol Active
                                                  </span>
                                                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium">
                                                      {deal.startDate} - {deal.endDate}
                                                  </span>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="text-right mt-4 md:mt-0">
                                          <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Monthly Rent</div>
                                          <div className="text-xl font-bold text-slate-900">${listing.priceDisplay.toLocaleString()}</div>
                                          <div className="text-xs text-emerald-600 font-medium mt-1">Paid • Next due {new Date().toLocaleDateString()}</div>
                                      </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                      <div>
                                          <div className="text-xs text-slate-500 font-bold uppercase mb-2">Tenant</div>
                                          <div className="flex items-center gap-2">
                                              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">SC</div>
                                              <div>
                                                  <div className="text-sm font-bold text-slate-900">Dr. Sarah Chen</div>
                                                  <div className="text-xs text-slate-500">Low Risk • Verified</div>
                                              </div>
                                          </div>
                                      </div>
                                      <div>
                                          <div className="text-xs text-slate-500 font-bold uppercase mb-2">Truth Surface</div>
                                          <div className="flex items-center gap-2 text-sm text-slate-700">
                                              <FileSignature size={16} className="text-slate-400" />
                                              <span className="font-mono bg-white px-1.5 rounded border border-slate-200 text-xs">0x8f2d...3a1b</span>
                                              <CheckCircle2 size={14} className="text-emerald-500" />
                                          </div>
                                      </div>
                                      <div className="flex items-center justify-end gap-2">
                                          <button className="px-3 py-2 bg-white border border-slate-300 rounded text-sm font-medium hover:bg-slate-50 transition-colors">
                                              Message
                                          </button>
                                          <button className="px-3 py-2 bg-white border border-slate-300 rounded text-sm font-medium hover:bg-slate-50 transition-colors">
                                              Ledger
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          )}
                      </div>
                  );
              })}
          </div>
      )}

      {/* LISTINGS TAB */}
      {activeTab === 'listings' && (
          <div>
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900">My Properties</h2>
                  <div className="relative">
                      <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="Search listings..." 
                        className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-slate-500"
                      />
                  </div>
              </div>

              <div className="space-y-4">
                  {myListings.map(listing => {
                      const vStatus = listing.verificationStatus || { photoMatch: false, videoTour: false, documents: false, mailCode: false, gpsMatch: false };
                      const verifiedCount = Object.values(vStatus).filter(Boolean).length;
                      
                      return (
                          <div key={listing.id} className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                              <div className="w-full md:w-48 h-32 shrink-0 bg-slate-100 rounded-lg overflow-hidden relative">
                                  <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover" />
                                  <div className={`absolute top-2 left-2 px-2 py-1 rounded text-[10px] font-bold uppercase border ${getStatusColor(listing.status)}`}>
                                      {listing.status}
                                  </div>
                              </div>
                              
                              <div className="flex-1 flex flex-col justify-between">
                                  <div>
                                      <div className="flex justify-between items-start">
                                          <h3 className="text-lg font-bold text-slate-900">{listing.title}</h3>
                                          <button className="text-slate-400 hover:text-slate-600">
                                              <MoreHorizontal size={20} />
                                          </button>
                                      </div>
                                      <div className="text-sm text-slate-500 mb-2">{listing.location.city}, {listing.location.state}</div>
                                      
                                      <div className="flex items-center gap-4 text-xs text-slate-600">
                                          <span className="flex items-center gap-1"><Home size={12} /> {listing.details.bedrooms}bd {listing.details.bathrooms}ba</span>
                                          <span className="flex items-center gap-1"><DollarSign size={12} /> ${listing.priceDisplay}/mo</span>
                                          <span className="flex items-center gap-1"><Users size={12} /> {listing.requirements.minCreditScore}+ Credit</span>
                                      </div>
                                  </div>

                                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                                      <div className="flex items-center gap-3">
                                          <div className="text-xs font-bold text-slate-500 uppercase">Trust Score</div>
                                          <div className="flex items-center gap-1">
                                              {verifiedCount === 5 ? (
                                                  <span className="text-emerald-600 font-bold text-sm flex items-center gap-1">
                                                      <ShieldCheck size={14} /> 5/5 Verified
                                                  </span>
                                              ) : (
                                                  <span className="text-amber-600 font-bold text-sm flex items-center gap-1">
                                                      <ShieldCheck size={14} /> {verifiedCount}/5 Pending
                                                  </span>
                                              )}
                                          </div>
                                      </div>
                                      <div className="flex gap-2">
                                          {verifiedCount < 5 && (
                                              <button 
                                                  onClick={() => setListingToVerify(listing)}
                                                  className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded font-medium hover:bg-slate-800 transition-colors"
                                              >
                                                  Continue Verification
                                              </button>
                                          )}
                                          <button className="text-xs border border-slate-300 text-slate-600 px-3 py-1.5 rounded font-medium hover:bg-slate-50 transition-colors">
                                              Edit
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
      )}

      {/* Add Listing Wizard Modal */}
      {showAddListing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
                  <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
                      <div>
                          <h3 className="font-bold text-lg text-slate-900">Add New Property</h3>
                          <div className="flex gap-2 text-xs mt-1 overflow-x-auto">
                             {['Basics', 'Location', 'Financials', 'Details', 'Tenant Req'].map((step, i) => (
                                 <div key={i} className={`flex items-center shrink-0 ${i + 1 === wizardStep ? 'text-slate-900 font-bold' : i + 1 < wizardStep ? 'text-emerald-600' : 'text-slate-400'}`}>
                                     <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] mr-1 ${i + 1 === wizardStep ? 'bg-slate-900 text-white' : i + 1 < wizardStep ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200'}`}>
                                         {i + 1 < wizardStep ? <Check size={8} /> : i + 1}
                                     </span>
                                     {step}
                                     {i < 4 && <div className="w-4 h-px bg-slate-200 mx-2" />}
                                 </div>
                             ))}
                          </div>
                      </div>
                      <button onClick={() => setShowAddListing(false)}><X size={20} className="text-slate-400" /></button>
                  </div>
                  
                  <div className="p-8 overflow-y-auto flex-1">
                      {wizardStep === 1 && (
                          <div className="space-y-4 animate-in slide-in-from-right-4">
                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Property Title</label>
                                  <input type="text" className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:border-slate-500" placeholder="e.g. Sunny Downtown Loft" value={newListing.title} onChange={e => setNewListing({...newListing, title: e.target.value})} />
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                  <textarea 
                                    className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:border-slate-500 h-24" 
                                    placeholder="Describe the property highlights, neighborhood, and vibe..." 
                                    value={newListing.description} 
                                    onChange={e => setNewListing({...newListing, description: e.target.value})} 
                                  />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-1">Property Type</label>
                                      <select className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:border-slate-500" value={newListing.propertyType} onChange={e => setNewListing({...newListing, propertyType: e.target.value})}>
                                          <option>Apartment</option>
                                          <option>House</option>
                                          <option>Condo</option>
                                          <option>Townhouse</option>
                                          <option>Guest Suite</option>
                                      </select>
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-1">Square Footage</label>
                                      <input type="number" className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:border-slate-500" placeholder="e.g. 850" value={newListing.sqft} onChange={e => setNewListing({...newListing, sqft: e.target.value})} />
                                  </div>
                              </div>
                          </div>
                      )}

                      {wizardStep === 2 && (
                           <div className="space-y-4 animate-in slide-in-from-right-4">
                               <div>
                                   <label className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
                                   <div className="relative">
                                       <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                                       <input type="text" className="w-full border border-slate-300 rounded-lg p-3 pl-10 focus:outline-none focus:border-slate-500" placeholder="123 Main St" value={newListing.address} onChange={e => setNewListing({...newListing, address: e.target.value})} />
                                   </div>
                               </div>
                               <div className="grid grid-cols-2 gap-4">
                                   <div>
                                       <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                       <input type="text" className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:border-slate-500" placeholder="San Francisco" value={newListing.city} onChange={e => setNewListing({...newListing, city: e.target.value})} />
                                   </div>
                                   <div>
                                       <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                                       <input type="text" className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:border-slate-500" placeholder="CA" value={newListing.state} onChange={e => setNewListing({...newListing, state: e.target.value})} />
                                   </div>
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-slate-700 mb-1">Zip Code</label>
                                   <input type="text" className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:border-slate-500" placeholder="94105" value={newListing.zip} onChange={e => setNewListing({...newListing, zip: e.target.value})} />
                               </div>
                           </div>
                      )}

                      {wizardStep === 3 && (
                           <div className="space-y-4 animate-in slide-in-from-right-4">
                               <div>
                                   <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Rent ($)</label>
                                   <div className="relative">
                                       <DollarSign className="absolute left-3 top-3 text-slate-400" size={18} />
                                       <input type="number" className="w-full border border-slate-300 rounded-lg p-3 pl-10 focus:outline-none focus:border-slate-500" placeholder="3000" value={newListing.price} onChange={e => setNewListing({...newListing, price: e.target.value})} />
                                   </div>
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-slate-700 mb-1">Security Deposit Max ($)</label>
                                   <div className="relative">
                                       <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                       <input type="number" className="w-full border border-slate-300 rounded-lg p-3 pl-10 focus:outline-none focus:border-slate-500" placeholder="3000" value={newListing.deposit} onChange={e => setNewListing({...newListing, deposit: e.target.value})} />
                                   </div>
                                   <p className="text-xs text-slate-500 mt-1">Lagedra protocol will optimize this downwards for low-risk tenants.</p>
                               </div>
                           </div>
                      )}

                      {wizardStep === 4 && (
                           <div className="space-y-4 animate-in slide-in-from-right-4">
                               <div className="grid grid-cols-2 gap-4">
                                   <div>
                                       <label className="block text-sm font-medium text-slate-700 mb-1">Bedrooms</label>
                                       <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                                            <button className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border-r" onClick={() => setNewListing({...newListing, bedrooms: Math.max(0, newListing.bedrooms - 1)})}>-</button>
                                            <input type="text" className="w-full text-center p-2 outline-none" value={newListing.bedrooms} readOnly />
                                            <button className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border-l" onClick={() => setNewListing({...newListing, bedrooms: newListing.bedrooms + 1})}>+</button>
                                       </div>
                                   </div>
                                   <div>
                                       <label className="block text-sm font-medium text-slate-700 mb-1">Bathrooms</label>
                                       <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                                            <button className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border-r" onClick={() => setNewListing({...newListing, bathrooms: Math.max(0, newListing.bathrooms - 0.5)})}>-</button>
                                            <input type="text" className="w-full text-center p-2 outline-none" value={newListing.bathrooms} readOnly />
                                            <button className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border-l" onClick={() => setNewListing({...newListing, bathrooms: newListing.bathrooms + 0.5})}>+</button>
                                       </div>
                                   </div>
                               </div>
                               <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer" onClick={() => setNewListing({...newListing, furnished: !newListing.furnished})}>
                                   <div className="flex items-center gap-3">
                                       <Home size={20} className="text-slate-500" />
                                       <span className="text-sm font-medium text-slate-700">Fully Furnished</span>
                                   </div>
                                   <div className={`w-5 h-5 rounded border flex items-center justify-center ${newListing.furnished ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-300'}`}>
                                       {newListing.furnished && <Check size={12} />}
                                   </div>
                               </div>
                               <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer" onClick={() => setNewListing({...newListing, utilitiesIncluded: !newListing.utilitiesIncluded})}>
                                   <div className="flex items-center gap-3">
                                       <List size={20} className="text-slate-500" />
                                       <span className="text-sm font-medium text-slate-700">Utilities Included</span>
                                   </div>
                                   <div className={`w-5 h-5 rounded border flex items-center justify-center ${newListing.utilitiesIncluded ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-300'}`}>
                                       {newListing.utilitiesIncluded && <Check size={12} />}
                                   </div>
                               </div>

                               <div>
                                   <label className="block text-sm font-medium text-slate-700 mb-2">Amenities</label>
                                   <div className="grid grid-cols-2 gap-2">
                                       {['High-Speed WiFi', 'Air Conditioning', 'Washer/Dryer', 'Parking', 'Gym Access', 'Smart Lock', 'Pet Friendly', 'Dedicated Workspace'].map(amenity => (
                                           <div 
                                              key={amenity}
                                              onClick={() => toggleAmenity(amenity)}
                                              className={`p-2 rounded border text-sm flex items-center gap-2 cursor-pointer ${newListing.amenities.includes(amenity) ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                           >
                                               <div className={`w-4 h-4 rounded border flex items-center justify-center ${newListing.amenities.includes(amenity) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                                                   {newListing.amenities.includes(amenity) && <Check size={10} />}
                                               </div>
                                               {amenity}
                                           </div>
                                       ))}
                                   </div>
                               </div>

                               <div>
                                   <label className="block text-sm font-medium text-slate-700 mb-2 mt-4">Accessibility Features</label>
                                   <div className="grid grid-cols-2 gap-2">
                                       {['Step-free guest entrance', 'Wide doorways', 'Elevator', 'Step-free shower', 'Accessible parking'].map(feature => (
                                           <div 
                                              key={feature}
                                              onClick={() => toggleAccessibility(feature)}
                                              className={`p-2 rounded border text-sm flex items-center gap-2 cursor-pointer ${newListing.accessibility.includes(feature) ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                           >
                                               <div className={`w-4 h-4 rounded border flex items-center justify-center ${newListing.accessibility.includes(feature) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                                                   {newListing.accessibility.includes(feature) && <Check size={10} />}
                                               </div>
                                               {feature}
                                           </div>
                                       ))}
                                   </div>
                               </div>
                           </div>
                      )}

                      {wizardStep === 5 && (
                           <div className="space-y-6 animate-in slide-in-from-right-4">
                               <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                   <h3 className="font-bold text-slate-900 mb-1">Tenant Risk Thresholds</h3>
                                   <p className="text-xs text-slate-500">Define the minimum requirements for applicants. Lagedra protocol filters applications automatically based on these parameters.</p>
                               </div>

                               <div>
                                   <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Credit Score ({newListing.requirements.minCreditScore})</label>
                                   <input 
                                      type="range" 
                                      min="500" 
                                      max="850" 
                                      step="10"
                                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                                      value={newListing.requirements.minCreditScore}
                                      onChange={(e) => setNewListing({...newListing, requirements: {...newListing.requirements, minCreditScore: parseInt(e.target.value)}})}
                                   />
                                   <div className="flex justify-between text-xs text-slate-400 mt-1">
                                       <span>500 (Fair)</span>
                                       <span>850 (Excellent)</span>
                                   </div>
                               </div>

                               <div>
                                   <label className="block text-sm font-medium text-slate-700 mb-1">Income Multiplier ({newListing.requirements.incomeMultiplier}x Rent)</label>
                                   <div className="flex gap-2">
                                       {[2.0, 2.5, 3.0, 3.5, 4.0].map(val => (
                                           <button 
                                              key={val}
                                              onClick={() => setNewListing({...newListing, requirements: {...newListing.requirements, incomeMultiplier: val}})}
                                              className={`px-3 py-1.5 rounded text-sm border ${newListing.requirements.incomeMultiplier === val ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                                           >
                                               {val}x
                                           </button>
                                       ))}
                                   </div>
                               </div>

                               <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer" onClick={() => setNewListing({...newListing, requirements: {...newListing.requirements, smokingAllowed: !newListing.requirements.smokingAllowed}})}>
                                   <div className="flex items-center gap-3">
                                       <Cigarette size={20} className="text-slate-500" />
                                       <span className="text-sm font-medium text-slate-700">Smoking Allowed</span>
                                   </div>
                                   <div className={`w-10 h-5 rounded-full flex items-center transition-colors px-1 ${newListing.requirements.smokingAllowed ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}>
                                       <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm"></div>
                                   </div>
                               </div>

                               <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer" onClick={() => setNewListing({...newListing, requirements: {...newListing.requirements, petsAllowed: !newListing.requirements.petsAllowed}})}>
                                   <div className="flex items-center gap-3">
                                       <Dog size={20} className="text-slate-500" />
                                       <span className="text-sm font-medium text-slate-700">Pets Allowed</span>
                                   </div>
                                   <div className={`w-10 h-5 rounded-full flex items-center transition-colors px-1 ${newListing.requirements.petsAllowed ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}>
                                       <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm"></div>
                                   </div>
                               </div>
                           </div>
                      )}
                  </div>

                  <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-between">
                      <button 
                         onClick={() => wizardStep > 1 ? setWizardStep(wizardStep - 1) : setShowAddListing(false)}
                         className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-white transition-colors"
                      >
                          {wizardStep === 1 ? 'Cancel' : 'Back'}
                      </button>
                      <button 
                         onClick={() => wizardStep < 5 ? setWizardStep(wizardStep + 1) : handleAddListing()}
                         className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
                      >
                          {wizardStep === 5 ? 'Create Listing' : <>Next <ChevronRight size={16} /></>}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Review Application Modal */}
      {selectedApplicant && !showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Review Application</h3>
                        <p className="text-sm text-slate-500">Applicant has signed the Truth Surface.</p>
                    </div>
                    <button onClick={() => setSelectedApplicant(null)} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                            <User size={24} />
                        </div>
                        <div>
                            <div className="font-bold text-lg text-slate-900">{selectedApplicant.name}</div>
                            <div className="text-sm text-slate-500">Applying for <span className="font-medium text-slate-900">{selectedApplicant.listing}</span></div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-4">
                        {/* Enhanced Risk Profile Header */}
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Risk Profile</div>
                                <VerificationBadge vClass={selectedApplicant.risk} showLabel={true} className="shadow-sm" />
                            </div>
                            <div className="text-right">
                                 <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Identity Confidence</div>
                                 <div className="flex items-center justify-end gap-2 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className={`w-1.5 h-3 rounded-sm ${
                                                selectedApplicant.confidence === ConfidenceLevel.HIGH ? 'bg-emerald-500' : 
                                                (selectedApplicant.confidence === ConfidenceLevel.MEDIUM && i <= 2) ? 'bg-amber-500' : 
                                                (selectedApplicant.confidence === ConfidenceLevel.LOW && i <= 1) ? 'bg-red-500' : 'bg-slate-200'
                                            }`} />
                                        ))}
                                    </div>
                                    <span className={`font-bold text-sm ${
                                        selectedApplicant.confidence === ConfidenceLevel.HIGH ? 'text-emerald-700' : 
                                        selectedApplicant.confidence === ConfidenceLevel.MEDIUM ? 'text-amber-700' : 'text-red-700'
                                    }`}>
                                        {selectedApplicant.confidence}
                                    </span>
                                 </div>
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="border-t border-slate-200"></div>

                        {selectedApplicant.affiliation && (
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600 text-sm font-medium">Verified Affiliation</span>
                                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md border border-blue-100">
                                    <Building size={14} />
                                    <span className="text-sm font-semibold">{selectedApplicant.affiliation}</span>
                                    <CheckCircle2 size={12} className="ml-1" />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <span className="text-slate-600 text-sm font-medium">Insurance Coverage</span>
                            <span className="text-sm font-medium text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                                <ShieldCheck size={14} /> {selectedApplicant.insurance}
                            </span>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2">
                             <span className="text-slate-600 text-sm font-medium">Digital Signature</span>
                             <div className="flex items-center gap-2 text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded">
                                 <FileSignature size={12} />
                                 0x8f2d...3a1b
                             </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => setSelectedApplicant(null)}
                            className="px-4 py-3 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                        >
                            Decline
                        </button>
                        <button 
                            onClick={handleApprove}
                            className="px-4 py-3 bg-slate-900 rounded-lg text-white font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                        >
                            <Check size={18} /> Approve
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Protocol Activation / Signing / Payment Modal */}
      {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                 <div className="bg-slate-900 text-white p-6">
                     <h3 className="text-xl font-bold flex items-center gap-2"><Lock size={20} /> Activate Protocol</h3>
                     <p className="text-slate-300 text-sm mt-1">Sign and Pay to seal the deal on-chain.</p>
                 </div>
                 <div className="p-6 overflow-y-auto max-h-[80vh]">
                     {/* Fee Section */}
                     <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-6">
                         <div className="flex justify-between items-center mb-2">
                             <span className="text-sm text-slate-600">Protocol Activation Fee</span>
                             <span className="font-bold text-slate-900">$79.00</span>
                         </div>
                         <div className="flex justify-between items-center text-xs text-slate-400">
                             <span>Term</span>
                             <span>Monthly (Billed to Host)</span>
                         </div>
                     </div>

                     {/* Digital Signature Section */}
                     <div className="mb-6">
                        <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                            <FileSignature size={18} className="text-slate-500" /> Protocol Countersignature
                        </h4>
                        <div className="text-xs text-slate-500 mb-3">
                            By signing, you agree to the Truth Surface hash <span className="font-mono bg-slate-100 px-1 rounded">0x8f2d...3a1b</span> as the binding source of truth.
                        </div>
                        
                        {!hostSignature ? (
                            <button 
                                onClick={handleSignProtocol}
                                className="w-full py-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all font-mono text-sm flex items-center justify-center gap-2 group"
                            >
                                <PenTool size={16} className="group-hover:rotate-45 transition-transform" />
                                Click to Cryptographically Sign
                            </button>
                        ) : (
                            <div className="w-full py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-mono text-xs flex flex-col items-center justify-center gap-1 animate-in zoom-in">
                                <div className="flex items-center gap-2 font-bold">
                                    <Check size={14} /> Signed Successfully
                                </div>
                                <div className="opacity-70 break-all px-4 text-center">{hostSignature}</div>
                            </div>
                        )}
                     </div>

                     {/* Payment Section */}
                     <div className="mb-6 opacity-90">
                         <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
                         <div className="border border-blue-500 bg-blue-50 p-3 rounded-lg flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <CreditCard className="text-blue-600" size={20} />
                                 <span className="font-medium text-slate-900">Visa ending in 4242</span>
                             </div>
                             <span className="text-xs font-bold text-blue-600">Selected</span>
                         </div>
                     </div>

                     <div className="flex gap-3 pt-2 border-t border-slate-100">
                         <button 
                            onClick={() => setShowPaymentModal(false)}
                            className="flex-1 py-3 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50"
                         >
                            Cancel
                         </button>
                         <button 
                            onClick={handleConfirmActivation}
                            disabled={!hostSignature || isProcessing}
                            className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                         >
                            {isProcessing ? <Loader2 className="animate-spin" size={18} /> : 'Pay & Activate'}
                         </button>
                     </div>
                 </div>
             </div>
          </div>
      )}

      {/* Host Verification Modal */}
      {showHostVerify && MOCK_USER_LANDLORD.hostVerification && (
        <HostVerificationModal 
            onClose={() => setShowHostVerify(false)} 
            status={MOCK_USER_LANDLORD.hostVerification} 
        />
      )}

      {/* Property Verification Modal */}
      {listingToVerify && (
        <PropertyVerificationModal 
            listing={listingToVerify} 
            status={listingToVerify.verificationStatus}
            onClose={() => setListingToVerify(null)} 
        />
      )}

    </div>
  );
};

export default LandlordDashboard;
