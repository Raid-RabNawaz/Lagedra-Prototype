import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-white font-semibold mb-4">Lagedra Protocol</h4>
            <p className="text-sm leading-relaxed">
              A defensible enforcement layer for mid-term rentals. We are not a property manager, 
              payments processor, or social reviews platform. We provide risk infrastructure.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Risk & Trust</h4>
            <ul className="text-sm space-y-2">
                <li>Verification Class V1</li>
                <li>Objective Trust Ledger</li>
                <li>Truth Surface Engine</li>
                <li>Arbitration Protocol</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal & Compliance</h4>
            <p className="text-xs leading-relaxed">
              Lagedra does not provide legal, financial, or insurance advice. 
              Insurance verification is a read-only check of data provided by third parties. 
              The Platform is not responsible for deposit handling.
            </p>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-xs">
          &copy; {new Date().getFullYear()} Lagedra Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;