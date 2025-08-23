'use client';

import React, { useState, useRef, useEffect } from 'react';

const sections = [
  {
    id: 'Our Agreement',
    title: 'Jambolus Agreement',
    content: `This Agreement governs the relationship between JamboLush by Amoria Global Tech Ltd (Reg. No. 141275771) and any individual or entity using the JamboLush platform. By accessing or using our services, you agree to the following terms:`
  },
  {
    id: 'introduction',
    title: '1. Introduction',
    content: `This Agreement establishes the legal framework for using JamboLush’s platform and services.`
  },
  {
    id: 'definitions',
    title: '2. Definitions',
    content: `- Platform: JamboLush’s website, mobile application, and related systems.
- Host: A property or service provider listing on the platform.
- Guest: A user booking a property or service.
- Tour Operator: A business providing travel or tour-related services.
- Field Agent: A local representative assisting in property verification and onboarding.
- Partner: Any authorized third-party collaborator.
- Approved Payment Gateway: Officially integrated payment service providers.`
  },
  {
    id: 'scope',
    title: '3. Scope',
    content: `This Agreement covers account creation, listings, bookings, payments, cancellations, conduct, and compliance obligations for all users.`
  },
  {
    id: 'registration',
    title: '4. Registration',
    content: `Users must be at least 18 years old and provide accurate, verifiable information.`
  },
  {
    id: 'listings',
    title: '5. Listings & Bookings',
    content: `- Hosts and Operators must ensure that listings are accurate and lawful.
- Guests must comply with property or service rules during their stay or activity.`
  },
  {
    id: 'payments',
    title: '6. Payments',
    content: `- All transactions must be processed through Approved Payment Gateways.
- JamboLush applies service fees and commissions as disclosed at booking.
- Off-platform payments to bypass JamboLush fees are prohibited.`
  },
  {
    id: 'cancellations',
    title: '7. Cancellations & Refunds',
    content: `Cancellations follow the Minimum Refund Policy displayed on each listing.`
  },
  {
    id: 'fieldagents',
    title: '8. Field Agent Services',
    content: `Field Agents assist with property onboarding, verification, and local support. They must act professionally, ethically, and maintain confidentiality.`
  },
  {
    id: 'conduct',
    title: '9. User Conduct',
    content: `Fraudulent, illegal, abusive, or discriminatory activity is strictly prohibited.`
  },
  {
    id: 'privacy',
    title: '10. Data Privacy',
    content: `JamboLush complies with Rwanda’s data protection framework, GDPR (Europe), CCPA (California), and other applicable international data privacy laws.`
  },
  {
    id: 'liability',
    title: '11. Liability & Indemnification',
    content: `- JamboLush acts as an intermediary, not the provider of listed services.
- Hosts and Operators remain fully responsible for service delivery and must hold appropriate insurance.
- To the fullest extent permitted by law, JamboLush limits liability for indirect, incidental, or consequential damages.
- Users agree to indemnify JamboLush against losses from misuse of the platform.`
  },
  {
    id: 'force',
    title: '12. Force Majeure',
    content: `Neither party is liable for delays or failures caused by events outside reasonable control (e.g., natural disasters, pandemics, strikes, or internet outages).`
  },
  {
    id: 'disputes',
    title: '13. Dispute Resolution',
    content: `- All disputes must first be addressed through good-faith internal mediation.
- If unresolved, disputes will be referred to the Arbitration Center of Rwanda (ACR) in Kigali, Rwanda.
- The decision of the arbitration panel is final and binding.`
  },
  {
    id: 'law',
    title: '14. Governing Law',
    content: `This Agreement is governed by the laws of Rwanda, aligned with international commercial principles.`
  },
  {
    id: 'intellectual',
    title: '15. Intellectual Property',
    content: `All JamboLush trademarks, logos, software, and content are legally protected. Unauthorized use is prohibited.`
  },
  {
    id: 'modifications',
    title: '16. Modifications',
    content: `JamboLush may update this Agreement with 30 days’ notice before changes take effect.`
  },
  {
    id: 'antidiscrimination',
    title: '17. Anti-Discrimination',
    content: `Discrimination based on race, religion, gender, disability, or any other protected status is strictly forbidden.`
  },
  {
    id: 'termination',
    title: '18. Termination',
    content: `Either JamboLush or the user may terminate this Agreement with reasonable notice.`
  },
  {
    id: 'security',
    title: '19. Security & Fraud Protection',
    content: `JamboLush maintains industry-standard security measures (SSL, PCI DSS compliance, fraud monitoring). Users must also safeguard their accounts.`
  },
 
];

const AgreementPage: React.FC = () => {
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
      // Enable button when scrolled to the very bottom
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setButtonEnabled(true);
      } else {
        setButtonEnabled(false);
      }
    };
    const current = mainRef.current;
    if (current) {
      current.addEventListener('scroll', handleScroll);
    }
    return () => {
      current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col sm:flex-row font-sans">
      {/* Mobile Top Bar */}
      <div className="sm:hidden flex justify-between items-center bg-[#0C2D62] text-white p-4 fixed top-16 left-0 right-0 z-10">
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
          sm:static sm:translate-x-0 sm:opacity-100 sm:scale-100 sm:pointer-events-auto sm:w-64 sm:mt-8 sm:ml-8 sm:mb-8 sm:rounded-xl sm:shadow-lg sm:h-auto`}
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
                hover:bg-[#F20C8F] hover:text-white"
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
        className="flex-1 overflow-auto p-6 sm:p-8 bg-white rounded-xl shadow-lg mt-32 sm:mt-8 sm:mr-8 sm:mb-8 font-sans text-sm sm:text-base leading-relaxed"
        style={{ maxHeight: 'calc(100vh - 4rem)' }}
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

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => alert('You have agreed to the terms!')}
            disabled={!buttonEnabled}
            className={`px-4 py-2 bg-[#F20C8F] text-white text-sm sm:text-base font-medium rounded-lg transition-colors duration-300 ${
              buttonEnabled ? 'hover:bg-[#F20C8F]/90' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            I Agree to the Terms
          </button>
        </div>
      </main>
    </div>
  );
};

export default AgreementPage;