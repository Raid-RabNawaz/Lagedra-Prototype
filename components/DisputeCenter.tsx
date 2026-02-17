import React, { useState, useRef } from 'react';
import { Deal, DealStatus, UserRole } from '../types';
import { AlertTriangle, Upload, Scale, FileText, CheckCircle2, Clock, AlertOctagon, Calendar, Trash2, Gavel } from 'lucide-react';

interface Props {
  deal: Deal;
  userRole: UserRole;
}

interface EvidenceFile {
  id: string;
  name: string;
  uploadTime: string;
  type: string;
}

const DisputeCenter: React.FC<Props> = ({ deal, userRole }) => {
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([
    { id: '1', name: 'thermostat_reading.jpg', uploadTime: '2h ago', type: 'IMG' }
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isHost = userRole === 'landlord';

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles: EvidenceFile[] = Array.from(files).map((file: File) => {
          const ext = file.name.split('.').pop()?.toUpperCase().slice(0, 3) || 'FIL';
          return {
            id: Math.random().toString(36).substring(7),
            name: file.name,
            uploadTime: 'Just now',
            type: ext
          };
      });
      setEvidenceFiles(prev => [...prev, ...newFiles]);
    }
    // Reset value to allow re-selection
    if (event.target) event.target.value = '';
  };

  const handleRemoveFile = (id: string) => {
    setEvidenceFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="bg-white rounded-b-lg overflow-hidden">
      {/* Status Header */}
      <div className="bg-amber-50 border-b border-amber-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-amber-900 flex items-center gap-2">
            <AlertOctagon className="text-amber-600" />
            Protocol Dispute Active
          </h2>
          <p className="text-amber-800 text-sm mt-1">
            Standard protocols suspended. Arbitration mode engaged.
            {isHost ? " Funds frozen in escrow pending resolution." : " Standard payout schedule paused."}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wide">Expected Resolution</div>
          <div className="font-mono text-amber-900 font-semibold">October 24, 2024</div>
        </div>
      </div>

      <div className="p-6">
        {/* Progress Tracker */}
        <div className="mb-10 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
            <div className="relative z-10 flex justify-between">
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-2">
                        <CheckCircle2 size={16} />
                    </div>
                    <span className="text-xs font-semibold text-emerald-600">Initiation</span>
                    <span className="text-[10px] text-slate-400">Oct 15</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center mb-2 shadow-lg shadow-amber-200 ring-4 ring-amber-50">
                        <Upload size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-900">Evidence Phase</span>
                    <span className="text-[10px] text-amber-600 font-medium">Action Required</span>
                </div>
                <div className="flex flex-col items-center opacity-50">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mb-2">
                        <Gavel size={16} />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">Adjudication</span>
                    <span className="text-[10px] text-slate-400">Est. Oct 20</span>
                </div>
                <div className="flex flex-col items-center opacity-50">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mb-2">
                        <FileText size={16} />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">Enforcement</span>
                    <span className="text-[10px] text-slate-400">Est. Oct 24</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Evidence Section */}
            <div>
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Upload size={18} className="text-slate-500" />
                    {isHost ? 'Submit Counter-Evidence' : 'Required Evidence'}
                </h3>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-4">
                    <p className="text-sm text-slate-600">
                        {isHost 
                          ? 'Please upload documentation proving compliance with the Truth Surface conditions cited in the claim.'
                          : 'Please upload evidence verifying your claim against the Truth Surface key: "HVAC".'
                        }
                        Files must contain EXIF metadata.
                    </p>

                    <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                    />

                    <div 
                        onClick={handleUploadClick}
                        className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-white hover:border-slate-400 transition-colors cursor-pointer group"
                    >
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-slate-200">
                            <Upload size={20} className="text-slate-400 group-hover:text-slate-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 block">Upload Photos or Video</span>
                        <span className="text-xs text-slate-400">JPG, PNG, MP4 (Max 50MB)</span>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {evidenceFiles.map((file) => (
                            <div key={file.id} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded group">
                                <div className="w-8 h-8 bg-emerald-100 rounded flex items-center justify-center text-emerald-600 font-bold text-xs">
                                    {file.type}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-slate-800 truncate">{file.name}</div>
                                    <div className="text-[10px] text-slate-500">Uploaded {file.uploadTime} • Verified Metadata</div>
                                </div>
                                <button 
                                    onClick={() => handleRemoveFile(file.id)}
                                    className="text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                                    title="Remove evidence"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Arbitration Details */}
            <div>
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Scale size={18} className="text-slate-500" />
                    Case Details
                </h3>
                <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                    <div className="p-4">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Dispute Type</div>
                        <div className="font-medium text-slate-900">Habitability Violation (Class B)</div>
                    </div>
                    <div className="p-4">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Claim Summary</div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Tenant asserts property temperature exceeds 85°F due to AC failure, violating Truth Surface condition "Central AC / Heating Functional".
                        </p>
                    </div>
                     <div className="p-4 bg-slate-50">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Relevant Truth Surface Key</div>
                        <div className="flex items-center justify-between bg-white border border-slate-200 p-2 rounded mt-1">
                             <span className="text-sm font-mono text-slate-600">Condition.HVAC</span>
                             <span className="text-sm font-medium text-slate-900">"Central AC / Heating Functional"</span>
                        </div>
                    </div>
                </div>

                {/* Detailed Timeline */}
                <div className="mt-8">
                     <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Calendar size={18} className="text-slate-500" />
                        Resolution Schedule
                    </h3>
                    <div className="space-y-0 border-l-2 border-slate-200 ml-2 pl-6 relative">
                        {/* Timeline Item 1 */}
                        <div className="pb-6 relative">
                            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></div>
                            <div className="text-xs font-bold text-emerald-600 mb-0.5">Oct 15, 2024</div>
                            <div className="font-medium text-slate-900 text-sm">Dispute Filed</div>
                            <div className="text-xs text-slate-500 mt-0.5">Automated hold placed on escrow. Protocol suspended.</div>
                        </div>

                        {/* Timeline Item 2 */}
                        <div className="pb-6 relative">
                             <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-white ring-2 ring-amber-100"></div>
                             <div className="text-xs font-bold text-amber-600 mb-0.5">Oct 17, 2024 (Today)</div>
                             <div className="font-medium text-slate-900 text-sm">Evidence Submission Deadline</div>
                             <div className="text-xs text-slate-500 mt-0.5">Final call for photo/video uploads with metadata.</div>
                        </div>

                        {/* Timeline Item 3 */}
                        <div className="pb-6 relative">
                             <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-200 border-2 border-white"></div>
                             <div className="text-xs font-bold text-slate-500 mb-0.5">Oct 20, 2024</div>
                             <div className="font-medium text-slate-500 text-sm">Adjudication Review</div>
                             <div className="text-xs text-slate-400 mt-0.5">Neutral node review of Truth Surface vs Evidence.</div>
                        </div>

                         {/* Timeline Item 4 */}
                        <div className="relative">
                             <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-200 border-2 border-white"></div>
                             <div className="text-xs font-bold text-slate-500 mb-0.5">Oct 24, 2024</div>
                             <div className="font-medium text-slate-500 text-sm">Protocol Enforcement</div>
                             <div className="text-xs text-slate-400 mt-0.5">Funds released or returned based on ruling.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-3">
             <button className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900">Review Protocol Rules</button>
             <button className="px-6 py-2 bg-slate-900 text-white text-sm font-medium rounded hover:bg-slate-800 flex items-center gap-2">
                {isHost ? 'Submit Counter-Evidence' : 'Submit Evidence Package'}
             </button>
        </div>
      </div>
    </div>
  );
};

export default DisputeCenter;