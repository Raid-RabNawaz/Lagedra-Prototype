
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RoleSwitcher from './components/RoleSwitcher';
import Unauthorized from './components/Unauthorized';
import Home from './pages/Home';
import ListingDetails from './pages/ListingDetails';
import TenantDashboard from './pages/TenantDashboard';
import LandlordDashboard from './pages/LandlordDashboard';
import ArbitratorDashboard from './pages/ArbitratorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { MOCK_LISTINGS, MOCK_INQUIRIES, MOCK_USER_TENANT } from './constants';
import { UserRole, Inquiry } from './types';
import { ToastProvider } from './components/ToastProvider';

const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('tenant');
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES);
  
  // State for Saved Listings (Favorites)
  const [savedListingIds, setSavedListingIds] = useState<string[]>(MOCK_USER_TENANT.savedListingIds || []);

  // RBAC Permission Matrix
  const PAGE_PERMISSIONS: Record<string, UserRole[]> = {
    'home': ['tenant', 'landlord', 'arbitrator', 'admin'],
    'listing': ['tenant', 'landlord', 'arbitrator', 'admin'],
    'tenant': ['tenant'],
    'landlord': ['landlord'],
    'arbitrator': ['arbitrator'],
    'admin': ['admin']
  };

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSelectListing = (id: string) => {
    setSelectedListingId(id);
    navigateTo('listing');
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    
    // Check if the new role is allowed on the current page
    const allowedRoles = PAGE_PERMISSIONS[currentPage] || [];
    const isAllowed = allowedRoles.includes(role);

    // If not allowed, redirect to the default dashboard for that role
    if (!isAllowed) {
      if (role === 'arbitrator') navigateTo('arbitrator');
      else if (role === 'admin') navigateTo('admin');
      else if (role === 'landlord') navigateTo('landlord');
      else if (role === 'tenant') navigateTo('tenant');
      else navigateTo('home');
    }
  };

  const handleSendInquiry = (listingId: string, topic: string, question: string) => {
    const newInquiry: Inquiry = {
      id: Math.random().toString(36).substr(2, 9),
      listingId,
      tenantId: MOCK_USER_TENANT.id,
      tenantName: MOCK_USER_TENANT.name,
      topic,
      question,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    setInquiries([...inquiries, newInquiry]);
  };

  const handleAnswerInquiry = (inquiryId: string, answer: string) => {
    setInquiries(inquiries.map(inq => 
      inq.id === inquiryId 
        ? { ...inq, answer, status: 'answered', timestamp: new Date().toISOString() } 
        : inq
    ));
  };

  const toggleSaved = (id: string) => {
    setSavedListingIds(prev => 
      prev.includes(id) 
        ? prev.filter(savedId => savedId !== id) 
        : [...prev, id]
    );
  };

  const renderContent = () => {
    // Strict Access Control Check
    const allowedRoles = PAGE_PERMISSIONS[currentPage] || [];
    if (!allowedRoles.includes(currentRole)) {
      return <Unauthorized onGoHome={() => navigateTo('home')} />;
    }

    switch (currentPage) {
      case 'home':
        return <Home 
                  onSelectList={handleSelectListing} 
                  savedListingIds={savedListingIds}
                  onToggleSaved={toggleSaved}
               />;
      case 'listing':
        const listing = MOCK_LISTINGS.find(l => l.id === selectedListingId);
        if (!listing) return <Home onSelectList={handleSelectListing} savedListingIds={savedListingIds} onToggleSaved={toggleSaved} />;
        return <ListingDetails 
                  listing={listing} 
                  onNavigate={navigateTo} 
                  currentRole={currentRole} 
                  inquiries={inquiries}
                  onSendInquiry={handleSendInquiry}
                  isSaved={savedListingIds.includes(listing.id)}
                  onToggleSaved={() => toggleSaved(listing.id)}
               />;
      case 'tenant':
        return <TenantDashboard 
                  savedListingIds={savedListingIds}
                  onToggleSaved={toggleSaved}
                  listings={MOCK_LISTINGS}
                  onSelectList={handleSelectListing}
               />;
      case 'landlord':
        return <LandlordDashboard 
                  inquiries={inquiries} 
                  onAnswerInquiry={handleAnswerInquiry} 
               />;
      case 'arbitrator':
        return <ArbitratorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Home onSelectList={handleSelectListing} savedListingIds={savedListingIds} onToggleSaved={toggleSaved} />;
    }
  };

  return (
    <ToastProvider>
      <div className="flex flex-col min-h-screen bg-slate-50/50 text-slate-900 font-sans">
        <RoleSwitcher currentRole={currentRole} onRoleChange={handleRoleChange} />
        <Navbar currentPage={currentPage} onNavigate={navigateTo} currentRole={currentRole} />
        <main className="flex-grow">
          {renderContent()}
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
};

export default App;
