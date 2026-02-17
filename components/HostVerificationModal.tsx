
import React, { useState } from 'react';
import { ShieldCheck, User, Building, MapPin, Camera, X, Check, Loader2, ScanFace, FileText } from 'lucide-react';
import { HostVerificationStatus } from '../types';

interface Props {
  onClose: () => void;
  status: HostVerificationStatus;
}

const HostVerificationModal: React.FC<Props> = ({ onClose, status }) => {
  const [activeStep, setActiveStep] = useState<'id' | 'liveness' | 'business' | 'address'>('id');
  const [loading, setLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState(status);

  const simulateVerify = (key: keyof HostVerificationStatus) => {
    setLoading(true);
    setTimeout(() => {
      setLocalStatus(prev => ({ ...prev, [key]: true }));
      setLoading(false);
    }, 2000);
  };

  const steps = [
    { id: 'id', label: 'Govt. ID', icon: User, done: localStatus.govtId },
    { id: 'liveness', label: 'Liveness', icon: ScanFace, done: localStatus.liveness },
    { id: 'business', label: 'Business KYC', icon: Building, done: localStatus.businessKyc },
    { id: 'address', label: 'Home Address', icon: MapPin, done: localStatus.homeAddress },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="text-blue-600" /> Host Identity Verification
            </h2>
            <p className="text-sm text-slate-500">KYC/KYB compliance ensures network trust.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b border-slate-100 bg-white">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id as any)}
              className={`flex-1 py-4 text-sm font-medium flex flex-col items-center gap-1 border-b-2 transition-colors ${
                activeStep === step.id 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="relative">
                <step.icon size={20} />
                {step.done && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              {step.label}
            </button>
          ))}
        </div>

        <div className="p-8 overflow-y-auto flex-1">
          {activeStep === 'id' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3">
                <User className="text-blue-600 shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900">Government ID Verification</h3>
                  <p className="text-sm text-blue-700">Upload a clear photo of your driver's license or passport. Matches strictly against profile name.</p>
                </div>
              </div>
              
              <div className="border-2 border-dashed border-slate-300 rounded-xl h-48 flex flex-col items-center justify-center text-slate-400 gap-2 hover:bg-slate-50 cursor-pointer transition-colors">
                <Camera size={32} />
                <span className="font-medium">Upload Front of ID</span>
              </div>

              {localStatus.govtId ? (
                <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 p-3 rounded justify-center">
                  <Check size={20} /> Identity Verified
                </div>
              ) : (
                <button 
                  onClick={() => simulateVerify('govtId')}
                  disabled={loading}
                  className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Process ID'}
                </button>
              )}
            </div>
          )}

          {activeStep === 'liveness' && (
            <div className="space-y-6">
               <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 flex gap-3">
                <ScanFace className="text-purple-600 shrink-0" />
                <div>
                  <h3 className="font-semibold text-purple-900">Biometric Liveness Check</h3>
                  <p className="text-sm text-purple-700">Ensure you are a real person present right now. You will be asked to move your head.</p>
                </div>
              </div>

              <div className="bg-black rounded-xl h-64 relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 border-4 border-slate-500/50 rounded-full m-8"></div>
                 <div className="text-white/50 flex flex-col items-center">
                    <Camera size={48} className="mb-2" />
                    <span>Camera Preview</span>
                 </div>
              </div>

              {localStatus.liveness ? (
                <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 p-3 rounded justify-center">
                  <Check size={20} /> Biometrics Confirmed
                </div>
              ) : (
                 <button 
                  onClick={() => simulateVerify('liveness')}
                  disabled={loading}
                  className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Start Liveness Scan'}
                </button>
              )}
            </div>
          )}

          {activeStep === 'business' && (
             <div className="space-y-6">
               <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex gap-3">
                <Building className="text-amber-600 shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-900">Business KYC</h3>
                  <p className="text-sm text-amber-700">Required for LLCs. Verify beneficial owners (25%+ equity) and registration status.</p>
                </div>
              </div>

              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Legal Business Name</label>
                    <input type="text" className="w-full border border-slate-300 rounded p-2" placeholder="e.g. Urban Properties LLC" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">EIN / Tax ID</label>
                    <input type="text" className="w-full border border-slate-300 rounded p-2" placeholder="12-3456789" />
                 </div>
                 <div className="p-4 bg-slate-50 border border-slate-200 rounded text-sm text-slate-600">
                    <h4 className="font-bold text-slate-800 mb-2">Required Documents</h4>
                    <ul className="list-disc pl-4 space-y-1">
                        <li>Articles of Organization</li>
                        <li>Beneficial Ownership Info (BOI)</li>
                        <li>Certificate of Good Standing</li>
                    </ul>
                 </div>
              </div>

              {localStatus.businessKyc ? (
                <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 p-3 rounded justify-center">
                  <Check size={20} /> Entity Verified
                </div>
              ) : (
                 <button 
                  onClick={() => simulateVerify('businessKyc')}
                  disabled={loading}
                  className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Submit for Review'}
                </button>
              )}
            </div>
          )}

          {activeStep === 'address' && (
             <div className="space-y-6">
               <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex gap-3">
                <MapPin className="text-slate-600 shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900">Personal Address Trace</h3>
                  <p className="text-sm text-slate-600">Used for identity resolution only. Not shared on public listings.</p>
                </div>
              </div>

              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Home Address</label>
                    <input type="text" className="w-full border border-slate-300 rounded p-2" placeholder="Street Address" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                        <input type="text" className="w-full border border-slate-300 rounded p-2" placeholder="City" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Zip</label>
                        <input type="text" className="w-full border border-slate-300 rounded p-2" placeholder="Zip Code" />
                    </div>
                 </div>
              </div>

              {localStatus.homeAddress ? (
                <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 p-3 rounded justify-center">
                  <Check size={20} /> Address Traced
                </div>
              ) : (
                 <button 
                  onClick={() => simulateVerify('homeAddress')}
                  disabled={loading}
                  className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Verify Address'}
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default HostVerificationModal;
