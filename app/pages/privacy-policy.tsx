'use client';

import React, { useState, useRef } from 'react';

type Section =
  | {
      id: string;
      title: string;
      content: string;
      isContact?: false;
    }
  | {
      id: string;
      title: string;
      content: never;
      isContact: true;
    };

const sections: Section[] = [
  {
    id: 'scope',
    title: '1. Scope',
    content: `This policy applies to all users of the JamboLush platform, including guests, hosts, and field agents.\n\nIt governs all personal data collected via our website, mobile applications, and third-party integrations, regardless of the user's location.`,
  },
  {
    id: 'lawful-basis',
    title: '2. Lawful Basis for Processing',
    content: `We process personal data only when permitted by law, including:\n- Consent: where you explicitly agree to processing (e.g., marketing, cookies);\n- Contract: where processing is necessary to fulfill bookings and payments;\n- Legal obligation: where we must comply with tax, financial, or regulatory duties;\n- Legitimate interest: where processing supports platform security, fraud prevention, or service improvement.`,
  },
  {
    id: 'data-collected',
    title: '3. Categories of Data Collected',
    content: `We may collect and process the following personal data:\n- Identification data (name, ID number, passport, and other government supporting documents);\n- Contact details (email, phone, address);\n- Payment details (processed securely via third-party providers);\n- Booking and transaction history;\n- Device and location information;\n- Photos, videos, or documents submitted for property verification;\n- Cookies and tracking data (analytics, preferences, advertising, if applicable).`,
  },
  {
    id: 'data-subject-rights',
    title: '4. Rights of Data Subjects',
    content: `Under GDPR, Rwanda's Law No. 058/2021, and other international privacy standards, you have the right to:\n- Access the personal data we hold about you;\n- Request corrections or updates;\n- Request deletion ("right to be forgotten");\n- Restrict or object to processing;\n- Request portability of your data;\n- Withdraw consent at any time;\n- Lodge a complaint with the Rwanda National Cyber Security Authority (NCSA) or your local data protection authority in the EU.`,
  },
  {
    id: 'data-sharing',
    title: '5. Data Sharing and Cross-Border Transfers',
    content: `We do not sell your personal data. We may share personal data with:\n- Payment processors and financial institutions to complete transactions;\n- Verified field agents for property verification;\n- Hosting providers, analytics services, and customer support partners;\n- Regulatory or government authorities where legally required.\n\nFor cross-border transfers outside Rwanda or the European Economic Area (EEA), we use:\n- Adequacy decisions recognized by regulators;\n- Standard Contractual Clauses (SCCs);\n- Explicit consent from users.`,
  },
  {
    id: 'data-security',
    title: '6. Data Security',
    content: `We adopt appropriate technical and organizational measures to safeguard data, including:\n- Encryption (TLS for transmission, AES-256 for storage);\n- Role-based access control and least-privilege principles;\n- Regular penetration testing and security audits;\n- Incident response and breach notification procedures.`,
  },
  {
    id: 'data-retention',
    title: '7. Data Retention',
    content: `We retain personal data only as long as necessary for business and legal purposes:\n- Booking and tax records: up to 7 years;\n- Marketing and communication data: until you withdraw consent;\n- Account-related data: deleted upon account closure, unless retention is legally required.`,
  },
  {
    id: 'childrens-data',
    title: '8. Children’s Data',
    content: `JamboLush does not knowingly collect personal data from children under the age of 16 without parental consent. If we discover that we have inadvertently collected such data, we will delete it promptly. Parents or guardians who believe their child has provided data may contact us to request deletion.`,
  },
  {
    id: 'breach-notification',
    title: '9. Breach Notification',
    content: `In the event of a personal data breach, JamboLush will notify the National Cyber Security Authority (NCSA) of Rwanda, the relevant EU supervisory authority (if applicable), and affected users without undue delay.`,
  },
  {
    id: 'regulatory-registration',
    title: '10. Regulatory Registration',
    content: `JamboLush is registered with the National Cyber Security Authority (NCSA) of Rwanda as a data controller. We comply with audit and registration requirements under Law No. 058/2021.`,
  },
  {
    id: 'contact-information',
    title: '11. Contact Information',
    isContact: true,
    content: undefined as never,
  },
];

const contactInfo = [
  { icon: 'bi bi-person-fill', text: 'Data Protection Officer -JamboLush' },
  { icon: 'bi bi-envelope-fill', text: 'info@jambolush.com', link: 'mailto:info@jambolush.com' },
  { icon: 'bi bi-geo-alt-fill', text: 'Kigali, Rwanda' },
  { icon: 'bi bi-telephone-fill', text: '+250788 437 347', link: 'tel:+250788437347' },
];

const PrivacyPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scrollToSection = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col sm:flex-row font-sans">
      {/* Mobile Top Bar */}
      <div className="sm:hidden flex justify-between items-center bg-[#0C2D62] text-white p-4 fixed top-15 left-5 right-5 z-10">
        {/* Button first (left) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white text-2xl font-bold"
        >
          ☰
        </button>

        {/* Title second (right) */}
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
        {/* Mobile Close Button */}
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
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">JamboLush Privacy and Data Protection Policy</h1>
          <p className="text-xl text-[#083A85] font-bold underline">Last Updated: 01-September-2025</p>
          <p className="text-gray-700 mt-4">
            This Privacy and Data Protection Policy explains how Jambolush collects, uses, stores, shares, and protects personal data. We comply with Rwanda’s Law No. 058/2021 Relating to the Protection of Personal Data and Privacy, as well as the European Union General Data Protection Regulation (GDPR).
          </p>
        </div>

        {sections.map((section) => (
          <section
            key={section.id}
            ref={(el) => {
              sectionRefs.current[section.id] = el as HTMLDivElement | null;
            }}
            className="mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-3">{section.title}</h2>
            {!section.isContact ? (
              <p className="text-gray-700 font-normal whitespace-pre-wrap">{section.content}</p>
            ) : (
              <div className="text-gray-700 font-normal space-y-4">
                <p>
                  For any questions, complaints, or requests about your data rights, please contact our Data Protection Officer:
                </p>
                <ul className="space-y-2">
                  {contactInfo.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <i className={`${item.icon} text-pink-600 text-lg`}></i>
                      {item.link ? (
                        <a href={item.link} className="text-blue-600 hover:underline">
                          {item.text}
                        </a>
                      ) : (
                        <span>{item.text}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}
      </main>
    </div>
  );
};

export default PrivacyPage;
