
import React, { useState } from 'react';
import { Listing, UserRole, Inquiry } from '../types';
import { MOCK_USER_TENANT, MOCK_USER_LANDLORD } from '../constants';
import VerificationBadge from '../components/VerificationBadge';
import ApplicationWizard from '../components/ApplicationWizard';
import MessageModal from '../components/MessageModal';
import { useToast } from '../components/ToastProvider';
import { 
  ShieldCheck, Map, Wifi, Car, Dumbbell, Lock, Dog, Ban, 
  Share, Heart, Star, User, Check, Shield, MapPin, 
  Calendar, Flag, ChevronDown, MessageSquare, Info, Grip, X, Video, FileText, Mail, ChevronRight
} from 'lucide-react';

interface Props {
  listing: Listing;
  onNavigate: (page: string) => void;
  currentRole: UserRole;
  inquiries: Inquiry[];
  onSendInquiry: (listingId: string, topic: string, question: string) => void;
  isSaved?: boolean;
  onToggleSaved?: () => void;
}

const ListingDetails: React.FC<Props> = ({ listing, onNavigate, currentRole, inquiries, onSendInquiry, isSaved, onToggleSaved }) => {
  const { addToast } = useToast();
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedInquiryTopic, setSelectedInquiryTopic] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');
  const [showWizard, setShowWizard] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showTrustModal, setShowTrustModal] = useState(false);

  // Derived Data
  const tenantRisk = MOCK_USER_TENANT.verificationClass;
  const depositAmt = tenantRisk === 'Low Risk' ? listing.depositGuidance.recommended : listing.depositGuidance.max;
  
  // Property Trust Calculation
  const vStatus = listing.verificationStatus || { photoMatch: false, videoTour: false, documents: false, mailCode: false, gpsMatch: false };
  const verifiedCount = Object.values(vStatus).filter(Boolean).length;
  const totalChecks = 5;
  const isFullyVerified = verifiedCount === totalChecks;

  // Filter inquiries
  const myInquiries = inquiries.filter(i => i.listingId === listing.id && i.tenantId === MOCK_USER_TENANT.id);

  // Mock Gallery Images (using seed to keep them consistent but different)
  const galleryImages = [
    listing.imageUrl,
    `https://picsum.photos/seed/${listing.id}kitchen/800/600`,
    `https://picsum.photos/seed/${listing.id}bed/800/600`,
    `https://picsum.photos/seed/${listing.id}bath/800/600`,
    `https://picsum.photos/seed/${listing.id}living/800/600`,
    `https://picsum.photos/seed/${listing.id}detail1/800/600`,
    `https://picsum.photos/seed/${listing.id}detail2/800/600`,
  ];

  const handleSend = () => {
    if (selectedInquiryTopic) {
        onSendInquiry(listing.id, selectedInquiryTopic, customQuestion || `Standard request regarding ${selectedInquiryTopic}`);
        setInquiryModalOpen(false);
        setCustomQuestion('');
        setSelectedInquiryTopic('');
        addToast("Inquiry sent successfully. The host will be notified.", 'success');
    }
  };

  const handleToggleSave = () => {
      if (onToggleSaved) {
          onToggleSaved();
          addToast(isSaved ? "Removed from saved homes" : "Added to saved homes", 'info');
      }
  };

  const getAmenityIcon = (name: string) => {
      if (name.includes('WiFi')) return <Wifi size={24} />;
      if (name.includes('Workspace')) return <Map size={24} />;
      if (name.includes('Parking')) return <Car size={24} />;
      if (name.includes('Gym')) return <Dumbbell size={24} />;
      if (name.includes('Lock')) return <Lock size={24} />;
      if (name.includes('Pet')) return <Dog size={24} />;
      return <Check size={24} />;
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* 1. Header & Title Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{listing.title}</h1>
                <div className="flex items-center gap-2 text-sm text-slate-600 underline font-medium cursor-pointer hover:text-slate-900">
                    <span>{listing.location.city}, {listing.location.state}, United States</span>
                </div>
            </div>
            <div className="flex gap-4">
                <button 
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        addToast("Link copied to clipboard", 'success');
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors"
                >
                    <Share size={16} /> <span className="hidden sm:inline">Share</span>
                </button>
                <button 
                    onClick={handleToggleSave}
                    className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${isSaved ? 'bg-rose-50 text-rose-600' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                    <Heart size={16} className={isSaved ? 'fill-rose-500 text-rose-500' : ''} /> 
                    <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
                </button>
            </div>
        </div> 

        {/* 2. Image Grid */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[300px] md:h-[480px] rounded-xl overflow-hidden relative mb-8">
            <div className="col-span-4 md:col-span-2 row-span-2 cursor-pointer hover:opacity-95 transition-opacity relative group" onClick={() => setShowGallery(true)}>
                <img src={galleryImages[0]} className="w-full h-full object-cover" alt="Main View" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
            </div>
            <div className="hidden md:block col-span-1 row-span-1 cursor-pointer hover:opacity-95 transition-opacity" onClick={() => setShowGallery(true)}>
                <img src={galleryImages[1]} className="w-full h-full object-cover" alt="Kitchen" />
            </div>
            <div className="hidden md:block col-span-1 row-span-1 cursor-pointer hover:opacity-95 transition-opacity" onClick={() => setShowGallery(true)}>
                <img src={galleryImages[2]} className="w-full h-full object-cover" alt="Bedroom" />
            </div>
            <div className="hidden md:block col-span-1 row-span-1 cursor-pointer hover:opacity-95 transition-opacity" onClick={() => setShowGallery(true)}>
                <img src={galleryImages[3]} className="w-full h-full object-cover" alt="Bathroom" />
            </div>
            <div className="hidden md:block col-span-1 row-span-1 cursor-pointer hover:opacity-95 transition-opacity relative" onClick={() => setShowGallery(true)}>
                <img src={galleryImages[4]} className="w-full h-full object-cover" alt="Living Area" />
                <button className="absolute bottom-4 right-4 bg-white border border-slate-900 text-slate-900 px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
                    <Grip size={14} /> Show all photos
                </button>
            </div>
        </div>

        {/* 3. Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-16">
            
            {/* LEFT COLUMN */}
            <div className="lg:w-2/3">
                
                {/* Host Info Row */}
                <div className="flex justify-between items-center pb-8 border-b border-slate-200">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Entire rental unit hosted by {MOCK_USER_LANDLORD.name.split(' ')[0]}</h2>
                        <ol className="flex items-center gap-1 text-slate-600 text-sm mt-1">
                            <li>{listing.details.bedrooms} bedroom</li>
                            <li>· {listing.details.bathrooms} bath</li>
                            <li>· {listing.details.sqft} sqft</li>
                            <li>· {listing.details.furnished ? 'Furnished' : 'Unfurnished'}</li>
                        </ol>
                    </div>
                    <div className="relative group cursor-pointer" onClick={() => setShowMessageModal(true)}>
                        <img src={MOCK_USER_LANDLORD.avatarUrl} alt="Host" className="w-14 h-14 rounded-full object-cover border border-slate-200" />
                        <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm border border-slate-100">
                            <ShieldCheck size={14} className="text-emerald-600" />
                        </div>
                    </div>
                </div>

                {/* Property Trust Banner (Interactive) */}
                <div className="py-8 border-b border-slate-200">
                    <div 
                        onClick={() => setShowTrustModal(true)}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex items-center justify-between shadow-sm relative overflow-hidden cursor-pointer hover:bg-slate-100 transition-colors group"
                    >
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold text-slate-900">Protocol Verified Property</h3>
                                {isFullyVerified && <Star size={16} className="text-emerald-500 fill-emerald-500" />}
                            </div>
                            <p className="text-sm text-slate-600 max-w-md group-hover:text-slate-800">
                                Click to view the full verification ledger and trust details.
                            </p>
                        </div>
                        <div className="text-center px-6 border-l border-slate-200">
                            <div className="text-2xl font-bold text-emerald-700">{verifiedCount}.0</div>
                            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Trust Score</div>
                        </div>
                        <div className="text-center px-6 border-l border-slate-200 hidden sm:block">
                            <div className="text-2xl font-bold text-slate-900">{totalChecks}</div>
                            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Checks Passed</div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="py-8 border-b border-slate-200">
                    <p className="text-slate-900 leading-relaxed whitespace-pre-line">
                        {listing.description || `Modern, luxurious, and aesthetic ${listing.title} in the heart of ${listing.location.city}. 
                        Designed for mid-term professionals, this space offers high-speed fiber internet, 
                        ergonomic workspaces, and is fully compliant with the Lagedra Trust Protocol.`}
                    </p>
                    <button className="mt-4 flex items-center gap-1 font-semibold underline text-slate-900">
                        Show more <ChevronDown size={16} />
                    </button>
                </div>

                {/* Amenities */}
                <div className="py-8 border-b border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">What this place offers</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {listing.amenities.map(amenity => (
                            <div key={amenity} className="flex items-center gap-3 text-slate-700">
                                {getAmenityIcon(amenity)}
                                <span>{amenity}</span>
                            </div>
                        ))}
                    </div>
                    <button className="mt-6 border border-slate-900 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
                        Show all amenities
                    </button>
                </div>

                {/* Accessibility Features */}
                {listing.accessibility && listing.accessibility.length > 0 && (
                    <div className="py-8 border-b border-slate-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Accessibility features</h3>
                        <p className="text-sm text-slate-600 mb-4">This info was provided by the Host and verified by Lagedra Protocol.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {listing.accessibility.map((feature) => (
                                <div key={feature} className="flex items-center gap-3 text-slate-700">
                                    <Check size={20} className="text-slate-900" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Requirements / Things to Know */}
                <div className="py-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Protocol Requirements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h4 className="font-bold text-slate-900 mb-2">Financial</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li>Min Credit: {listing.requirements?.minCreditScore}+</li>
                                <li>Income: {listing.requirements?.incomeMultiplier}x Rent</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-2">House Rules</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex items-center gap-2">
                                    {listing.requirements?.petsAllowed ? <Check size={14} className="text-emerald-600" /> : <Ban size={14} className="text-red-500" />}
                                    {listing.requirements?.petsAllowed ? 'Pets allowed' : 'No pets'}
                                </li>
                                <li className="flex items-center gap-2">
                                    {listing.requirements?.smokingAllowed ? <Check size={14} className="text-emerald-600" /> : <Ban size={14} className="text-red-500" />}
                                    {listing.requirements?.smokingAllowed ? 'Smoking allowed' : 'No smoking'}
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-2">Cancellation</h4>
                            <p className="text-sm text-slate-600">Strict Protocol Policy. Full refund only within 48h of booking.</p>
                            <button className="text-sm font-bold underline mt-2">Read more</button>
                        </div>
                    </div>
                </div>

                {/* Inquiries Section for Tenant */}
                {currentRole === 'tenant' && (
                    <div className="py-8 border-t border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-slate-900">Have questions?</h3>
                            <button 
                                onClick={() => setInquiryModalOpen(true)}
                                className="text-sm font-medium border border-slate-900 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Contact Host
                            </button>
                        </div>
                        {myInquiries.length > 0 && (
                            <div className="space-y-4">
                                {myInquiries.map(inq => (
                                    <div key={inq.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold uppercase text-slate-500">{inq.topic}</span>
                                            <span className="text-xs text-slate-400">{new Date(inq.timestamp).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-slate-900 font-medium text-sm mb-3">"{inq.question}"</p>
                                        {inq.status === 'answered' ? (
                                            <div className="bg-white border border-emerald-100 p-3 rounded-lg text-sm">
                                                <div className="text-xs text-emerald-600 font-bold mb-1">Response:</div>
                                                <p className="text-slate-800">{inq.answer}</p>
                                            </div>
                                        ) : (
                                            <div className="text-xs text-slate-500 italic">Awaiting response...</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* RIGHT COLUMN - Sticky Booking Card */}
            <div className="lg:w-1/3 relative">
                <div className="sticky top-28">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <span className="text-2xl font-bold text-slate-900">${listing.priceDisplay}</span>
                                <span className="text-slate-500"> month</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-bold text-slate-500 underline decoration-slate-300 decoration-dotted cursor-help">Protocol Active</span>
                            </div>
                        </div>

                        <div className="border border-slate-300 rounded-lg mb-4">
                            <div className="grid grid-cols-2 border-b border-slate-300">
                                <div className="p-3 border-r border-slate-300">
                                    <div className="text-[10px] font-bold uppercase text-slate-800">Move-In</div>
                                    <div className="text-sm text-slate-600">Add date</div>
                                </div>
                                <div className="p-3">
                                    <div className="text-[10px] font-bold uppercase text-slate-800">Move-Out</div>
                                    <div className="text-sm text-slate-600">Add date</div>
                                </div>
                            </div>
                            <div className="p-3">
                                <div className="text-[10px] font-bold uppercase text-slate-800">Risk Profile</div>
                                <div className="flex items-center justify-between">
                                    <VerificationBadge vClass={tenantRisk} showLabel={true} className="border-0 bg-transparent p-0" />
                                    {tenantRisk === 'Low Risk' && <span className="text-xs text-emerald-600 font-bold">-20% Deposit</span>}
                                </div>
                            </div>
                        </div>

                        {currentRole === 'tenant' ? (
                            <button 
                                onClick={() => setShowWizard(true)}
                                className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold py-3.5 rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all shadow-md active:scale-[0.98]"
                            >
                                Start Protocol Application
                            </button>
                        ) : (
                            <div className="bg-slate-100 text-slate-500 text-sm p-3 rounded-lg text-center">
                                Log in as Tenant to Apply
                            </div>
                        )}

                        <div className="text-center text-sm text-slate-500 mt-3 mb-6">
                            You won't be charged yet
                        </div>

                        <div className="space-y-3 text-sm text-slate-600">
                            <div className="flex justify-between underline decoration-slate-200 decoration-dotted">
                                <span>Monthly Rent</span>
                                <span>${listing.priceDisplay.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between underline decoration-slate-200 decoration-dotted">
                                <span>Protocol Fee</span>
                                <span className="text-emerald-600 font-medium">Covered by Host</span>
                            </div>
                            <div className="flex justify-between underline decoration-slate-200 decoration-dotted">
                                <span>Security Deposit</span>
                                <span>${depositAmt.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 mt-6 pt-4 flex justify-between font-bold text-slate-900 text-lg">
                            <span>Total due at move-in</span>
                            <span>${(listing.priceDisplay + depositAmt).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-sm">
                        <Flag size={14} /> 
                        <span className="underline cursor-pointer">Report this listing</span>
                    </div>
                </div>
            </div>

        </div>
      </div>

      {/* Gallery Modal */}
      {showGallery && (
          <div className="fixed inset-0 bg-white z-[70] overflow-y-auto animate-in fade-in zoom-in duration-300">
              <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white/90 backdrop-blur-sm">
                  <button onClick={() => setShowGallery(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                      <ChevronDown size={24} className="rotate-90 md:rotate-0" /> {/* Mobile back vs Desktop close */}
                  </button>
                  <div className="flex gap-4">
                      <button className="p-2 hover:bg-slate-100 rounded-full"><Share size={20} /></button>
                      <button className="p-2 hover:bg-slate-100 rounded-full"><Heart size={20} /></button>
                  </div>
              </div>
              <div className="max-w-5xl mx-auto p-4 pb-20 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {galleryImages.map((src, index) => (
                      <div key={index} className={`relative ${index % 3 === 0 ? 'md:col-span-2 aspect-video' : 'aspect-square'}`}>
                          <img src={src} className="w-full h-full object-cover rounded-xl shadow-sm hover:opacity-95 transition-opacity cursor-zoom-in" alt={`Gallery ${index}`} />
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Trust Details Modal */}
      {showTrustModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in duration-200">
                  <div className="bg-slate-50 border-b border-slate-200 p-5 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                          <ShieldCheck className="text-emerald-600" /> Protocol Verification
                      </h3>
                      <button onClick={() => setShowTrustModal(false)} className="text-slate-400 hover:text-slate-600">
                          <X size={20} />
                      </button>
                  </div>
                  <div className="p-6">
                      <div className="text-center mb-6">
                          <div className="text-4xl font-bold text-slate-900 mb-1">{verifiedCount}/5</div>
                          <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">Checks Passed</div>
                      </div>
                      
                      <div className="space-y-4">
                          <div className={`flex items-start gap-4 p-4 rounded-lg border ${vStatus.photoMatch ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                              <MapPin size={20} className={vStatus.photoMatch ? 'text-emerald-600' : 'text-slate-400'} />
                              <div>
                                  <h4 className="font-bold text-slate-900 text-sm">Location Verified (GPS)</h4>
                                  <p className="text-xs text-slate-600 mt-1">
                                      {vStatus.photoMatch ? 'GPS metadata from on-site photos matches property bounds (±3m).' : 'Pending verification.'}
                                  </p>
                              </div>
                              {vStatus.photoMatch && <Check size={16} className="text-emerald-600 shrink-0 ml-auto" />}
                          </div>

                          <div className={`flex items-start gap-4 p-4 rounded-lg border ${vStatus.documents ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                              <FileText size={20} className={vStatus.documents ? 'text-emerald-600' : 'text-slate-400'} />
                              <div>
                                  <h4 className="font-bold text-slate-900 text-sm">Ownership Documents</h4>
                                  <p className="text-xs text-slate-600 mt-1">
                                      {vStatus.documents ? 'Deed and utility bill OCR matched to Host identity.' : 'Pending verification.'}
                                  </p>
                              </div>
                              {vStatus.documents && <Check size={16} className="text-emerald-600 shrink-0 ml-auto" />}
                          </div>

                          <div className={`flex items-start gap-4 p-4 rounded-lg border ${vStatus.videoTour ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                              <Video size={20} className={vStatus.videoTour ? 'text-emerald-600' : 'text-slate-400'} />
                              <div>
                                  <h4 className="font-bold text-slate-900 text-sm">Structured Video Tour</h4>
                                  <p className="text-xs text-slate-600 mt-1">
                                      {vStatus.videoTour ? 'Continuous video walk-through validated against floor plan.' : 'Pending verification.'}
                                  </p>
                              </div>
                              {vStatus.videoTour && <Check size={16} className="text-emerald-600 shrink-0 ml-auto" />}
                          </div>

                          <div className={`flex items-start gap-4 p-4 rounded-lg border ${vStatus.mailCode ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                              <Mail size={20} className={vStatus.mailCode ? 'text-emerald-600' : 'text-slate-400'} />
                              <div>
                                  <h4 className="font-bold text-slate-900 text-sm">Physical Mail Check</h4>
                                  <p className="text-xs text-slate-600 mt-1">
                                      {vStatus.mailCode ? 'Physical access confirmed via mailed PIN code.' : 'Pending verification.'}
                                  </p>
                              </div>
                              {vStatus.mailCode && <Check size={16} className="text-emerald-600 shrink-0 ml-auto" />}
                          </div>
                      </div>

                      <div className="mt-6 bg-slate-50 rounded-lg p-4 text-xs text-slate-500 text-center">
                          Lagedra Protocol guarantees these checks were performed by a neutral node.
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
          <MessageModal 
            recipientName={MOCK_USER_LANDLORD.name} 
            listingTitle={listing.title} 
            onClose={() => setShowMessageModal(false)} 
          />
      )}

      {/* Inquire Modal */}
      {inquiryModalOpen && currentRole === 'tenant' && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                          <MessageSquare size={20} className="text-slate-700" /> Structured Inquiry
                      </h3>
                      <button onClick={() => setInquiryModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                      Select a category to request binding clarification. The landlord's response will be logged.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                      {['Internet Speed Test', 'Noise / Quiet Hours', 'Parking Specifics', 'Accessibility / Elevators'].map(topic => (
                          <button 
                            key={topic}
                            onClick={() => setSelectedInquiryTopic(topic)}
                            className={`w-full text-left px-4 py-3 rounded-lg border flex justify-between items-center transition-colors ${selectedInquiryTopic === topic ? 'border-rose-500 bg-rose-50 text-rose-700 font-medium' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                          >
                              {topic}
                              {selectedInquiryTopic === topic && <Check size={16} />}
                          </button>
                      ))}
                  </div>

                  {selectedInquiryTopic && (
                      <div className="mb-6 animate-in slide-in-from-top-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Specific Question</label>
                          <textarea 
                             className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:border-rose-500"
                             rows={3}
                             placeholder={`e.g. Please confirm the exact Mbps for upload speed...`}
                             value={customQuestion}
                             onChange={(e) => setCustomQuestion(e.target.value)}
                          ></textarea>
                      </div>
                  )}

                  <button 
                    disabled={!selectedInquiryTopic || !customQuestion}
                    className="w-full bg-rose-600 disabled:bg-slate-300 text-white py-3 rounded-lg font-medium transition-colors"
                    onClick={handleSend}
                  >
                      Send Structured Request
                  </button>
              </div>
          </div>
      )}

      {showWizard && (
        <ApplicationWizard 
          listing={listing} 
          onClose={() => setShowWizard(false)}
          onComplete={() => {
            setShowWizard(false);
            onNavigate('tenant');
            addToast("Application submitted successfully!", 'success');
          }}
        />
      )}
    </div>
  );
};

export default ListingDetails;
