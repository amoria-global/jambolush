'use client';

import React, { useState, useRef, useEffect } from 'react';

const sections = [
  {
    id: 'Our Agreement',
    title: 'JamboLush Agreement',
    content: `This Agreement sets the rules for the relationship between JamboLush, operated by Amoria Global Tech Ltd (Registration No. 141275771), and anyone who uses the JamboLush platform. By accessing or using the platform and its services, you are agreeing to follow these terms as the basis of your use of JamboLush.`
  },
  {
    id: 'introduction',
    title: '1. Introduction',
    content: `This Agreement provides the legal foundation that governs how you use JamboLush’s platform and services, making clear the rights and responsibilities between you and JamboLush.`
  },
  {
    id: 'definitions',
    title: '2. Definitions',
    content: `- Platform: Refers to JamboLush’s website, mobile application, and all related systems used to provide services.
- Host: A property owner or service provider who lists their accommodation or service on the platform.
- Guest: A user who books or uses a property or service through the platform.
- Tour Operator: A business that offers travel or tour-related services available for booking on the platform.
- Field Agent: A trusted local representative who helps with property verification and onboarding of service providers.
- Partner: Any authorized third-party collaborator working with JamboLush to support its services.
- Approved Payment Gateway: Secure and officially integrated payment service providers used to process transactions on the platform.`
  },
  {
    id: 'scope',
    title: '3. Scope',
    content: `This Agreement applies to all users of JamboLush and sets the rules for key activities on the platform, including creating accounts, posting and managing listings, making and handling bookings, processing payments, managing cancellations, ensuring proper conduct, and meeting compliance obligations.`
  },
  {
    id: 'registration',
    title: '4. Registration',
    content: `All users of JamboLush must be at least 18 years old and are required to provide accurate and verifiable information when creating an account or using the platform.`
  },
  {
    id: 'listings',
    title: '5. Listings & Bookings',
    content: `- Hosts and Operators: Are responsible for making sure that all listings they post are accurate, truthful, and comply with the law.
- Guests: Must follow the property rules or service guidelines during their stay or participation in any activity.`
  },
  {
    id: 'payments',
    title: '6. Payments',
    content: `- All transactions: Must be completed through JamboLush’s Approved Payment Gateways to ensure secure and traceable payments.
- Service fees and commissions: Are applied by JamboLush and clearly shown at the time of booking.
- Off-platform payments: To avoid JamboLush’s fees are strictly prohibited and not allowed under this Agreement.`
  },
  {
    id: 'cancellations',
    title: '7. Cancellations & Refunds',
    content: `All cancellations are subject to the Minimum Refund Policy shown on each listing, meaning that refunds will be handled according to the specific terms provided by the Host or Operator at the time of booking.`
  },
  {
    id: 'fieldagents',
    title: '8. Field Agent Services',
    content: `Field Agents play a key role in supporting the JamboLush platform by assisting with property onboarding, verifying the accuracy and legitimacy of listings, and providing local support to Hosts and Guests. They are expected to conduct themselves with the highest level of professionalism and ethical standards, ensuring that their actions do not compromise the integrity of the platform. Additionally, Field Agents must maintain strict confidentiality regarding any sensitive information they access during their work, protecting the privacy of users and the security of property data at all times.`
  },
  {
    id: 'conduct',
    title: '9. User Conduct',
    content: `Any activity that is fraudulent, illegal, abusive, or discriminatory is strictly forbidden on the JamboLush platform. Users must act honestly, follow the law, treat others respectfully, and avoid any behavior that could harm the platform or its community.`
  },
  {
    id: 'privacy',
    title: '10. Data Privacy',
    content: `JamboLush fully complies with Rwanda’s data protection framework, as well as key international privacy standards such as the European Union’s GDPR and California’s CCPA, along with any other relevant data privacy laws that apply. This ensures that all personal data collected, stored, or processed through the platform is handled responsibly, securely, and transparently. Users’ rights to access, correct, delete, or restrict their personal information are respected, and JamboLush implements technical and organizational measures to protect data against unauthorized access, loss, or misuse. By adhering to these regulations, the platform demonstrates a commitment to privacy, accountability, and lawful management of user information across all regions where it operates.`
  },
  {
    id: 'liability',
    title: '11. Liability & Indemnification',
    content: `- Intermediary role: JamboLush serves solely as a platform that connects users with Hosts, Tour Operators, and other service providers. The platform itself does not own, operate, or control the services listed, meaning that JamboLush is not responsible for the quality, safety, or availability of any service.
- Host and Operator responsibility: Hosts and Operators remain fully accountable for delivering their services as advertised. They must ensure compliance with all applicable laws, regulations, and safety standards, and are required to maintain appropriate insurance to cover potential risks or liabilities related to their services.
- Limitation of liability: To the fullest extent permitted by law, JamboLush limits its liability for any indirect, incidental, or consequential damages, including losses related to bookings, cancellations, or service failures. This means that the platform is not responsible for certain types of damages or losses that may occur while using the service.
- User indemnification: Users agree to indemnify, defend, and hold harmless JamboLush, its affiliates, and staff from any claims, losses, damages, or expenses that arise from their misuse of the platform, violations of the Terms or Agreements, or unlawful actions while using the platform. This protects JamboLush from being held liable for user-caused issues.`
  },
  {
    id: 'force',
    title: '12. Force Majeure',
    content: `Neither JamboLush nor its users will be held responsible for delays, interruptions, or failures that result from events beyond reasonable control, such as natural disasters, pandemics, labor strikes, or internet and technical outages. These circumstances are considered unavoidable, and both parties acknowledge that such events may temporarily affect service availability or performance.`
  },
  {
    id: 'disputes',
    title: '13. Dispute Resolution',
    content: `- Internal mediation: Any dispute arising from the use of JamboLush or interpretation of this Agreement must first be addressed through sincere, good-faith efforts at internal mediation. Both parties are expected to communicate openly and attempt to reach a mutually acceptable resolution before escalating the matter.
- Arbitration: If the dispute cannot be resolved through mediation within a reasonable timeframe, it will be formally referred to the Arbitration Center of Rwanda (ACR) in Kigali. The arbitration process will be conducted according to the center’s rules, ensuring a structured and fair resolution process.
- Final and binding decision: The outcome of the arbitration is final and binding on all parties. This means that once the arbitration panel makes a decision, it must be accepted, enforced, and cannot be appealed, providing a definitive resolution to the dispute.`
  },
  {
    id: 'law',
    title: '14. Governing Law',
    content: `This Agreement is governed by the laws of the Republic of Rwanda, meaning that any legal matters or disputes arising from it will be interpreted and resolved according to Rwandan law. It is also aligned with recognized international commercial principles to ensure consistency with global business standards.`
  },
  {
    id: 'intellectual',
    title: '15. Intellectual Property',
    content: `All trademarks, logos, software, and content owned by JamboLush are legally protected. Users are not allowed to copy, use, modify, or distribute any of these materials without explicit permission, ensuring that JamboLush retains full control over its intellectual property.`
  },
  {
    id: 'modifications',
    title: '16. Modifications',
    content: `JamboLush may update or modify this Agreement from time to time to reflect changes in the platform, legal requirements, or business practices. Users will be given at least 30 days’ notice before any changes take effect, typically through email or app notifications. During this period, users have the opportunity to review the updated terms and decide whether to continue using the platform. Continued use of JamboLush after the notice period constitutes acceptance of the revised Agreement. This process ensures transparency and keeps users informed of their rights and obligations under the platform’s current rules.`
  },
  {
    id: 'antidiscrimination',
    title: '17. Anti-Discrimination',
    content: `JamboLush strictly prohibits any form of discrimination based on race, religion, gender, disability, or any other protected characteristic. All users, Hosts, Tour Operators, and Field Agents are expected to treat others with fairness and respect, ensuring an inclusive and equitable environment on the platform.`
  },
  {
    id: 'termination',
    title: '18. Termination',
    content: `Either JamboLush or the user can end this Agreement at any time by providing reasonable notice. Termination ends the rights and obligations under the Agreement, but any actions or responsibilities incurred before termination, such as payments or completed bookings, must still be honored.`
  },
  {
    id: 'security',
    title: '19. Security & Fraud Protection',
    content: `JamboLush implements robust, industry-standard security measures to protect user data and ensure safe transactions. This includes SSL encryption to secure data in transit, PCI DSS compliance to protect payment information, and continuous fraud monitoring to detect and prevent suspicious activity. In addition to these protections, users are responsible for maintaining the security of their own accounts, which includes using strong passwords, keeping login credentials confidential, and promptly reporting any unauthorized access. Together, these measures help safeguard both the platform and its users against security threats and misuse.`
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
        className={`bg-[#0C2D62] text-white pt-6 sm:pt-2 w-[90%] max-w-sm p-4 flex-shrink-0
          mt-20 mb-5 rounded-xl shadow-lg
          fixed top-0 left-1/2 -translate-x-1/2 h-[85%] z-20 overflow-y-auto
          transform transition-transform duration-300
          ${sidebarOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
          sm:static sm:translate-x-0 sm:opacity-100 sm:scale-100 sm:pointer-events-auto sm:w-64 sm:mt-23 sm:ml-8 sm:mb-8 sm:rounded-xl sm:shadow-lg sm:h-auto`}
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

        <ul className="space-y-2 text-lg sm:text-lg">
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
        className="flex-1 overflow-auto p-6 sm:p-8 bg-white rounded-xl shadow-lg mt-32 sm:mt-23 sm:mr-8 sm:mb-8 font-sans text-lg sm:text-lg leading-relaxed"
        style={{ maxHeight: 'calc(100vh - 4rem)' }}
      >
        {sections.map((section) => (
          <section
            key={section.id}
            ref={(el) => { sectionRefs.current[section.id] = el as HTMLDivElement | null }}
            className="mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#0C2D62] mb-3">{section.title}</h2>
            <p className="text-gray-700 font-normal whitespace-pre-wrap">{section.content}</p>
          </section>
        ))}

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => alert('You have agreed to the terms!')}
            disabled={!buttonEnabled}
            className={`px-4 py-2 bg-[#F20C8F] cursor-pointer text-white text-lg sm:text-lg font-medium rounded-lg transition-colors duration-300 ${
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