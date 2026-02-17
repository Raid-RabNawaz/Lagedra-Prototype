
import React from 'react';
import { ShieldCheck, UserCircle2, LayoutDashboard, Gavel, ShieldAlert, Bell, Menu } from 'lucide-react';
import { UserRole } from '../types';
import ShieldIcon from '../assets/Lagedra-logo.png'; // Adjust path as needed

interface Props {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentRole: UserRole;
}

const Navbar: React.FC<Props> = ({ currentPage, onNavigate, currentRole }) => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md bg-white/90 support-backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="flex items-center gap-2.5 group">
                <div className="bg-slate-900 text-white p-1.5 rounded-lg group-hover:scale-105 transition-transform shadow-md shadow-slate-900/10">
                    <img 
                        src={ShieldIcon} 
                        alt="Lagedra Logo" 
                        className="w-6 h-6 object-contain" 
                    />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-xl tracking-tight text-slate-900 leading-none">Lagedra</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] leading-none font-medium">Protocol</span>
                </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
                <button 
                    onClick={() => onNavigate('home')}
                    className={`text-sm font-medium transition-all ${currentPage === 'home' || currentPage === 'listing' ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Browse
                </button>
                
                {/* Dynamic Links based on Role */}
                {currentRole === 'tenant' && (
                  <button 
                      onClick={() => onNavigate('tenant')}
                      className={`text-sm font-medium transition-all ${currentPage === 'tenant' ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Tenant Dashboard
                  </button>
                )}

                {currentRole === 'landlord' && (
                  <button 
                      onClick={() => onNavigate('landlord')}
                      className={`text-sm font-medium transition-all ${currentPage === 'landlord' ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Landlord Portal
                  </button>
                )}

                {currentRole === 'arbitrator' && (
                   <button 
                      onClick={() => onNavigate('arbitrator')}
                      className={`flex items-center gap-1.5 text-sm font-medium transition-all ${currentPage === 'arbitrator' ? 'text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full' : 'text-slate-500 hover:text-amber-700'}`}
                  >
                    <Gavel size={14} /> Arbitration
                  </button>
                )}

                {currentRole === 'admin' && (
                   <button 
                      onClick={() => onNavigate('admin')}
                      className={`flex items-center gap-1.5 text-sm font-medium transition-all ${currentPage === 'admin' ? 'text-purple-700 bg-purple-50 px-3 py-1.5 rounded-full' : 'text-slate-500 hover:text-purple-700'}`}
                  >
                    <ShieldAlert size={14} /> Ops Command
                  </button>
                )}
            </div>

            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            
            <div className="flex items-center gap-4">
                <button className="relative text-slate-500 hover:text-slate-700 transition-colors p-1">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>
                
                <div className="flex items-center gap-2 px-2 py-1 rounded-full border border-slate-200 hover:shadow-sm transition-all cursor-pointer bg-white">
                    <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                        <UserCircle2 size={20} />
                    </div>
                    <span className="text-sm font-medium capitalize text-slate-700 pr-1 hidden sm:block">{currentRole}</span>
                    <Menu size={16} className="text-slate-400 sm:hidden ml-1" />
                </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
