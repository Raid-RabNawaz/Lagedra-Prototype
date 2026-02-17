import React, { useState } from 'react';
import { Camera, Video, FileText, Mail, Map, X, Check, Loader2, RefreshCw } from 'lucide-react';
import { Listing, PropertyVerificationStatus } from '../types';

interface Props {
  listing: Listing;
  onClose: () => void;
  status?: PropertyVerificationStatus;
}

const PropertyVerificationModal: React.FC<Props> = ({ listing, onClose, status }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [videoCode] = useState(Math.random().toString(36).substring(2, 8).toUpperCase());
  const [mailPin, setMailPin] = useState('');
  
  // Default empty state if status is undefined
  const [localStatus, setLocalStatus] = useState<PropertyVerificationStatus>(status || {
    photoMatch: false,
    videoTour: false,
    documents: false,
    mailCode: false,
    gpsMatch: false
  });

  const steps = [
    { title: 'GPS & Photo Match', icon: Map, key: 'photoMatch' },
    { title: 'Structured Video', icon: Video, key: 'videoTour' },
    { title: 'Doc Upload (OCR)', icon: FileText, key: 'documents' },
    { title: 'Physical Mail', icon: Mail, key: 'mailCode' }
  ];

  const handleVerify = (key: keyof PropertyVerificationStatus) => {
    setLoading(true);
    setTimeout(() => {
        setLocalStatus(prev => ({ ...prev, [key]: true }));
        setLoading(false);
    }, 2000);
  };

  const renderStepContent = () => {
    switch(activeStep) {
        case 0:
            return (
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900">On-Site GPS & Photo Analysis</h3>
                    <p className="text-sm text-slate-600">
                        Capture a new photo of the property exterior while on-site. We verify the embedded GPS metadata matches the listing coordinates and use AI to match the building structure.
                    </p>
                    
                    {localStatus.photoMatch ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 flex flex-col items-center text-center animate-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-3">
                                <Check size={32} />
                            </div>
                            <h4 className="font-bold text-emerald-900 mb-1">Photo Analyzed & Verified</h4>
                            <p className="text-sm text-emerald-700">
                                GPS metadata matches property bounds (±3m).<br/>
                                Structure match confidence: <span className="font-mono font-bold">98.2%</span>
                            </p>
                        </div>
                    ) : (
                        <div className="bg-slate-100 rounded-lg p-6 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 transition-colors hover:bg-slate-50 cursor-pointer">
                            <Camera size={40} className="text-slate-400 mb-2" />
                            <span className="text-sm font-medium text-slate-500">Enable Location Services & Take Photo</span>
                        </div>
                    )}

                    {!localStatus.photoMatch && (
                        <div className="bg-blue-50 p-4 rounded border border-blue-100 text-xs text-blue-800">
                            <strong>Note:</strong> Photos must be taken within 50 meters of {listing.location.city}.
                        </div>
                    )}

                    <button 
                        onClick={() => handleVerify('photoMatch')}
                        disabled={localStatus.photoMatch || loading}
                        className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:bg-emerald-600 disabled:opacity-100 flex items-center justify-center gap-2 transition-all"
                    >
                        {localStatus.photoMatch ? <><Check size={18} /> Verified On-Site</> : (loading ? <Loader2 className="animate-spin" /> : 'Capture & Verify')}
                    </button>
                </div>
            );
        case 1:
            return (
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900">Structured Video Tour</h3>
                    <p className="text-sm text-slate-600">
                        Record a continuous video walking from the street to the interior. You must audibly state or visually show the unique code below to prevent stock footage usage.
                    </p>

                    <div className="bg-slate-900 text-white p-6 rounded-lg text-center">
                        <div className="text-xs uppercase tracking-widest opacity-70 mb-2">Today's Unique Code</div>
                        <div className="text-4xl font-mono font-bold tracking-wider">{videoCode}</div>
                    </div>

                    <div className="border border-slate-200 rounded p-4">
                        <div className="text-xs font-bold text-slate-700 uppercase mb-2">Required Shot List</div>
                        <ul className="text-sm text-slate-600 space-y-2">
                            <li className="flex gap-2"><Check size={16} className="text-slate-300" /> Street view showing house number</li>
                            <li className="flex gap-2"><Check size={16} className="text-slate-300" /> Unlocking front door</li>
                            <li className="flex gap-2"><Check size={16} className="text-slate-300" /> Kitchen and main living area</li>
                        </ul>
                    </div>

                    <button 
                        onClick={() => handleVerify('videoTour')}
                        disabled={localStatus.videoTour || loading}
                        className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:bg-emerald-600 disabled:opacity-100 flex items-center justify-center gap-2"
                    >
                         {localStatus.videoTour ? <><Check size={18} /> Video Verified</> : (loading ? <Loader2 className="animate-spin" /> : 'Upload Video Evidence')}
                    </button>
                </div>
            );
        case 2:
            return (
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900">Ownership Documentation (OCR)</h3>
                    <p className="text-sm text-slate-600">
                        Upload a utility bill, deed, or mortgage statement. Our OCR engine extracts the address and name to match your host profile.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="border border-slate-200 rounded p-4 text-center hover:bg-slate-50 cursor-pointer">
                            <FileText size={24} className="mx-auto text-slate-400 mb-2" />
                            <div className="text-sm font-medium">Utility Bill</div>
                            <div className="text-xs text-slate-400">Gas, Water, Electric</div>
                        </div>
                        <div className="border border-slate-200 rounded p-4 text-center hover:bg-slate-50 cursor-pointer">
                            <FileText size={24} className="mx-auto text-slate-400 mb-2" />
                            <div className="text-sm font-medium">Property Tax</div>
                            <div className="text-xs text-slate-400">Recent Statement</div>
                        </div>
                    </div>

                    <button 
                        onClick={() => handleVerify('documents')}
                        disabled={localStatus.documents || loading}
                        className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:bg-emerald-600 disabled:opacity-100 flex items-center justify-center gap-2"
                    >
                         {localStatus.documents ? <><Check size={18} /> Documents Approved</> : (loading ? <Loader2 className="animate-spin" /> : 'Analyze Documents')}
                    </button>
                </div>
            );
        case 3:
            return (
                 <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900">Physical Mail Verification</h3>
                    <p className="text-sm text-slate-600">
                        We will mail a postcard with a 6-digit PIN to the property address. Enter it here to prove you have physical access to the mailbox.
                    </p>

                    <div className="bg-amber-50 p-4 rounded border border-amber-100 flex gap-3">
                        <Mail className="text-amber-600 shrink-0" />
                        <div className="text-sm text-amber-800">
                            <strong>Status:</strong> Mail sent to {listing.location.city}, {listing.location.zip}. Expected delivery: 3-5 days.
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Enter 6-Digit PIN</label>
                        <input 
                            type="text" 
                            className="w-full border border-slate-300 rounded p-3 text-center tracking-[0.5em] font-mono font-bold text-lg" 
                            placeholder="000000"
                            maxLength={6}
                            value={mailPin}
                            onChange={(e) => setMailPin(e.target.value.replace(/[^0-9]/g, ''))}
                        />
                    </div>

                    <button 
                        onClick={() => handleVerify('mailCode')}
                        disabled={localStatus.mailCode || loading || mailPin.length !== 6}
                        className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:bg-emerald-600 disabled:opacity-100 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                    >
                         {localStatus.mailCode ? <><Check size={18} /> Address Confirmed</> : (loading ? <Loader2 className="animate-spin" /> : 'Verify PIN')}
                    </button>
                </div>
            );
        default:
            return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Verify Property</h2>
            <p className="text-sm text-slate-500 truncate max-w-md">{listing.title}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <div className="flex h-full min-h-[400px]">
            {/* Sidebar Steps */}
            <div className="w-1/3 border-r border-slate-100 bg-slate-50 p-4 space-y-2">
                {steps.map((step, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveStep(idx)}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                            activeStep === idx ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'hover:bg-slate-100 text-slate-500'
                        }`}
                    >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            localStatus[step.key as keyof PropertyVerificationStatus] 
                                ? 'bg-emerald-100 text-emerald-600' 
                                : 'bg-slate-200 text-slate-500'
                        }`}>
                             {localStatus[step.key as keyof PropertyVerificationStatus] ? <Check size={12} /> : idx + 1}
                        </div>
                        <span className={`text-sm font-medium ${activeStep === idx ? 'text-slate-900' : 'text-slate-600'}`}>
                            {step.title}
                        </span>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="w-2/3 p-8">
                {renderStepContent()}
            </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyVerificationModal;