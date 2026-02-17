
import React, { useState } from 'react';
import { UserCheck, Briefcase, FileSearch, X, Check, Loader2, ScanFace, Building2, ShieldCheck, ChevronRight } from 'lucide-react';
import { TenantVerificationStatus } from '../types';

interface Props {
  onClose: () => void;
  status: TenantVerificationStatus;
}

const TenantVerificationModal: React.FC<Props> = ({ onClose, status }) => {
  const [activeStep, setActiveStep] = useState<'identity' | 'income' | 'background'>('identity');
  const [loading, setLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState(status);

  const simulateVerify = (key: keyof TenantVerificationStatus) => {
    setLoading(true);
    setTimeout(() => {
      setLocalStatus(prev => ({ ...prev, [key]: true }));
      setLoading(false);
    }, 2000);
  };

  const steps = [
    { id: 'identity', label: 'Identity', icon: UserCheck, done: localStatus.identity },
    { id: 'income', label: 'Income & Employment', icon: Briefcase, done: localStatus.income },
    { id: 'background', label: 'Background', icon: FileSearch, done: localStatus.background },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="text-emerald-600" /> Tenant Verification
            </h2>
            <p className="text-sm text-slate-500">Achieve "Low Risk" class to reduce deposit requirements.</p>
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
                  ? 'border-emerald-600 text-emerald-600' 
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
          {activeStep === 'identity' && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 flex gap-3">
                <ScanFace className="text-emerald-600 shrink-0" />
                <div>
                  <h3 className="font-semibold text-emerald-900">Zero-Knowledge Identity</h3>
                  <p className="text-sm text-emerald-700">We verify your government ID and liveness without storing your raw documents. Only the verified result is shared.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-lg p-6 text-center hover:bg-slate-50 cursor-pointer">
                      <UserCheck className="mx-auto text-slate-400 mb-3" size={32} />
                      <div className="font-medium text-slate-900">Scan ID Document</div>
                      <div className="text-xs text-slate-500 mt-1">Passport / Driver's License</div>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-6 text-center hover:bg-slate-50 cursor-pointer">
                      <ScanFace className="mx-auto text-slate-400 mb-3" size={32} />
                      <div className="font-medium text-slate-900">Selfie Liveness</div>
                      <div className="text-xs text-slate-500 mt-1">Biometric Match</div>
                  </div>
              </div>

              {localStatus.identity ? (
                <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 p-3 rounded justify-center">
                  <Check size={20} /> Identity Verified
                </div>
              ) : (
                <button 
                  onClick={() => simulateVerify('identity')}
                  disabled={loading}
                  className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Start Verification'}
                </button>
              )}
            </div>
          )}

          {activeStep === 'income' && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
               <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3">
                <Building2 className="text-blue-600 shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900">Income & Employment</h3>
                  <p className="text-sm text-blue-700">Connect payroll providers or bank accounts securely. We verify stability and affordability.</p>
                </div>
              </div>

              <div className="space-y-4">
                 <button className="w-full border border-slate-300 rounded-lg p-4 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center font-bold text-slate-700">P</div>
                        <div className="text-left">
                            <div className="font-semibold text-slate-900">Connect via Plaid</div>
                            <div className="text-xs text-slate-500">Instant income verification</div>
                        </div>
                    </div>
                    <ChevronRight className="text-slate-400" />
                 </button>
                 
                 <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-slate-500">Or Manual Upload</span>
                    </div>
                 </div>

                 <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center text-slate-500 hover:bg-slate-50 cursor-pointer">
                    Click to upload Paystubs or Offer Letter (PDF)
                 </div>
              </div>

              {localStatus.income ? (
                <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 p-3 rounded justify-center">
                  <Check size={20} /> Income Verified
                </div>
              ) : (
                 <button 
                  onClick={() => simulateVerify('income')}
                  disabled={loading}
                  className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Verify Employment'}
                </button>
              )}
            </div>
          )}

          {activeStep === 'background' && (
             <div className="space-y-6 animate-in slide-in-from-right-4">
               <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex gap-3">
                <FileSearch className="text-amber-600 shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-900">Background Screening</h3>
                  <p className="text-sm text-amber-700">National criminal and eviction database search. Results are retained for 30 days.</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                 <h4 className="font-bold text-slate-900 text-sm mb-2">Review Authorization</h4>
                 <p className="text-xs text-slate-500 mb-4">
                    By clicking "Run Check", you authorize Lagedra Protocol to request a background report from Checkr, Inc. 
                    You have the right to request a free copy of this report.
                 </p>
                 <div className="flex items-center gap-2 text-sm text-slate-700">
                     <input type="checkbox" className="rounded border-slate-300" id="auth" />
                     <label htmlFor="auth">I agree to the Fair Credit Reporting Act (FCRA) terms.</label>
                 </div>
              </div>

              {localStatus.background ? (
                <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 p-3 rounded justify-center">
                  <Check size={20} /> Screening Complete
                </div>
              ) : (
                 <button 
                  onClick={() => simulateVerify('background')}
                  disabled={loading}
                  className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Run Background Check'}
                </button>
              )}
            </div>
          )}

        </div>
        
        {/* Footer Nav */}
        <div className="p-4 border-t border-slate-100 flex justify-between bg-slate-50">
             <button 
                onClick={onClose}
                className="px-4 py-2 text-slate-600 font-medium hover:text-slate-900"
             >
                 Cancel
             </button>
             <div className="flex gap-2">
                 {activeStep !== 'identity' && (
                     <button onClick={() => setActiveStep(activeStep === 'background' ? 'income' : 'identity')} className="px-4 py-2 text-slate-600 border border-slate-300 rounded hover:bg-white">Back</button>
                 )}
                 {activeStep !== 'background' && (
                     <button onClick={() => setActiveStep(activeStep === 'identity' ? 'income' : 'background')} className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800">Next</button>
                 )}
                 {activeStep === 'background' && localStatus.background && (
                     <button onClick={onClose} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Complete</button>
                 )}
             </div>
        </div>
      </div>
    </div>
  );
};

export default TenantVerificationModal;
