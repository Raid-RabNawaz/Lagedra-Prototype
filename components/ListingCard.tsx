
import React from 'react';
import { Listing } from '../types';
import { MapPin, Home, Zap, ShieldCheck, Heart } from 'lucide-react';

interface Props {
  listing: Listing;
  onClick: () => void;
  isSaved?: boolean;
  onToggleSaved?: (id: string) => void;
}

const ListingCard: React.FC<Props> = ({ listing, onClick, isSaved, onToggleSaved }) => {
  const vStatus = listing.verificationStatus || { photoMatch: false, videoTour: false, documents: false, mailCode: false, gpsMatch: false };
  const verifiedCount = Object.values(vStatus).filter(Boolean).length;
  const totalChecks = 5;
  const trustPercent = (verifiedCount / totalChecks) * 100;

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSaved) {
      onToggleSaved(listing.id);
    }
  };

  return (
    <div 
      onClick={onClick}
      className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col h-full relative"
    >
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img 
          src={listing.imageUrl} 
          alt={listing.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-slate-800 shadow-sm">
          30-180 Days
        </div>
        
        {/* Heart Save Button */}
        {onToggleSaved && (
          <button 
            onClick={handleHeartClick}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/10 active:scale-95 transition-all focus:outline-none"
          >
            <Heart 
              size={24} 
              className={`transition-colors drop-shadow-md ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-white fill-black/30 hover:scale-110'}`} 
            />
          </button>
        )}
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-slate-800 leading-tight line-clamp-2">{listing.title}</h3>
        </div>
        
        <div className="flex items-center text-slate-500 text-sm mb-3">
          <MapPin size={14} className="mr-1" />
          {listing.location.city}, {listing.location.state}
          {listing.location.approximate && <span className="ml-1 text-xs text-slate-400">(Approx)</span>}
        </div>

        <div className="mb-4">
             <div className="flex items-center justify-between mb-1">
                 <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-500">
                     <ShieldCheck size={12} className={verifiedCount === totalChecks ? 'text-emerald-500' : 'text-slate-400'} />
                     Property Trust
                 </div>
                 <div className={`text-[10px] font-bold ${verifiedCount >= 4 ? 'text-emerald-600' : 'text-amber-600'}`}>
                     {verifiedCount}/{totalChecks} Verified
                 </div>
             </div>
             <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                 <div 
                    className={`h-full rounded-full transition-all ${verifiedCount === 5 ? 'bg-emerald-500' : verifiedCount >= 3 ? 'bg-emerald-400' : 'bg-amber-400'}`} 
                    style={{ width: `${trustPercent}%` }}
                ></div>
             </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4">
          <div className="flex items-center gap-1">
             <Home size={12} />
             {listing.details.bedrooms} Bed, {listing.details.bathrooms} Bath
          </div>
          <div className="flex items-center gap-1">
             <Zap size={12} />
             {listing.details.utilitiesIncluded ? 'Utils Included' : 'Utils Extra'}
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-900">${listing.priceDisplay.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 uppercase">Per Month</span>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-xs text-emerald-600 font-medium">Rec. Deposit: ${listing.depositGuidance.recommended}</span>
                <span className="text-[10px] text-slate-400">Based on Low Risk</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
