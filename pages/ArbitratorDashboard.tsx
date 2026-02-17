
import React, { useState } from 'react';
import { MOCK_DISPUTE_DEAL, MOCK_USER_ARBITRATOR, MOCK_ARBITRATION_CASES } from '../constants';
import TruthSurface from '../components/TruthSurface';
import { Gavel, FileSearch, Scale, AlertOctagon, Download, Eye, History as HistoryIcon, Lock, CheckCircle2, ChevronRight, FileText, X, AlertTriangle, ArrowLeft, ArrowRight, Video, Image, StickyNote, DollarSign, FileSignature } from 'lucide-react';
import { ArbitrationCase, Ruling } from '../types';

const ArbitratorDashboard: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'truth' | 'ruling'>('overview');
  const [rulingStep, setRulingStep] = useState(1);
  const [finalRuling, setFinalRuling] = useState<Ruling | null>(null);
  
  // Ruling Wizard State
  const [draftRuling, setDraftRuling] = useState<Partial<Ruling>>({
    verdict: undefined,
    payoutToTenant: 0,
    payoutToLandlord: 0,
    rationale: '',
    ledgerImpact: 'No Impact'
  });

  const selectedCase = MOCK_ARBITRATION_CASES.find(c => c.id === selectedCaseId);
  const dealData = MOCK_DISPUTE_DEAL; // In real app, fetch deal by selectedCase.dealId

  const handleSelectCase = (id: string) => {
    setSelectedCaseId(id);
    setActiveTab('overview');
    setRulingStep(1);
    setFinalRuling(null);
    setDraftRuling({
        verdict: undefined,
        payoutToTenant: 0,
        payoutToLandlord: 0,
        rationale: '',
        ledgerImpact: 'No Impact'
    });
  };

  const calculatePayout = (sliderVal: number, total: number) => {
    // sliderVal is % to Tenant
    const tenantAmt = Math.floor((sliderVal / 100) * total);
    const landlordAmt = total - tenantAmt;
    setDraftRuling(prev => ({ ...prev, payoutToTenant: tenantAmt, payoutToLandlord: landlordAmt }));
  };

  const submitRuling = () => {
    if (!selectedCase) return;
    const ruling: Ruling = {
        caseId: selectedCase.id,
        verdict: draftRuling.verdict as any,
        payoutToTenant: draftRuling.payoutToTenant || 0,
        payoutToLandlord: draftRuling.payoutToLandlord || 0,
        rationale: draftRuling.rationale || '',
        ledgerImpact: draftRuling.ledgerImpact || '',
        timestamp: new Date().toISOString()
    };
    setFinalRuling(ruling);
    alert("Ruling signed with your Private Key and committed to the Trust Ledger.");
  };

  const getEvidenceIcon = (type: string) => {
      switch(type) {
          case 'Image': return <Image size={16} />;
          case 'Video': return <Video size={16} />;
          case 'Document': return <FileText size={16} />;
          default: return <StickyNote size={16} />;
      }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col">
       {/* Header */}
       <div className="flex items-center justify-between mb-6 shrink-0">
           <div className="flex items-center gap-4">
                <img src={MOCK_USER_ARBITRATOR.avatarUrl} className="w-12 h-12 rounded bg-slate-200" alt="Avatar" />
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Arbitration Console</h1>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Gavel size={14} /> Node: ARB-01</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="text-emerald-600 font-medium">Reputation: 99.8%</span>
                    </div>
                </div>
           </div>
           <div className="bg-amber-50 text-amber-800 px-4 py-2 rounded text-sm font-medium border border-amber-100 flex items-center gap-2">
                 <AlertOctagon size={16} /> 2 Open Cases
           </div>
       </div>

       <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
           {/* Sidebar: Case Queue */}
           <div className="col-span-12 lg:col-span-3 bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col shadow-sm">
               <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 text-sm uppercase tracking-wider">
                   Case Queue
               </div>
               <div className="overflow-y-auto flex-1 p-2 space-y-2">
                   {MOCK_ARBITRATION_CASES.map(c => (
                       <div 
                          key={c.id}
                          onClick={() => handleSelectCase(c.id)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all group ${selectedCaseId === c.id ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
                        >
                           <div className="flex justify-between items-start mb-2">
                               <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${selectedCaseId === c.id ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                                   #{c.id.split('_')[1]}
                               </span>
                               <span className={`text-[10px] font-bold uppercase ${
                                   c.status === 'Open' ? 'text-red-500' : 'text-amber-500'
                               }`}>
                                   {c.status}
                               </span>
                           </div>
                           <h4 className={`font-semibold text-sm mb-1 ${selectedCaseId === c.id ? 'text-white' : 'text-slate-900'}`}>{c.disputeType}</h4>
                           <div className={`text-xs flex justify-between items-center ${selectedCaseId === c.id ? 'text-slate-400' : 'text-slate-500'}`}>
                               <span>Escrow: ${c.escrowAmount}</span>
                               <span className="flex items-center gap-1"><HistoryIcon size={10} /> {c.deadline}</span>
                           </div>
                       </div>
                   ))}
               </div>
           </div>

           {/* Main Workspace */}
           <div className="col-span-12 lg:col-span-9 flex flex-col h-full min-h-0">
               {selectedCase ? (
                   <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col h-full overflow-hidden">
                       
                       {/* Workspace Header */}
                       <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-white shrink-0">
                           <div>
                               <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-xl font-bold text-slate-900">{selectedCase.disputeType}</h2>
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full font-mono">Case #{selectedCase.id}</span>
                               </div>
                               <div className="flex items-center gap-4 text-sm text-slate-500">
                                   <span className="flex items-center gap-1">Claimant: <span className="font-semibold text-slate-900">Tenant (T1)</span></span>
                                   <span className="flex items-center gap-1">Respondent: <span className="font-semibold text-slate-900">Landlord (L3)</span></span>
                                   <span className="flex items-center gap-1">Deal: <span className="font-mono text-slate-900">{selectedCase.dealId}</span></span>
                               </div>
                           </div>
                           <div className="flex gap-2">
                               <button 
                                  onClick={() => setActiveTab('overview')}
                                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                               >
                                   Overview
                               </button>
                               <button 
                                  onClick={() => setActiveTab('evidence')}
                                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'evidence' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                               >
                                   Evidence ({selectedCase.evidence.length})
                               </button>
                               <button 
                                  onClick={() => setActiveTab('truth')}
                                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'truth' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                               >
                                   Truth Surface
                               </button>
                               <button 
                                  onClick={() => setActiveTab('ruling')}
                                  className={`ml-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'ruling' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                               >
                                   <Gavel size={16} /> Adjudicate
                               </button>
                           </div>
                       </div>

                       {/* Workspace Content */}
                       <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
                           
                           {/* OVERVIEW TAB */}
                           {activeTab === 'overview' && (
                               <div className="grid grid-cols-2 gap-6 animate-in fade-in duration-300">
                                   <div className="col-span-2">
                                       <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex items-start gap-3">
                                            <AlertTriangle className="text-red-600 mt-0.5 shrink-0" />
                                            <div>
                                                <h3 className="font-bold text-red-900 text-sm uppercase mb-1">Claim Summary</h3>
                                                <p className="text-red-800 text-sm leading-relaxed">{selectedCase.claimSummary}</p>
                                            </div>
                                       </div>
                                   </div>
                                   
                                   <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                                       <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                           <Scale size={18} className="text-slate-400" /> Financial Stake
                                       </h3>
                                       <div className="flex items-center justify-between mb-2">
                                           <span className="text-sm text-slate-500">Escrow Balance</span>
                                           <span className="text-lg font-bold text-slate-900">${selectedCase.escrowAmount.toLocaleString()}</span>
                                       </div>
                                       <div className="w-full bg-slate-100 h-2 rounded-full mb-4">
                                           <div className="w-full h-full bg-slate-300 rounded-full"></div>
                                       </div>
                                       <div className="text-xs text-slate-500">Funds frozen since {selectedCase.createdDate}.</div>
                                   </div>

                                   <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                                       <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                           <HistoryIcon size={18} className="text-slate-400" /> Timeline
                                       </h3>
                                       <div className="space-y-4">
                                           <div className="flex gap-3">
                                               <div className="flex flex-col items-center">
                                                   <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                                   <div className="w-px h-full bg-slate-200 my-1"></div>
                                               </div>
                                               <div>
                                                   <div className="text-xs font-bold text-slate-900">Deal Started</div>
                                                   <div className="text-xs text-slate-500">Jan 15, 2024</div>
                                               </div>
                                           </div>
                                           <div className="flex gap-3">
                                               <div className="flex flex-col items-center">
                                                   <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                   <div className="w-px h-full bg-slate-200 my-1"></div>
                                               </div>
                                               <div>
                                                   <div className="text-xs font-bold text-red-600">Dispute Filed</div>
                                                   <div className="text-xs text-slate-500">{selectedCase.createdDate}</div>
                                               </div>
                                           </div>
                                            <div className="flex gap-3">
                                               <div className="flex flex-col items-center">
                                                   <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                                               </div>
                                               <div>
                                                   <div className="text-xs font-bold text-amber-600">Ruling Deadline</div>
                                                   <div className="text-xs text-slate-500">{selectedCase.deadline}</div>
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           )}

                           {/* EVIDENCE TAB */}
                           {activeTab === 'evidence' && (
                               <div className="space-y-6 animate-in fade-in duration-300">
                                   <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-slate-200">
                                       <div className="flex gap-4 text-sm">
                                           <div className="flex items-center gap-2">
                                               <span className="w-3 h-3 rounded-full bg-blue-500"></span> Tenant Submitted
                                           </div>
                                           <div className="flex items-center gap-2">
                                               <span className="w-3 h-3 rounded-full bg-purple-500"></span> Landlord Submitted
                                           </div>
                                       </div>
                                       <button className="text-xs font-medium text-slate-500 flex items-center gap-1 hover:text-slate-900">
                                           <Download size={14} /> Download Full Manifest (ZIP)
                                       </button>
                                   </div>

                                   <div className="grid grid-cols-1 gap-4">
                                       {selectedCase.evidence.length === 0 ? (
                                           <div className="text-center py-12 text-slate-400">No evidence submitted yet.</div>
                                       ) : (
                                           selectedCase.evidence.map((ev) => (
                                               <div key={ev.id} className="bg-white border border-slate-200 rounded-lg p-4 flex gap-4 hover:shadow-md transition-shadow">
                                                   <div className={`w-12 h-12 rounded flex items-center justify-center shrink-0 ${ev.submittedBy === 'tenant' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                       {getEvidenceIcon(ev.type)}
                                                   </div>
                                                   <div className="flex-1">
                                                       <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="font-bold text-slate-900 text-sm">{ev.filename}</h4>
                                                                <p className="text-xs text-slate-500 mt-1">{ev.description}</p>
                                                            </div>
                                                            <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono">
                                                                {ev.timestamp}
                                                            </span>
                                                       </div>
                                                       <div className="mt-3 flex items-center gap-4">
                                                           {ev.verifiedMetadata && (
                                                               <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                                                   <Lock size={10} /> Metadata Verified
                                                               </span>
                                                           )}
                                                           <span className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
                                                               Hash: {ev.hash}
                                                           </span>
                                                            <button className="ml-auto text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
                                                                <Eye size={12} /> View File
                                                            </button>
                                                       </div>
                                                   </div>
                                               </div>
                                           ))
                                       )}
                                   </div>
                               </div>
                           )}

                           {/* TRUTH SURFACE TAB */}
                           {activeTab === 'truth' && (
                               <div className="animate-in fade-in duration-300">
                                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden mb-6">
                                        <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                                            <h3 className="font-bold flex items-center gap-2"><Lock size={16} /> Immutable Contract State</h3>
                                            <span className="text-xs font-mono opacity-70">Signed: Jan 15, 2024</span>
                                        </div>
                                        <div className="p-4 bg-amber-50 border-b border-amber-100 flex items-center gap-2 text-amber-800 text-sm">
                                            <AlertOctagon size={16} />
                                            <span>Dispute references key: <span className="font-bold font-mono">{selectedCase.relevantTruthKey}</span></span>
                                        </div>
                                        <TruthSurface 
                                            items={dealData.truthSurface} 
                                            isLocked={true}
                                            hash={dealData.truthSnapshotHash}
                                            signature={dealData.truthSignature}
                                        />
                                    </div>
                               </div>
                           )}

                           {/* RULING WIZARD */}
                           {activeTab === 'ruling' && (
                               <div className="animate-in fade-in slide-in-from-bottom-4 bg-white border border-slate-200 rounded-lg shadow-lg flex flex-col h-full overflow-hidden">
                                   {finalRuling ? (
                                       <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6">
                                                <Gavel size={40} />
                                            </div>
                                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Ruling Issued</h2>
                                            <p className="text-slate-500 mb-6">The Smart Contract has been executed. Funds have been distributed.</p>
                                            <div className="bg-slate-50 rounded p-4 w-full max-w-md text-left text-sm space-y-2 border border-slate-200">
                                                <div className="flex justify-between"><span>Verdict:</span> <span className="font-bold">{finalRuling.verdict}</span></div>
                                                <div className="flex justify-between"><span>Tenant Payout:</span> <span className="font-mono">${finalRuling.payoutToTenant}</span></div>
                                                <div className="flex justify-between"><span>Landlord Payout:</span> <span className="font-mono">${finalRuling.payoutToLandlord}</span></div>
                                                <div className="pt-2 border-t border-slate-200 mt-2 text-xs text-slate-500">{finalRuling.rationale}</div>
                                            </div>
                                       </div>
                                   ) : (
                                       <>
                                        {/* Wizard Header */}
                                        <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                                            <h3 className="font-bold text-slate-900">Adjudication Protocol</h3>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                                                <span className={rulingStep === 1 ? 'text-slate-900' : ''}>1. Verdict</span>
                                                <ChevronRight size={12} />
                                                <span className={rulingStep === 2 ? 'text-slate-900' : ''}>2. Financials</span>
                                                <ChevronRight size={12} />
                                                <span className={rulingStep === 3 ? 'text-slate-900' : ''}>3. Review</span>
                                            </div>
                                        </div>

                                        <div className="p-8 flex-1 overflow-y-auto">
                                            {rulingStep === 1 && (
                                                <div className="space-y-6 max-w-lg mx-auto">
                                                    <h3 className="text-lg font-bold text-center">Determine the Outcome</h3>
                                                    <div className="space-y-3">
                                                        {['Claimant Wins', 'Respondent Wins', 'Split Decision'].map(option => (
                                                            <button 
                                                                key={option}
                                                                onClick={() => setDraftRuling({...draftRuling, verdict: option as any})}
                                                                className={`w-full p-4 rounded-lg border-2 text-left font-medium transition-all ${draftRuling.verdict === option ? 'border-slate-900 bg-slate-50 text-slate-900' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                                                            >
                                                                {option}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-2">Legal Rationale</label>
                                                        <textarea 
                                                            className="w-full border border-slate-300 rounded p-3 h-32 focus:outline-none focus:border-slate-900"
                                                            placeholder="Cite Truth Surface keys and evidence..."
                                                            value={draftRuling.rationale}
                                                            onChange={(e) => setDraftRuling({...draftRuling, rationale: e.target.value})}
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            )}

                                            {rulingStep === 2 && (
                                                <div className="space-y-8 max-w-lg mx-auto">
                                                    <h3 className="text-lg font-bold text-center">Escrow Allocation</h3>
                                                    <div className="bg-slate-100 p-4 rounded-lg text-center">
                                                        <span className="text-xs text-slate-500 uppercase">Total Escrow</span>
                                                        <div className="text-3xl font-bold text-slate-900">${selectedCase.escrowAmount.toLocaleString()}</div>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div>
                                                            <div className="flex justify-between text-sm font-bold mb-2">
                                                                <span className="text-blue-600">Tenant: ${draftRuling.payoutToTenant}</span>
                                                                <span className="text-purple-600">Landlord: ${draftRuling.payoutToLandlord}</span>
                                                            </div>
                                                            <input 
                                                                type="range" 
                                                                min="0" 
                                                                max="100" 
                                                                step="1"
                                                                defaultValue="0"
                                                                onChange={(e) => calculatePayout(parseInt(e.target.value), selectedCase.escrowAmount)}
                                                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-700 mb-2">Ledger Impact (Reputation)</label>
                                                            <select 
                                                                className="w-full p-3 border border-slate-300 rounded"
                                                                value={draftRuling.ledgerImpact}
                                                                onChange={(e) => setDraftRuling({...draftRuling, ledgerImpact: e.target.value})}
                                                            >
                                                                <option>No Impact</option>
                                                                <option>Strike on Claimant (Frivolous)</option>
                                                                <option>Strike on Respondent (Non-Compliance)</option>
                                                                <option>Verification Downgrade (Both)</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {rulingStep === 3 && (
                                                <div className="space-y-6 max-w-lg mx-auto">
                                                     <h3 className="text-lg font-bold text-center">Confirm Ruling</h3>
                                                     <div className="bg-red-50 border border-red-100 p-4 rounded text-sm text-red-800 flex items-start gap-2">
                                                         <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                                         <p>This action is irreversible. The decision will be cryptographically signed and the Smart Contract will immediately execute the fund transfer.</p>
                                                     </div>

                                                     <div className="border border-slate-200 rounded divide-y divide-slate-100">
                                                         <div className="p-3 flex justify-between text-sm">
                                                             <span className="text-slate-500">Verdict</span>
                                                             <span className="font-bold">{draftRuling.verdict}</span>
                                                         </div>
                                                         <div className="p-3 flex justify-between text-sm">
                                                             <span className="text-slate-500">Tenant Recieves</span>
                                                             <span className="font-mono font-bold">${draftRuling.payoutToTenant}</span>
                                                         </div>
                                                         <div className="p-3 flex justify-between text-sm">
                                                             <span className="text-slate-500">Landlord Recieves</span>
                                                             <span className="font-mono font-bold">${draftRuling.payoutToLandlord}</span>
                                                         </div>
                                                         <div className="p-3 bg-slate-50 text-xs text-slate-600 italic">
                                                             "{draftRuling.rationale}"
                                                         </div>
                                                     </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 border-t border-slate-200 flex justify-between bg-slate-50">
                                            {rulingStep > 1 ? (
                                                <button onClick={() => setRulingStep(rulingStep - 1)} className="px-4 py-2 text-slate-600 font-medium">Back</button>
                                            ) : <div></div>}
                                            
                                            {rulingStep < 3 ? (
                                                <button 
                                                    onClick={() => setRulingStep(rulingStep + 1)} 
                                                    disabled={!draftRuling.verdict || !draftRuling.rationale}
                                                    className="px-6 py-2 bg-slate-900 text-white rounded font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                >
                                                    Next <ArrowRight size={16} />
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={submitRuling}
                                                    className="px-6 py-2 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700 shadow-sm flex items-center gap-2"
                                                >
                                                    <FileSignature size={16} /> Sign & Execute
                                                </button>
                                            )}
                                        </div>
                                       </>
                                   )}
                               </div>
                           )}

                       </div>
                   </div>
               ) : (
                   <div className="flex items-center justify-center h-full border border-dashed border-slate-300 rounded-lg bg-slate-50 text-slate-400">
                       <div className="text-center">
                           <Gavel size={48} className="mx-auto mb-4 opacity-50" />
                           <p className="font-medium">Select a case from the queue to begin adjudication.</p>
                       </div>
                   </div>
               )}
           </div>
       </div>
    </div>
  );
};

export default ArbitratorDashboard;
