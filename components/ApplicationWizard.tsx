import React, { useState } from 'react';
import { Listing } from '../types';
import { CheckCircle2, ShieldCheck, Calendar, ChevronRight, X, Loader2, Lock, UserCheck, FileSignature, Send } from 'lucide-react';

interface Props {
  listing: Listing;
  onClose: () => void;
  onComplete: () => void;
}

const ApplicationWizard: React.FC<Props> = ({ listing, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Mock State
  const [startDate, setStartDate] = useState('2024-11-01');
  const [endDate, setEndDate] = useState('2024-02-01');
  const [idVerified, setIdVerified] = useState(false);
  const [insuranceVerified, setInsuranceVerified] = useState(false);

  const handleNext = () => {
    if (step === 2 && (!idVerified || !insuranceVerified)) {
      alert("Please complete verification steps to proceed.");
      return;
    }
    setStep(step + 1);
  };

  const handleSubmitApplication = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(4);
    }, 2000);
  };

  const totalMonths = 3;
  const rentTotal = listing.priceDisplay * totalMonths;
  const deposit = listing.depositGuidance.recommended;
  const totalDue = rentTotal + deposit;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 text-white p-1 rounded">
               <ShieldCheck size={16} />
            </div>
            <span className="font-bold text-slate-900">Protocol Application</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex border-b border-slate-100">
           {[1, 2, 3, 4].map(s => (
             <div 
               key={s} 
               className={`flex-1 h-1 ${s <= step ? 'bg-emerald-500' : 'bg-slate-100'}`}
             ></div>
           ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Itinerary & Pricing</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-xs font-semibold text-slate-500 uppercase">Start Date</label>
                   <div className="relative">
                      <Calendar className="absolute left-3 top-3 text-slate-400" size={16} />
                      <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 font-medium text-slate-700"
                      />
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-semibold text-slate-500 uppercase">End Date</label>
                   <div className="relative">
                      <Calendar className="absolute left-3 top-3 text-slate-400" size={16} />
                      <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 font-medium text-slate-700"
                      />
                   </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 space-y-3">
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-600">${listing.priceDisplay} x {totalMonths} months</span>
                    <span className="font-medium">${rentTotal.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Protocol Fee</span>
                    <span className="font-medium text-emerald-600">Covered by Host</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Security Deposit (Due upon Move-In)</span>
                    <span className="font-medium">${deposit.toLocaleString()}</span>
                 </div>
                 <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                    <span className="font-bold text-slate-900">Total Contract Value</span>
                    <span className="font-bold text-xl text-slate-900">${totalDue.toLocaleString()}</span>
                 </div>
                 <div className="text-xs text-slate-400 text-center pt-2">
                    * No payment required today. Host will activate protocol upon approval.
                 </div>
              </div>
            </div>
          )}

          {step === 2 && (
             <div className="space-y-6">
               <h2 className="text-2xl font-bold text-slate-900">Risk Verification</h2>
               <p className="text-slate-600 text-sm">Lagedra uses zero-knowledge proofs to verify your risk class without exposing sensitive personal data to the landlord.</p>

               <div className="space-y-4">
                  <div className={`p-4 border rounded-lg flex items-center justify-between transition-all ${idVerified ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                              <UserCheck size={20} />
                          </div>
                          <div>
                              <div className="font-semibold text-slate-900">Identity Verification</div>
                              <div className="text-xs text-slate-500">Government ID + Biometric Scan</div>
                          </div>
                      </div>
                      <button 
                        onClick={() => { setIsProcessing(true); setTimeout(() => { setIdVerified(true); setIsProcessing(false); }, 1500); }}
                        disabled={idVerified || isProcessing}
                        className={`px-4 py-2 rounded text-sm font-medium ${idVerified ? 'text-emerald-700 bg-transparent' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                      >
                         {idVerified ? 'Verified' : (isProcessing ? <Loader2 className="animate-spin" size={16} /> : 'Connect ID')}
                      </button>
                  </div>

                  <div className={`p-4 border rounded-lg flex items-center justify-between transition-all ${insuranceVerified ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${insuranceVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                              <ShieldCheck size={20} />
                          </div>
                          <div>
                              <div className="font-semibold text-slate-900">Liability Insurance</div>
                              <div className="text-xs text-slate-500">Connect carrier or upload policy</div>
                          </div>
                      </div>
                      <button 
                         onClick={() => { setIsProcessing(true); setTimeout(() => { setInsuranceVerified(true); setIsProcessing(false); }, 1500); }}
                         disabled={insuranceVerified || isProcessing}
                         className={`px-4 py-2 rounded text-sm font-medium ${insuranceVerified ? 'text-emerald-700 bg-transparent' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                      >
                         {insuranceVerified ? 'Verified' : (isProcessing ? <Loader2 className="animate-spin" size={16} /> : 'Verify')}
                      </button>
                  </div>
               </div>
             </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Review & Sign</h2>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                        <FileSignature size={18} /> Truth Surface Agreement
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">
                        By proceeding, you cryptographically sign the Truth Surface snapshot.
                        This serves as your binding application. The Host must countersign and pay the activation fee to finalize the deal.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-600 bg-white p-2 rounded border border-slate-200 font-mono">
                        <Lock size={12} />
                        Hash: 0x8f2d...3a1b
                    </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        <Send size={24} className="ml-1" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Ready to Submit?</h3>
                    <p className="text-sm text-slate-600 max-w-sm mt-2">
                        No payment is required from you at this stage. Once you sign, the landlord will review your risk class and application details.
                    </p>
                </div>
            </div>
          )}

          {step === 4 && (
             <div className="text-center py-8">
                 <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                     <CheckCircle2 size={40} />
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted</h2>
                 <p className="text-slate-600 max-w-md mx-auto mb-8">
                     Your signed application has been sent to the host. You will be notified when they pay the activation fee and countersign.
                 </p>
                 <button 
                    onClick={onComplete}
                    className="bg-slate-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
                >
                    Return to Dashboard <ChevronRight size={16} />
                 </button>
             </div>
          )}

        </div>

        {/* Footer Actions */}
        {step < 4 && (
          <div className="p-4 border-t border-slate-200 flex justify-between bg-slate-50">
             <div className="text-sm font-medium text-slate-500 flex items-center">
                Step {step} of 3
             </div>
             <div className="flex gap-3">
                 {step > 1 && (
                     <button 
                       onClick={() => setStep(step - 1)}
                       className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
                     >
                       Back
                     </button>
                 )}
                 {step < 3 ? (
                     <button 
                       onClick={handleNext}
                       className="bg-slate-900 text-white px-6 py-2 rounded font-medium hover:bg-slate-800 flex items-center gap-2"
                     >
                       Next Step <ChevronRight size={16} />
                     </button>
                 ) : (
                     <button 
                       onClick={handleSubmitApplication}
                       disabled={isProcessing}
                       className="bg-slate-900 text-white px-6 py-2 rounded font-medium hover:bg-slate-800 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                     >
                       {isProcessing ? <Loader2 className="animate-spin" size={16} /> : 'Sign & Submit Application'}
                     </button>
                 )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationWizard;