'use client';

import React, { useState } from 'react';

const sections = [
  { id: 'acceptance', title: 'Acceptance of Terms', content: 'By accessing or using JamboLush, you agree to be bound by this Agreement and our Privacy Policy and Terms & Conditions.' },
  { id: 'use', title: 'Use of the Platform', content: 'You must create an account, provide accurate info, and are responsible for all activity through your account.' },
  { id: 'booking', title: 'Booking and Payments', content: 'Bookings are subject to availability. Payment methods: MoMo, MPesa, Debit/Credit Cards. Transactions are secure.' },
  { id: 'responsibilities', title: 'User Responsibilities', content: 'Do not misuse platform, respect others, follow property rules.' },
  { id: 'cancellation', title: 'Cancellation & Refund Policy', content: 'Refunds depend on property policies. JamboLush is not liable unless stated.' },
  { id: 'liability', title: 'Limitation of Liability', content: 'Platform provided "as is". JamboLush is not responsible for disputes but may assist.' },
  { id: 'modifications', title: 'Modifications', content: 'JamboLush may update this Agreement anytime. Continued use means acceptance.' },
  { id: 'law', title: 'Governing Law', content: 'Agreement governed under laws of the Republic of Rwanda.' },
];

const AgreementPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col sm:flex-row font-sans">
      
      {/* Sidebar */}
      <aside className="bg-[#083A85] text-white w-full sm:w-64 p-4 flex-shrink-0">
        <h2 className="text-lg font-bold mb-4">Agreement Sections</h2>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li
              key={section.id}
              className={`cursor-pointer px-3 py-2 rounded hover:bg-[#0652a3] transition-colors duration-200 ${
                activeSection === section.id ? 'bg-[#0652a3]' : ''
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.title}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 overflow-auto">
        {sections.map((section) =>
          activeSection === section.id ? (
            <section key={section.id} className="mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">{section.title}</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{section.content}</p>
            </section>
          ) : null
        )}

        {/* Agreement button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => alert('You have agreed to the terms!')}
            className="px-4 py-2 bg-[#F20C8F] text-white text-sm font-medium rounded-lg hover:bg-[#F20C8F]/90 transition-colors duration-300"
          >
            I Agree to the Terms
          </button>
        </div>
      </main>
    </div>
  );
};

export default AgreementPage;
