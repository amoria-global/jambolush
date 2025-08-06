'use client';

import React from 'react';

// This is a simple agreement page component.
// It displays terms and conditions with a button to agree.
const AgreementPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 font-sans">
      {/* Tailwind CSS CDN is included for standalone use */}
      <script src="https://cdn.tailwindcss.com"></script>
      
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">JamboLush User Agreement</h1>
        
        {/* Scrollable content area for the agreement text */}
        <div className="h-[500px] overflow-y-auto pr-4 mb-6 border-b pb-6 text-gray-700 leading-relaxed">
          <p className="mb-4">
            By accessing or using JamboLush, you agree to be bound by this Agreement and our Privacy Policy and Terms & Conditions. If you do not agree, you may not use the platform.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using JamboLush, you agree to be bound by this Agreement and our Privacy Policy and Terms & Conditions. If you do not agree, you may not use the platform.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">2. Use of the Platform</h2>
          <ul className="list-disc list-inside mb-4 space-y-2 pl-4">
            <li>You must create an account to book or reserve any property or spot.</li>
            <li>You agree to provide accurate, current, and complete information during the registration and booking process.</li>
            <li>You are solely responsible for any activity conducted through your account.</li>
          </ul>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">3. Booking and Payments</h2>
          <ul className="list-disc list-inside mb-4 space-y-2 pl-4">
            <li>Bookings made through JamboLush are subject to availability and approval by the property owner.</li>
            <li>Payment must be made using one of the accepted methods: Mobile Money (MoMo), MPesa, or Debit/Credit Card (Visa, Mastercard).</li>
            <li>JamboLush does not store or handle sensitive card information. All transactions are securely processed.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">4. User Responsibilities</h2>
          <ul className="list-disc list-inside mb-4 space-y-2 pl-4">
            <li>You agree not to misuse the platform, upload false property data, or engage in fraudulent activity.</li>
            <li>You will treat property owners and other users respectfully and comply with the rules of each listed property.</li>
          </ul>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">5. Cancellation & Refund Policy</h2>
          <ul className="list-disc list-inside mb-4 space-y-2 pl-4">
            <li>Cancellations are subject to each property's individual refund policy.</li>
            <li>JamboLush is not liable for refunds unless stated in our booking terms.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">6. Limitation of Liability</h2>
          <p className="mb-4">
            JamboLush provides the platform “as is” and does not guarantee uninterrupted service. We are not responsible for disputes between users and property owners but may assist in resolution when possible.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">7. Modifications to the Agreement</h2>
          <p className="mb-4">
            JamboLush reserves the right to modify this Agreement at any time. Updates will be posted, and continued use of the platform signifies acceptance of the revised terms.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">8. Governing Law</h2>
          <p>
            This Agreement shall be governed in accordance with the laws of the Republic of Rwanda.
          </p>
        </div>
        
        {/* Agreement button */}
        <div className="flex justify-center">
        <button 
                 onClick={() => alert("You have agreed to the terms!")}
                 className="px-4 py-2 bg-[#F20C8F] text-white text-sm font-medium rounded-lg hover:bg-[#F20C8F]/90 transition-colors duration-300">
               I Agree to the Terms
            </button>
 </div>
      </div>
    </div>
  );
};

export default AgreementPage;
