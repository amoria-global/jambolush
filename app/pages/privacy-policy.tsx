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
    content: `This policy applies to everyone who uses the Jambolush platform, including travelers, hosts, and field agents. It covers all personal information collected through Jambolush’s website, mobile apps, and any connected third-party services, regardless of where the user is located. This ensures that all users’ data is handled according to the same rules and protections, no matter their role or geographic location.`,
  },
  {
    id: 'lawful-basis',
    title: '2. Lawful Basis for Processing',
    content: `Jambolush processes personal data only when it is legally allowed to do so. This includes situations where you have explicitly given consent, such as for marketing communications or the use of cookies; when processing is necessary to fulfill contracts, like completing bookings and payments; when required to comply with legal obligations, including tax, financial, or regulatory duties; and when the platform has a legitimate interest, such as maintaining security, preventing fraud, or improving services. This approach ensures that all data processing is lawful, purposeful, and transparent.`,
  },
  {
    id: 'data-collected',
    title: '3. Categories of Data Collected',
    content: `- Identification data: This includes your name, ID number, passport, and any other government-issued documents used to verify your identity.
- Contact details: Such as your email address, phone number, and physical address, which allow the platform to communicate with you.
- Payment details: Information related to payments, handled securely through third-party payment providers.
- Booking and transaction history: Records of your reservations, purchases, and interactions on the platform.
- Device and location information: Data about the devices you use and your geographic location to improve service functionality and security.
- Photos, videos, or documents submitted for property verification: Media you provide to confirm the accuracy or legitimacy of listings.
- Cookies and tracking data: Information collected via cookies or other tracking technologies, including analytics, user preferences, and advertising data where applicable.`,
  },
  {
    id: 'data-subject-rights',
    title: '4. Rights of Data Subjects',
    content: `Under GDPR, Rwanda's Law No. 058/2021, and other international privacy standards, you have the following rights regarding your personal data:

- Access: You can request to see the personal data Jambolush holds about you.
- Correction/Update: You can ask for any inaccurate or outdated information to be corrected or updated.
- Deletion ("Right to be Forgotten"): You can request that your personal data be deleted from our systems.
- Restriction or Objection: You can limit or object to certain types of data processing.
- Data Portability: You can request to receive your data in a structured, commonly used format for transfer to another service.
- Withdraw Consent: You can withdraw any consent you have previously given for processing your data at any time.
- Lodge a Complaint: You can file a complaint with the Rwanda National Cyber Security Authority (NCSA) or, if applicable, your local data protection authority in the EU.`,
  },
  {
    id: 'data-sharing',
    title: '5. Data Sharing and Cross-Border Transfers',
    content: `Jambolush does not sell your personal data. However, we may share your personal data with certain parties to provide and improve our services:

Payment processors and financial institutions: To securely complete transactions.
Verified field agents: To verify property listings.
Hosting providers, analytics services, and customer support partners: To maintain platform functionality and assist users.
Regulatory or government authorities: When required by law.

For cross-border transfers of personal data outside Rwanda or the European Economic Area (EEA), Jambolush relies on legal safeguards such as:

Adequacy decisions recognized by relevant regulators.
Standard Contractual Clauses (SCCs) to ensure proper data protection.
Explicit user consent where necessary.`,
  },
  {
    id: 'data-security',
    title: '6. Data Security',
    content: `Jambolush implements appropriate technical and organizational measures to protect personal data. These include encrypting data using TLS for transmission and AES-256 for storage, applying role-based access controls and the principle of least privilege to limit access, conducting regular penetration testing and security audits to identify vulnerabilities, and maintaining incident response and breach notification procedures to address any security issues promptly.`,
  },
  {
    id: 'data-retention',
    title: '7. Data Retention',
    content: `Jambolush keeps personal data only for as long as needed to fulfill business and legal obligations. Booking and tax records are retained for up to 7 years. Marketing and communication data is kept until you withdraw your consent. Account-related data is deleted when your account is closed, unless there is a legal requirement to retain it for a longer period.`,
  },
  {
    id: 'childrens-data',
    title: '8. Children’s Data',
    content: `Jambolush is committed to protecting children’s privacy and does not knowingly collect personal data from anyone under the age of 16 without explicit parental or guardian consent. If we discover that personal data from a child under 16 has been inadvertently collected, we will take immediate steps to delete it from our systems. Parents or guardians who believe that their child has provided personal data to Jambolush can contact us at any time to request its deletion. This policy ensures that children’s information is handled responsibly and that the platform complies with applicable child protection and data privacy laws.`,
  },
  {
    id: 'breach-notification',
    title: '9. Breach Notification',
    content: `If a personal data breach occurs, Jambolush will promptly inform the Rwanda National Cyber Security Authority (NCSA), the relevant EU supervisory authority when applicable, and any affected users. This ensures that breaches are handled transparently and in compliance with legal requirements, allowing users and authorities to take necessary actions to protect data and mitigate potential risks.`,
  },
  {
    id: 'regulatory-registration',
    title: '10. Regulatory Registration',
    content: `Jambolush is officially registered with the Rwanda National Cyber Security Authority (NCSA) as a data controller, meaning it is recognized as responsible for managing and protecting personal data. The platform complies with all audit and registration requirements set out under Rwanda’s Law No. 058/2021, ensuring proper data governance and accountability.`,
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
          sm:static sm:translate-x-0 sm:opacity-100 sm:scale-100 sm:pointer-events-auto sm:w-64 sm:mt-23 sm:rounded-xl sm:shadow-none sm:ml-12`}
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

        <ul className="space-y-2 text-sm sm:text-lg">
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
        className="flex-1 overflow-auto p-6 sm:p-8 bg-white rounded-xl shadow-lg mt-24 sm:mt-23 text-sm sm:text-lg leading-relaxed"
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#0C2D62] mb-2">JamboLush Privacy and Data Protection Policy</h1>
          <p className="text-xl text-[#083A85] font-bold underline">Last Updated: 01-September-2025</p>
          <p className="text-[#0C2D62] mt-4">
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
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#0C2D62] mb-3">{section.title}</h2>
            {!section.isContact ? (
              <p className="text-[#0C2D62] font-normal whitespace-pre-wrap">{section.content}</p>
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
