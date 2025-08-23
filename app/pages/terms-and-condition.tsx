'use client';

import React, { useState, useRef, useEffect } from 'react';

const sections = [
  {
    id: 'welcome',
    title: 'Welcome',
    content: `Last Updated: 01 September, 2025

These Terms and Conditions govern your access to and use of the Jambolush platform, including our website, mobile application, and related services. By creating an account, listing a property or tourism service, booking a stay, purchasing an experience, or otherwise using Jambolush, you agree to be bound by these Terms. If you do not agree, you may not use the Platform.`
  },
  {
    id: 'definitions',
    title: '1. Definitions',
    content: `1.Platform : The Jambolush website, mobile application, and related tools or systems.
2.Host : A person or business listing a property on the Platform.
3.Tour Operator : A provider offering tourism-related services such as tours or activities.
4.Guest / Traveler : A person booking or purchasing services via the Platform.
5.Field Agent : An authorized representative verifying listings and supporting service providers.
6.User : Any person or entity using the Platform.
7.Content : Any text, photos, videos, reviews, or materials uploaded by a User.`
  },
  {
    id: 'scope',
    title: '2. Scope of Services',
    content: `Jambolush is a marketplace that connects travelers with property and tourism service providers. We do not own, operate, or manage the services listed.`
  },
  {
    id: 'accounts',
    title: '3. Account Registration',
    content: `Users must register to list, book, or manage services, providing accurate and up-to-date details. Users are responsible for safeguarding login credentials and preventing unauthorized use.`
  },
  {
    id: 'hosts',
    title: '4. Host & Tour Operator Obligations',
    content: `Hosts and Tour Operators must:
1. Ensure listings are accurate and current.
2. Operate lawfully and safely.
3. Comply with permits, tax requirements, and booking commitments.
4. Pay applicable Jambolush service fees.`
  },
  {
    id: 'guests',
    title: '5. Guest & Traveler Obligations',
    content: `Guests and Travelers must:
1. Provide correct booking information.
2. Respect property rules, tour guidelines, and laws.
3. Avoid damaging property or disrupting services.`
  },
  {
    id: 'payments',
    title: '6. Payments & Fees',
    content: `1.Payments must be processed via Jambolush’s approved payment gateways.
2. Direct payments between users to avoid platform fees are prohibited.
3. Funds may be held in the gateway until completion of service.
4. Taxes are the responsibility of the earning party.`
  },
  {
    id: 'cancellations',
    title: '7. Cancellations & Refunds',
    content: `1.Hosts and Tour Operators must display their cancellation and refund terms.
2.Platform fees are non-refundable unless stated otherwise.
3.Jambolush may cancel bookings for fraud, safety, or service failure, and may issue refunds accordingly.`
  },
  {
    id: 'policies',
    title: '8. Policies',
    content: `Jambolush maintains separate policy documents that form part of this agreement, including:
1. Privacy & Data Protection Policy
2. Anti-Discrimination & Inclusion Policy
3. Field Agent Policy
4. Content & Listing Policy
5. Security Policy
6. Prohibited Activities Policy`
  },
  {
    id: 'intellectual',
    title: '9. Intellectual Property',
    content: `All intellectual property rights in the Platform are owned by or licensed to Jambolush. Unauthorized use is prohibited.`
  },
  {
    id: 'indemnity',
    title: '10. Indemnity',
    content: `You agree to indemnify and hold harmless Jambolush, its affiliates, and staff from any claims, damages, or costs arising from your use of the Platform or breach of these Terms.`
  },
  {
    id: 'accessibility',
    title: '11. Accessibility Commitment',
    content: `Jambolush works to meet recognized accessibility standards and continuously improves the Platform for users with disabilities.`
  },
  {
    id: 'force-majeure',
    title: '12. Force Majeure',
    content: `Jambolush is not responsible for delays or failures caused by events outside our control, such as natural disasters, pandemics, or government actions.`
  },
  {
    id: 'third party',
    title: '13. Third Party Services',
    content: `While Jambolush integrates with third party tools like payment processors, we are not liable for their performance or policies.`
  },
  {
    id: 'changes',
    title: '14. Changes to the Platform',
    content: `We may update or remove features for legal or functional reasons. Major changes will be communicated via email or app notifications.`
  },
  {
    id: 'liability',
    title: '15. Limitation of Liability',
    content: `To the fullest extent allowed by law, our total liability is capped at the total service fees you paid us in the last 12 months.`
  },
  {
    id: 'dispute',
    title: '16. Dispute Resolution',
    content: `1. Negotiation: Parties will attempt good faith resolution within 30 days.
2. Mediation: If unresolved, disputes proceed to mediation in Kigali, Rwanda.
3. Arbitration: If mediation fails, disputes are resolved by binding arbitration in Kigali under English language proceedings.
4. Costs: Unless otherwise agreed, each party covers its own costs.`
  },
  {
    id: 'law',
    title: '17. Governing Law',
    content: `These Terms are governed by the laws of the Republic of Rwanda.`
  },
  {
    id: 'language',
    title: '18. Governing Language',
    content: `These Terms are drafted in English. Translations are for convenience only. The English version prevails in disputes.`
  },
  {
    id: 'compliance',
    title: '19. Global Compliance Statement',
    content: `Jambolush aims to comply with international legal standards, including GDPR, CCPA, and applicable African data protection regulations.`
  },
  {
    id: 'acceptance',
    title: '20. Digital Acceptance',
    content: `By creating an account, clicking “I Agree,” or using the Platform, you acknowledge that you have read, understood, and agreed to these Terms.`
  },
  {
    id: 'entire',
    title: '21. Entire Agreement',
    content: `These Terms supersede all previous agreements between you and Jambolush.`
  },
];

const TermsAndConditionsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scrollToSection = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!mainRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = mainRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setButtonEnabled(true);
      }
    };
    const current = mainRef.current;
    if (current) current.addEventListener('scroll', handleScroll);
    return () => current?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col sm:flex-row font-sans">

      {/* Mobile Top Bar */}
      <div className="sm:hidden flex justify-between items-center bg-[#0C2D62] text-white p-4 fixed top-15 left-5 right-5 z-10">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white text-2xl font-bold"
        >
          ☰
        </button>
        <h2 className="text-lg font-semibold">Sections</h2>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-[#0C2D62] text-white w-[90%] max-w-sm p-4 flex-shrink-0
          mt-20 mb-5 rounded-xl shadow-lg
          fixed top-0 left-1/2 -translate-x-1/2 h-[85%] z-20 overflow-y-auto
          transform transition-transform duration-300
          ${sidebarOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
          sm:static sm:translate-x-0 sm:opacity-100 sm:scale-100 sm:pointer-events-auto sm:w-64 sm:mt-13 sm:rounded-none sm:shadow-none sm:ml-12`}
      >
        <div className="flex justify-between items-center mb-4 sm:hidden">
          <h2 className="text-lg font-semibold">Sections</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white text-2xl font-bold hover:text-pink-400"
          >
            ✕
          </button>
        </div>

        <ul className="space-y-2 text-sm sm:text-base">
          {sections.map((section) => (
            <li
              key={section.id}
              className="cursor-pointer px-3 py-2 rounded transition-colors duration-200
                hover:bg-pink-600 hover:text-white"
              onClick={() => scrollToSection(section.id)}
            >
              {section.title}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main
        ref={mainRef}
        className="flex-1 overflow-auto p-6 sm:p-8 bg-white rounded-xl shadow-lg mt-24 sm:mt-8 text-sm sm:text-base leading-relaxed"
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        {sections.map((section) => (
          <section
            key={section.id}
            ref={(el) => { sectionRefs.current[section.id] = el as HTMLDivElement | null }}
            className="mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-3">{section.title}</h2>
            <p className="text-gray-700 font-normal whitespace-pre-wrap">{section.content}</p>
          </section>
        ))}

        {/* Agreement button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => alert('You have agreed to the terms!')}
            className={`px-4 py-2 bg-[#F20C8F] text-white text-sm sm:text-base font-medium rounded-lg transition-colors duration-300 cursor-pointer ${
              buttonEnabled ? 'hover:bg-[#F20C8F]/90' : 'opacity-50'
            }`}
          >
            I Agree to the Terms and Conditions
          </button>
        </div>
      </main>
    </div>
  );
};

export default TermsAndConditionsPage;