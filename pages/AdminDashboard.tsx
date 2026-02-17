
import React, { useState } from 'react';
import { MOCK_OPS_QUEUE, MOCK_USER_ADMIN, MOCK_LISTINGS } from '../constants';
import { OpsQueueItem } from '../types';
import AdminReviewModal from '../components/AdminReviewModal';
import { 
  ShieldAlert, Clock, CheckCircle2, FileText, AlertTriangle, Users, Play, 
  X, Activity, Server, Database, Globe, Search, Settings, DollarSign, 
  BarChart3, Lock, Zap, Filter, ChevronDown, MoreHorizontal, Ban, Network, Cpu, Radio, GitPullRequest, ArrowUpCircle
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'queue' | 'risk' | 'governance'>('overview');
  const [queue, setQueue] = useState<OpsQueueItem[]>(MOCK_OPS_QUEUE);
  const [activeReviewItem, setActiveReviewItem] = useState<OpsQueueItem | null>(null);
  
  // System Health Mock State
  const [sysStatus, setSysStatus] = useState({
      identity: 'operational',
      payments: 'operational',
      ledger: 'operational',
      notifications: 'degraded'
  });

  // Risk Engine Configuration Mock State
  const [riskParams, setRiskParams] = useState({
      velocityLimit: 3, // Deals per 24h
      autoFlagThreshold: 75, // Risk score out of 100
      geoFenceStrictness: 'Medium',
      requireManualKycForAmt: 5000 // Dollar amount
  });

  // Mock Data for Risk Tab
  const flaggedUsers = [
      { id: 'u_882', name: 'Alex V.', reason: 'Velocity Limit Exceeded', riskScore: 85, status: 'Frozen' },
      { id: 'u_192', name: 'Luxury Stays Corp', reason: 'Beneficial Owner Mismatch', riskScore: 92, status: 'Under Review' },
      { id: 'u_771', name: 'Sarah J.', reason: 'Login IP Anomaly', riskScore: 45, status: 'Warning' },
  ];

  const handleReviewTask = (item: OpsQueueItem) => {
    setActiveReviewItem(item);
  };

  const handleResolveTask = (id: string, decision: 'approved' | 'rejected') => {
      setQueue(prev => prev.filter(item => item.id !== id));
      setActiveReviewItem(null);
      // In a real app, this would dispatch an API call
      console.log(`Task ${id} resolved: ${decision}`);
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'operational': return 'bg-emerald-500';
          case 'degraded': return 'bg-amber-500';
          case 'down': return 'bg-red-500';
          default: return 'bg-slate-300';
      }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
           <div className="flex items-center gap-4">
                <div className="relative">
                    <img src={MOCK_USER_ADMIN.avatarUrl} className="w-14 h-14 rounded-xl bg-slate-900 object-cover shadow-sm" alt="Admin" />
                    <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white p-1 rounded-lg border-2 border-white">
                        <ShieldAlert size={12} />
                    </div>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Ops Command</h1>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        System Operational
                        <span className="text-slate-300">|</span>
                        <span className="font-mono">v2.4.1-beta</span>
                    </div>
                </div>
           </div>

           <div className="flex-1 max-w-lg w-full">
               <div className="relative group">
                   <Search className="absolute left-3 top-3 text-slate-400 group-focus-within:text-purple-600 transition-colors" size={18} />
                   <input 
                      type="text" 
                      placeholder="Search Transaction ID, User Hash, or Listing..." 
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all shadow-sm"
                   />
                   <div className="absolute right-3 top-2.5 flex items-center gap-1">
                       <kbd className="hidden md:inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-500 font-sans">⌘K</kbd>
                   </div>
               </div>
           </div>
       </div>

       {/* Navigation Tabs */}
       <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
           {[
               { id: 'overview', label: 'System Overview', icon: Activity },
               { id: 'queue', label: 'Workforce Queue', icon: Clock, count: queue.length },
               { id: 'risk', label: 'Risk & Fraud', icon: Lock, count: flaggedUsers.length },
               { id: 'governance', label: 'Governance', icon: Database },
           ].map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                      activeTab === tab.id 
                        ? 'border-purple-600 text-purple-700 bg-purple-50/50' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
               >
                   <tab.icon size={16} />
                   {tab.label}
                   {tab.count !== undefined && tab.count > 0 && (
                       <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-purple-200 text-purple-800' : 'bg-slate-200 text-slate-600'}`}>
                           {tab.count}
                       </span>
                   )}
               </button>
           ))}
       </div>

       {/* OVERVIEW TAB */}
       {activeTab === 'overview' && (
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
               {/* KPI Cards */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                       <div className="flex justify-between items-start mb-4">
                           <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={20} /></div>
                           <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded flex items-center gap-1">
                               <Activity size={10} /> +12%
                           </span>
                       </div>
                       <div className="text-2xl font-bold text-slate-900">2,841</div>
                       <div className="text-xs text-slate-500">Active Users</div>
                   </div>
                   <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                       <div className="flex justify-between items-start mb-4">
                           <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><DollarSign size={20} /></div>
                           <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Healthy</span>
                       </div>
                       <div className="text-2xl font-bold text-slate-900">$4.2M</div>
                       <div className="text-xs text-slate-500">Total Value Locked (TVL)</div>
                   </div>
                   <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                       <div className="flex justify-between items-start mb-4">
                           <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><AlertTriangle size={20} /></div>
                           <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">2 Action</span>
                       </div>
                       <div className="text-2xl font-bold text-slate-900">0.8%</div>
                       <div className="text-xs text-slate-500">Dispute Rate (30d)</div>
                   </div>
                   <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                       <div className="flex justify-between items-start mb-4">
                           <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Zap size={20} /></div>
                           <span className="text-xs font-bold text-slate-500">Last 24h</span>
                       </div>
                       <div className="text-2xl font-bold text-slate-900">142</div>
                       <div className="text-xs text-slate-500">Smart Contracts Executed</div>
                   </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   {/* System Status & Metrics */}
                   <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-full flex flex-col">
                       <div className="flex justify-between items-center mb-6">
                           <h3 className="font-bold text-slate-900 flex items-center gap-2">
                               <Server size={18} className="text-slate-400" /> Platform Health
                           </h3>
                           <span className="text-xs font-mono text-slate-400">Region: us-west-1</span>
                       </div>
                       
                       <div className="space-y-4 flex-1">
                           <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                               <div className="flex items-center gap-3">
                                   <div className={`w-2 h-2 rounded-full ${getStatusColor(sysStatus.identity)} shadow-[0_0_8px_rgba(16,185,129,0.4)]`}></div>
                                   <span className="text-sm font-medium text-slate-700">Identity Oracle</span>
                               </div>
                               <span className="text-xs font-mono text-slate-400">45ms</span>
                           </div>
                           <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                               <div className="flex items-center gap-3">
                                   <div className={`w-2 h-2 rounded-full ${getStatusColor(sysStatus.payments)}`}></div>
                                   <span className="text-sm font-medium text-slate-700">Fiat Rails (Stripe)</span>
                               </div>
                               <span className="text-xs font-mono text-slate-400">120ms</span>
                           </div>
                           <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                               <div className="flex items-center gap-3">
                                   <div className={`w-2 h-2 rounded-full ${getStatusColor(sysStatus.ledger)}`}></div>
                                   <span className="text-sm font-medium text-slate-700">Trust Ledger (L2)</span>
                               </div>
                               <span className="text-xs font-mono text-slate-400">210ms</span>
                           </div>
                           <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-amber-100">
                               <div className="flex items-center gap-3">
                                   <div className={`w-2 h-2 rounded-full ${getStatusColor(sysStatus.notifications)} animate-pulse`}></div>
                                   <span className="text-sm font-medium text-slate-700">Notifications (SMS)</span>
                               </div>
                               <span className="text-xs font-bold text-amber-600">High Latency (850ms)</span>
                           </div>
                       </div>

                       <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                           <div className="text-center">
                               <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">API Error Rate</div>
                               <div className="text-lg font-mono font-bold text-emerald-600">0.02%</div>
                           </div>
                           <div className="text-center">
                               <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Active Connections</div>
                               <div className="text-lg font-mono font-bold text-slate-900">4,102</div>
                           </div>
                       </div>
                   </div>

                   {/* Recent Audit Log */}
                   <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                       <div className="flex justify-between items-center mb-6">
                           <h3 className="font-bold text-slate-900 flex items-center gap-2">
                               <FileText size={18} className="text-slate-400" /> Admin Audit Log
                           </h3>
                           <button className="text-xs text-blue-600 hover:underline">View Full Ledger</button>
                       </div>
                       <div className="space-y-0 divide-y divide-slate-100">
                           <div className="flex items-center justify-between py-3">
                               <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">JD</div>
                                   <div>
                                       <div className="text-sm font-medium text-slate-900">Admin_JD updated Jurisdiction Pack</div>
                                       <div className="text-xs text-slate-500">Target: US-CA-LA-v2.2 • Reason: Compliance Update</div>
                                   </div>
                               </div>
                               <span className="text-xs text-slate-400 font-mono">10m ago</span>
                           </div>
                           <div className="flex items-center justify-between py-3">
                               <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">SYS</div>
                                   <div>
                                       <div className="text-sm font-medium text-slate-900">Automated Risk Flag Triggered</div>
                                       <div className="text-xs text-slate-500">User: u_882 • Velocity Limit</div>
                                   </div>
                               </div>
                               <span className="text-xs text-slate-400 font-mono">32m ago</span>
                           </div>
                           <div className="flex items-center justify-between py-3">
                               <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">AM</div>
                                   <div>
                                       <div className="text-sm font-medium text-slate-900">Admin_AM overrode ID Verification</div>
                                       <div className="text-xs text-slate-500">User: u_102 • Manual Review Passed</div>
                                   </div>
                               </div>
                               <span className="text-xs text-slate-400 font-mono">2h ago</span>
                           </div>
                           <div className="flex items-center justify-between py-3">
                               <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">AM</div>
                                   <div>
                                       <div className="text-sm font-medium text-slate-900">Admin_AM resolved Dispute #8821</div>
                                       <div className="text-xs text-slate-500">Verdict: Split Decision • Payout executed</div>
                                   </div>
                               </div>
                               <span className="text-xs text-slate-400 font-mono">5h ago</span>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       )}

       {/* QUEUE TAB */}
       {activeTab === 'queue' && (
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-2">
               <div className="lg:col-span-3 space-y-4">
                   <div className="flex items-center justify-between mb-2">
                       <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                           Pending Tasks <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">{queue.length}</span>
                       </h2>
                       <div className="flex gap-2">
                           <button className="p-2 border border-slate-200 rounded hover:bg-slate-50 text-slate-500"><Filter size={16} /></button>
                           <button className="p-2 border border-slate-200 rounded hover:bg-slate-50 text-slate-500"><Settings size={16} /></button>
                       </div>
                   </div>

                   {queue.length === 0 ? (
                       <div className="text-center py-20 bg-white border border-slate-200 rounded-xl text-slate-500 border-dashed">
                           <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-4 opacity-50" />
                           <p>All operational tasks cleared. Good work.</p>
                       </div>
                   ) : (
                       queue.map((item: OpsQueueItem) => (
                           <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                               <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.severity === 'High' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                               <div className="pl-3 flex flex-col sm:flex-row justify-between items-start gap-4">
                                   <div className="flex-1">
                                       <div className="flex items-center gap-2 mb-1">
                                           <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${item.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                               {item.severity} Priority
                                           </span>
                                           <span className="text-xs text-slate-500 font-mono">ID: {item.id}</span>
                                           <span className="text-xs text-slate-400">• {item.created}</span>
                                       </div>
                                       <h3 className="font-bold text-slate-900 text-base">{item.type}</h3>
                                       <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">{item.description}</p>
                                       
                                       {item.type === 'Insurance Unknown' && (
                                           <div className="mt-3 flex gap-2">
                                               <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">Grace Period: 72h</span>
                                               <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">Auto-Retry: 3/5</span>
                                           </div>
                                       )}
                                   </div>
                                   <div className="text-right shrink-0 flex flex-col items-end">
                                       <div className="text-xs font-bold text-slate-500 uppercase mb-1">SLA Deadline</div>
                                       <div className="text-lg font-mono font-medium text-red-600 mb-3">{item.deadline}</div>
                                       <button 
                                            onClick={() => handleReviewTask(item)}
                                            className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center gap-2 transition-colors shadow-sm"
                                        >
                                           <Play size={14} /> Review Task
                                       </button>
                                   </div>
                               </div>
                           </div>
                       ))
                   )}
               </div>

               {/* Right Sidebar Stats */}
               <div className="space-y-6">
                   <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                       <h3 className="font-bold text-slate-900 text-sm mb-4">Team Load</h3>
                       <div className="space-y-3">
                           <div>
                               <div className="flex justify-between text-xs mb-1">
                                   <span className="font-medium text-slate-700">You (Admin_Alpha)</span>
                                   <span className="text-slate-500">4 Active</span>
                               </div>
                               <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                   <div className="bg-purple-600 h-full rounded-full" style={{ width: '40%' }}></div>
                               </div>
                           </div>
                           <div>
                               <div className="flex justify-between text-xs mb-1">
                                   <span className="font-medium text-slate-700">Admin_Beta</span>
                                   <span className="text-slate-500">12 Active</span>
                               </div>
                               <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                   <div className="bg-amber-500 h-full rounded-full" style={{ width: '85%' }}></div>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       )}

       {/* RISK CONTROL TAB */}
       {activeTab === 'risk' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2">
               
               {/* Left: Flagged Accounts List */}
               <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
                   <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
                       <h3 className="font-bold text-slate-900 flex items-center gap-2">
                           <AlertTriangle className="text-amber-500" size={20} /> Flagged Accounts
                       </h3>
                       <div className="flex gap-2">
                           <button className="px-3 py-1.5 text-sm border border-slate-200 rounded hover:bg-slate-50">Export CSV</button>
                       </div>
                   </div>
                   <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Risk Score</th>
                                    <th className="px-6 py-4">Flag Reason</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {flaggedUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{user.name}</div>
                                            <div className="text-xs text-slate-500 font-mono">{user.id}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-12 h-1.5 rounded-full bg-slate-200 overflow-hidden`}>
                                                    <div 
                                                        className={`h-full ${user.riskScore > 80 ? 'bg-red-500' : 'bg-amber-500'}`} 
                                                        style={{ width: `${user.riskScore}%` }}
                                                    ></div>
                                                </div>
                                                <span className={`text-xs font-bold ${user.riskScore > 80 ? 'text-red-600' : 'text-amber-600'}`}>{user.riskScore}/100</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-700">{user.reason}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                                                user.status === 'Frozen' ? 'bg-red-100 text-red-700' : 
                                                user.status === 'Under Review' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-slate-600 mx-1"><MoreHorizontal size={18} /></button>
                                            <button className="text-blue-600 hover:underline text-sm font-medium ml-2">Review</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                   </div>
               </div>

               {/* Right: Risk Engine Configuration */}
               <div className="bg-slate-900 text-white rounded-xl shadow-lg p-6 flex flex-col h-full">
                   <div className="flex items-center justify-between mb-6">
                       <h3 className="font-bold flex items-center gap-2"><Cpu size={20} className="text-emerald-400" /> Risk Engine v2.1</h3>
                       <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase rounded border border-emerald-500/30">Active</div>
                   </div>

                   <div className="space-y-8 flex-1">
                       <div>
                           <div className="flex justify-between text-xs uppercase font-bold text-slate-400 mb-2">
                               <span>Velocity Limit (Deals/24h)</span>
                               <span className="text-white">{riskParams.velocityLimit}</span>
                           </div>
                           <input 
                                type="range" min="1" max="10" step="1"
                                value={riskParams.velocityLimit}
                                onChange={(e) => setRiskParams({...riskParams, velocityLimit: parseInt(e.target.value)})}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                           />
                           <p className="text-xs text-slate-500 mt-2">Accounts exceeding this will be auto-frozen.</p>
                       </div>

                       <div>
                           <div className="flex justify-between text-xs uppercase font-bold text-slate-400 mb-2">
                               <span>Auto-Flag Threshold</span>
                               <span className="text-white">{riskParams.autoFlagThreshold}/100</span>
                           </div>
                           <input 
                                type="range" min="0" max="100" step="1"
                                value={riskParams.autoFlagThreshold}
                                onChange={(e) => setRiskParams({...riskParams, autoFlagThreshold: parseInt(e.target.value)})}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                           />
                           <p className="text-xs text-slate-500 mt-2">Transactions with risk scores above this trigger manual review.</p>
                       </div>

                        <div>
                           <div className="flex justify-between text-xs uppercase font-bold text-slate-400 mb-2">
                               <span>Manual KYC Trigger ($)</span>
                               <span className="text-white">${riskParams.requireManualKycForAmt}</span>
                           </div>
                           <div className="flex gap-2">
                               {[2500, 5000, 10000].map(val => (
                                   <button 
                                      key={val}
                                      onClick={() => setRiskParams({...riskParams, requireManualKycForAmt: val})}
                                      className={`flex-1 py-2 text-xs font-bold rounded border transition-colors ${riskParams.requireManualKycForAmt === val ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                                   >
                                       ${val/1000}k
                                   </button>
                               ))}
                           </div>
                       </div>
                   </div>

                   <div className="mt-8 pt-6 border-t border-slate-700">
                       <button className="w-full py-3 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg font-bold hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2">
                           <Ban size={16} /> Emergency Freeze All
                       </button>
                   </div>
               </div>
           </div>
       )}

       {/* GOVERNANCE TAB */}
       {activeTab === 'governance' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2">
               {/* Protocol Parameters */}
               <div className="lg:col-span-2 space-y-6">
                   <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                       <div className="flex justify-between items-center mb-6">
                           <h3 className="font-bold text-slate-900 flex items-center gap-2">
                               <Settings size={20} className="text-slate-400" /> Protocol Parameters
                           </h3>
                           <span className="text-xs text-slate-400 font-mono">Config Hash: 0x9a...2b</span>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="p-4 border border-slate-200 rounded-lg">
                               <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Base Protocol Fee</label>
                               <div className="flex items-center gap-3">
                                   <input type="text" value="3.5%" readOnly className="w-20 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-900 font-mono" />
                                   <span className="text-xs text-slate-500">Default for Low Risk</span>
                               </div>
                           </div>
                           <div className="p-4 border border-slate-200 rounded-lg">
                               <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Dispute Window</label>
                               <div className="flex items-center gap-3">
                                   <input type="text" value="72h" readOnly className="w-20 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-900 font-mono" />
                                   <span className="text-xs text-slate-500">Post-Check-in</span>
                               </div>
                           </div>
                           <div className="p-4 border border-slate-200 rounded-lg">
                               <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Arbitration Fee</label>
                               <div className="flex items-center gap-3">
                                   <input type="text" value="$150" readOnly className="w-20 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-900 font-mono" />
                                   <span className="text-xs text-slate-500">Paid by losing party</span>
                               </div>
                           </div>
                           <div className="p-4 border border-slate-200 rounded-lg opacity-50">
                               <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Insurance Grace</label>
                               <div className="flex items-center gap-3">
                                   <input type="text" value="48h" readOnly className="w-20 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-900 font-mono" />
                                   <span className="text-xs text-slate-500">Locked</span>
                               </div>
                           </div>
                       </div>
                       
                       <div className="mt-6 flex justify-end">
                           <button className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium">View Change Log</button>
                           <button className="px-4 py-2 bg-slate-900 text-white rounded font-medium hover:bg-slate-800 text-sm ml-2">Propose Change</button>
                       </div>
                   </div>

                   {/* Protocol Upgrades Section */}
                   <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                       <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-6">
                           <GitPullRequest size={20} className="text-slate-400" /> Pending Upgrades
                       </h3>
                       <div className="space-y-4">
                           <div className="border border-slate-200 rounded-lg p-4 flex justify-between items-center">
                               <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold">V2.5</div>
                                   <div>
                                       <div className="font-bold text-slate-900">Smart Contract Upgrade: Escrow Optimization</div>
                                       <div className="text-xs text-slate-500">Reduces gas costs by 15%. Passed governance vote #42.</div>
                                   </div>
                               </div>
                               <div className="flex items-center gap-3">
                                   <div className="text-right">
                                       <div className="text-xs font-bold text-slate-500 uppercase">Timelock</div>
                                       <div className="text-sm font-mono text-amber-600">14h 22m remaining</div>
                                   </div>
                                   <button className="bg-slate-100 text-slate-400 px-4 py-2 rounded text-sm font-bold cursor-not-allowed" disabled>Deploying...</button>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>

               {/* Jurisdiction Packs (Moved from sidebar to here) */}
               <div>
                   <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm sticky top-6">
                       <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-6">
                           <Globe size={20} className="text-slate-400" /> Jurisdiction Packs
                       </h3>
                       
                       <div className="mb-6">
                           <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Active Pack</div>
                           <div className="flex justify-between items-center bg-slate-50 p-3 rounded border border-slate-100">
                               <span className="font-bold text-slate-900">US-CA-LA-v2.1</span>
                               <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded font-medium">Live</span>
                           </div>
                           <div className="text-xs text-slate-400 mt-2 text-right">Effective: Jan 01, 2024</div>
                       </div>

                       <div className="border-t border-slate-100 pt-6">
                            <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">Drafts Pending Approval</div>
                            <div className="p-3 bg-slate-50 rounded border border-slate-200 mb-3 hover:border-slate-300 transition-colors">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-sm text-slate-900">US-CA-LA-v2.2</span>
                                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">Draft</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-2">Adds "Short-Term Permit" field requirement.</p>
                                <div className="flex items-center gap-2 text-xs text-slate-600 bg-white p-2 rounded border border-slate-100">
                                    <Users size={12} />
                                    <span>Requires Dual-Control Sign-off</span>
                                </div>
                                <button className="w-full mt-3 bg-slate-900 text-white text-xs py-2 rounded font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                                    Review & Request Approval <ArrowUpCircle size={14} />
                                </button>
                            </div>
                       </div>
                   </div>
               </div>
           </div>
       )}

       {/* Admin Review Modal */}
       {activeReviewItem && (
           <AdminReviewModal 
               item={activeReviewItem} 
               onClose={() => setActiveReviewItem(null)}
               onResolve={handleResolveTask}
           />
       )}
    </div>
  );
};

export default AdminDashboard;
