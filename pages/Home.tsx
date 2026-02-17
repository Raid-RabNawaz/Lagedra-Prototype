
import React, { useState, useMemo } from 'react';
import ListingCard from '../components/ListingCard';
import { MOCK_LISTINGS } from '../constants';
import { Search, Map as MapIcon, Filter, Calendar, MapPin, List, ArrowRight, X, Briefcase, Stethoscope, Wifi, Coffee, Car } from 'lucide-react';

interface Props {
  onSelectList: (id: string) => void;
  savedListingIds?: string[];
  onToggleSaved?: (id: string) => void;
}

const Home: React.FC<Props> = ({ onSelectList, savedListingIds = [], onToggleSaved }) => {
  const [searchLocation, setSearchLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);
  const [showMapMobile, setShowMapMobile] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter listings based on search
  const filteredListings = useMemo(() => {
    let results = MOCK_LISTINGS;
    
    if (searchLocation) {
        results = results.filter(l => 
          l.location.city.toLowerCase().includes(searchLocation.toLowerCase()) || 
          l.location.state.toLowerCase().includes(searchLocation.toLowerCase()) ||
          l.title.toLowerCase().includes(searchLocation.toLowerCase())
        );
    }

    // Mock category filtering
    if (activeCategory === 'Medical') {
        results = results.filter(l => l.title.includes('Medical') || l.description?.includes('Hospital') || l.title.includes('Nurse'));
    } else if (activeCategory === 'Work') {
        results = results.filter(l => l.amenities.includes('Dedicated Workspace') || l.description?.includes('Office'));
    }

    return results;
  }, [searchLocation, activeCategory]);

  const handleSearch = () => {
    setIsSearchActive(true);
  };

  const handleClearSearch = () => {
    setSearchLocation('');
    setCheckIn('');
    setCheckOut('');
    setIsSearchActive(false);
    setActiveCategory('All');
  };

  // Generate deterministic "random" positions for the mock map based on ID
  const getMapPosition = (id: string) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const top = (hash * 17) % 70 + 15; // 15% to 85%
    const left = (hash * 23) % 70 + 15; // 15% to 85%
    return { top: `${top}%`, left: `${left}%` };
  };

  const categories = [
      { id: 'All', label: 'All Stays', icon: null },
      { id: 'Medical', label: 'Medical Pro', icon: Stethoscope },
      { id: 'Work', label: 'Remote Work', icon: Briefcase },
      { id: 'Pet', label: 'Pet Friendly', icon: Coffee }, // Using Coffee as placeholder for lifestyle
      { id: 'Parking', label: 'Parking', icon: Car },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Search Header */}
      <div className={`sticky top-16 z-30 bg-white border-b border-slate-200 shadow-sm transition-all duration-300 ${isSearchActive ? 'py-4 translate-y-0 opacity-100' : 'py-0 h-0 overflow-hidden border-none shadow-none -translate-y-4 opacity-0'}`}>
         {isSearchActive && (
             <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                 <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-shadow w-full md:w-auto">
                     <div className="flex items-center px-4 py-2 border-r border-slate-200">
                         <MapPin size={16} className="text-slate-500 mr-2 shrink-0" />
                         <input 
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                            placeholder="Location" 
                            className="bg-transparent text-sm outline-none w-full md:w-48 text-slate-900 font-medium placeholder-slate-400" 
                         />
                     </div>
                     <div className="hidden md:flex items-center px-4 py-2">
                         <Calendar size={16} className="text-slate-500 mr-2 shrink-0" />
                         <span className="text-sm text-slate-900 font-medium whitespace-nowrap">
                             {checkIn && checkOut ? `${new Date(checkIn).toLocaleDateString()} - ${new Date(checkOut).toLocaleDateString()}` : 'Any Week'}
                         </span>
                     </div>
                     <button onClick={handleSearch} className="bg-slate-900 text-white p-2.5 rounded-full hover:bg-slate-700 transition-colors">
                         <Search size={16} />
                     </button>
                 </div>
                 
                 <button onClick={handleClearSearch} className="hidden md:flex text-sm text-slate-500 hover:text-slate-900 items-center gap-1 font-medium px-4">
                     <X size={16} /> Close
                 </button>
             </div>
         )}
      </div>

      {!isSearchActive ? (
        <>
            {/* Hero Section */}
            <div className="bg-slate-50 border-b border-slate-200 py-16 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                     {/* Background Pattern */}
                     <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                </div>
                
                <div className="max-w-4xl mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                    Risk-Aware <br/> Mid-Term Rentals
                </h1>
                <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-light">
                    The neutral protocol for 30-180 day stays. Verified risk, structured agreements, and objective enforcement. 
                </p>
                
                {/* Main Search Bar */}
                <div className="bg-white p-2 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200 max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-2 relative z-20 transition-transform hover:scale-[1.01]">
                    <div className="flex-1 w-full md:w-auto flex items-center px-6 py-3 md:border-r border-slate-100 hover:bg-slate-50 rounded-full transition-colors cursor-text group relative">
                        <div className="text-left w-full">
                             <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-slate-700 transition-colors">Where</label>
                             <input 
                                type="text" 
                                placeholder="City, Zip, or Hospital" 
                                className="bg-transparent border-none outline-none w-full text-slate-900 placeholder-slate-400 font-semibold text-base truncate"
                                value={searchLocation}
                                onChange={(e) => setSearchLocation(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 w-full md:w-auto flex items-center px-6 py-3 md:border-r border-slate-100 hover:bg-slate-50 rounded-full transition-colors cursor-pointer group">
                        <div className="text-left w-full">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-slate-700 transition-colors">Move-In</label>
                            <input 
                                type="date" 
                                className="bg-transparent border-none outline-none w-full text-slate-900 text-sm font-semibold cursor-pointer"
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 w-full md:w-auto flex items-center px-6 py-3 hover:bg-slate-50 rounded-full transition-colors cursor-pointer group">
                        <div className="text-left w-full">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-slate-700 transition-colors">Move-Out</label>
                            <input 
                                type="date" 
                                className="bg-transparent border-none outline-none w-full text-slate-900 text-sm font-semibold cursor-pointer"
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleSearch}
                        className="w-full md:w-auto h-14 px-8 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
                    >
                        <Search size={20} /> <span className="md:hidden">Search</span>
                    </button>
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap justify-center gap-3 mt-8 relative z-20">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => { setActiveCategory(cat.id); if(cat.id !== 'All') setIsSearchActive(true); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                activeCategory === cat.id 
                                    ? 'bg-slate-900 text-white shadow-md' 
                                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            {cat.icon && <cat.icon size={14} />}
                            {cat.label}
                        </button>
                    ))}
                </div>

                </div>
            </div>

            {/* Featured Listings Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Verified Protocol Listings</h2>
                        <p className="text-slate-500 mt-1">Properties meeting strict compliance & safety standards.</p>
                    </div>
                    <button 
                        onClick={() => setIsSearchActive(true)}
                        className="text-slate-900 font-bold text-sm flex items-center gap-1 hover:underline group"
                    >
                        View all <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MOCK_LISTINGS.slice(0, 3).map(listing => (
                        <ListingCard 
                            key={listing.id} 
                            listing={listing} 
                            onClick={() => onSelectList(listing.id)}
                            isSaved={savedListingIds.includes(listing.id)}
                            onToggleSaved={onToggleSaved}
                        />
                    ))}
                </div>
            </div>

            {/* Value Props */}
            <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors backdrop-blur-sm">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/30 font-bold text-xl shadow-lg shadow-emerald-500/10">1</div>
                        <h3 className="font-bold text-white text-xl mb-3">Verified Risk Class</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">Deterministic risk classification based on identity, insurance, and affiliation. No more guessing who you are dealing with.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors backdrop-blur-sm">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-400/20 to-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/30 font-bold text-xl shadow-lg shadow-blue-500/10">2</div>
                        <h3 className="font-bold text-white text-xl mb-3">Truth Surface</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">An immutable, cryptographically signed snapshot of the entire deal. What you see is legally what you get.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors backdrop-blur-sm">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-400/20 to-purple-600/20 text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/30 font-bold text-xl shadow-lg shadow-purple-500/10">3</div>
                        <h3 className="font-bold text-white text-xl mb-3">Objective Trust Ledger</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">Build reputation through proven outcomes. No subjective star ratings, just factual history of compliance.</p>
                    </div>
                </div>
            </div>
        </>
      ) : (
        /* Split View: List + Map */
        <div className="flex flex-col h-[calc(100vh-130px)] md:flex-row overflow-hidden relative">
            {/* Left: Scrollable List */}
            <div className={`w-full md:w-3/5 lg:w-3/5 h-full overflow-y-auto bg-white border-r border-slate-200 ${showMapMobile ? 'hidden md:block' : 'block'}`}>
                <div className="p-4 md:p-6">
                    <div className="flex justify-between items-center mb-6">
                         <div>
                             <h2 className="text-xl font-bold text-slate-900">
                                 {filteredListings.length} {filteredListings.length === 1 ? 'Stay' : 'Stays'} {activeCategory !== 'All' ? `in ${activeCategory}` : ''} {searchLocation ? `near ${searchLocation}` : ''}
                             </h2>
                             {checkIn && checkOut && (
                                 <p className="text-sm text-slate-500">
                                     {new Date(checkIn).toLocaleDateString()} - {new Date(checkOut).toLocaleDateString()}
                                 </p>
                             )}
                         </div>
                         <div className="flex gap-2">
                             <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50">
                                 <Filter size={16} /> Filters
                             </button>
                         </div>
                    </div>

                    {/* Category Tabs in Search View */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                    activeCategory === cat.id 
                                        ? 'bg-slate-900 text-white border-slate-900' 
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20 md:pb-0">
                        {filteredListings.length > 0 ? (
                            filteredListings.map(listing => (
                                <div 
                                    key={listing.id} 
                                    onMouseEnter={() => setHoveredListingId(listing.id)}
                                    onMouseLeave={() => setHoveredListingId(null)}
                                >
                                    <ListingCard 
                                        listing={listing} 
                                        onClick={() => onSelectList(listing.id)}
                                        isSaved={savedListingIds.includes(listing.id)}
                                        onToggleSaved={onToggleSaved}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapIcon size={32} className="text-slate-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">No results found</h3>
                                <p className="text-slate-500">Try adjusting your location or dates.</p>
                                <button 
                                    onClick={handleClearSearch}
                                    className="mt-4 text-emerald-600 font-bold hover:underline"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Interactive Map */}
            <div className={`w-full md:w-2/5 lg:w-2/5 h-full bg-slate-100 relative overflow-hidden ${showMapMobile ? 'block' : 'hidden md:block'}`}>
                {/* Simulated Map Background */}
                <div 
                    className="absolute inset-0 opacity-50 grayscale transition-opacity duration-700 ease-in-out" 
                    style={{ 
                        backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: '#e2e8f0'
                    }}
                ></div>
                
                {/* Map Controls (Visual Only) */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                    <button className="bg-white p-2.5 rounded-lg shadow-md text-slate-600 hover:text-slate-900 hover:scale-105 transition-transform"><PlusIcon /></button>
                    <button className="bg-white p-2.5 rounded-lg shadow-md text-slate-600 hover:text-slate-900 hover:scale-105 transition-transform"><MinusIcon /></button>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-slate-200 text-xs font-bold text-slate-600 flex items-center gap-2 z-10 pointer-events-none whitespace-nowrap">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    </div>
                    Locations are approximate for privacy
                </div>

                {/* Map Markers */}
                {filteredListings.map(listing => {
                    const pos = getMapPosition(listing.id);
                    const isHovered = hoveredListingId === listing.id;

                    return (
                        <div 
                            key={listing.id}
                            className="absolute transition-all duration-500 ease-out cursor-pointer z-0 hover:z-20"
                            style={{ top: pos.top, left: pos.left }}
                            onClick={() => onSelectList(listing.id)}
                            onMouseEnter={() => setHoveredListingId(listing.id)}
                            onMouseLeave={() => setHoveredListingId(null)}
                        >
                            {/* Airbnb Style Price Marker */}
                            <div className={`
                                px-3 py-1.5 rounded-full shadow-md font-bold text-xs border transition-all duration-200 flex items-center gap-1
                                ${isHovered 
                                    ? 'bg-slate-900 text-white border-slate-900 scale-110 -translate-y-1' 
                                    : 'bg-white text-slate-900 border-slate-200 hover:scale-105'
                                }
                            `}>
                                ${listing.priceDisplay}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mobile Map Toggle Floating Button */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:hidden z-30">
                <button 
                    onClick={() => setShowMapMobile(!showMapMobile)}
                    className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
                >
                    {showMapMobile ? (
                        <><List size={18} /> Show List</>
                    ) : (
                        <><MapIcon size={18} /> Show Map</>
                    )}
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

// Simple icon helpers for the map
const PlusIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>;
const MinusIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>;

export default Home;
