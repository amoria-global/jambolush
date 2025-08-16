'use client';

import React, { useState, useRef, useEffect } from 'react';

const sections = [
 
  {
    id: 'information-we-collect',
    title: '1. Information We Collect',
    content: `1.1 Personal Information You Provide
- Name, email, phone number, and date of birth
- Billing and payment information
- Property details (for hosts)
- Profile pictures and uploaded content (photos, videos, descriptions)

1.2 Information Collected Automatically
- Device information (IP address, browser type, operating system)
- Usage information (pages visited, time spent, clicks, interactions)
- Location data (if you enable GPS/location services)

1.3 Third-Party Information
We may collect information from third-party services (e.g., payment processors, social media login providers) to facilitate your use of Jambolush.`
  },
  {
    id: 'how-we-use',
    title: '2. How We Use Your Information',
    content: `2.1 To Provide and Improve Services
- Facilitate bookings and payments
- Verify user accounts
- Customize and enhance user experience
- Improve our platform and Services based on usage data

2.2 Communication and Support
- Send booking confirmations and receipts
- Respond to inquiries and support requests
- Provide updates, announcements, and promotional materials (with opt-in consent where required)

2.3 Legal Compliance and Safety
- Comply with laws, regulations, or legal obligations
- Detect, prevent, or address fraud, security issues, or illegal activity
- Enforce our Terms & Conditions`
  },
  {
    id: 'sharing-information',
    title: '3. Sharing of Information',
    content: `3.1 With Other Users
- Hosts may see guest information necessary for bookings
- Guests may see host-provided property information

3.2 With Service Providers
We share information with trusted third-party providers for payments, analytics, and operational support

3.3 For Legal Reasons
We may disclose information to comply with legal obligations, enforce our Terms, or protect rights, safety, or property

3.4 Business Transfers
In the event of a merger, acquisition, or sale, user information may be transferred as part of the business assets`
  },
  {
    id: 'cookies-tracking',
    title: '4. Cookies and Tracking Technologies',
    content: `4.1 Use of Cookies
We use cookies and similar technologies to enhance user experience, analyze traffic, and remember preferences.

4.2 Types of Cookies
- Essential cookies: Required for basic platform functionality
- Analytics cookies: Track user behavior to improve services
- Advertising cookies: Display personalized promotions

4.3 Managing Cookies
You can adjust browser settings to manage or block cookies, but some features of Jambolush may not function properly if cookies are disabled.`
  },
  {
    id: 'data-security',
    title: '5. Data Security',
    content: `5.1 Security Measures
We implement industry-standard technical, administrative, and physical safeguards to protect personal information from unauthorized access, use, or disclosure.

5.2 Limitations
While we strive to protect your data, no system is completely secure. We cannot guarantee absolute protection against all cyber threats.`
  },
  {
    id: 'data-retention',
    title: '6. Data Retention',
    content: `6.1 Retention Period
We retain personal information for as long as necessary to provide Services, comply with legal obligations, resolve disputes, and enforce agreements.

6.2 Deletion Requests
You may request deletion of your personal information, subject to legal and contractual restrictions. Certain information may be retained for record-keeping, fraud prevention, or regulatory compliance.`
  },
  {
    id: 'your-rights',
    title: '7. Your Rights',
    content: `7.1 Access and Correction
You have the right to access, correct, or update your personal information in your account.

7.2 Opt-Out and Marketing Preferences
You may opt out of promotional communications at any time via account settings or by contacting support.

7.3 Data Portability and Deletion
You may request a copy of your data or request its deletion, subject to exceptions required by law.`
  },
  {
    id: 'children-privacy',
    title: '8. Children’s Privacy',
    content: `Jambolush is not intended for children under 18. We do not knowingly collect personal information from minors. If we learn that we have collected information from a child, we will take steps to delete it promptly.`
  },
  {
    id: 'international-users',
    title: '9. International Users',
    content: `By using Jambolush, you acknowledge that your information may be transferred and stored in countries other than your own. We take measures to ensure appropriate safeguards are in place consistent with applicable law.`
  },
  {
    id: 'changes-to-policy',
    title: '10. Changes to Privacy Policy',
    content: `We may update this Privacy Policy from time to time. Significant changes will be communicated via platform notifications or email. Continued use of our Services constitutes acceptance of the revised Privacy Policy.`
  }
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
        <h2 className="text-lg font-semibold left-5 right-5">Sections</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white text-2xl font-bold">
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-[#0C2D62] text-white w-full sm:w-64 p-4 flex-shrink-0 mt-16 ml-10 mb-5 sm:mt-13 ${
          sidebarOpen ? 'block' : 'hidden'
        } sm:block`}
      >
        <ul className="space-y-2 text-sm sm:text-base">
          {sections.map((section) => (
            <li
              key={section.id}
              className="cursor-pointer px-3 py-2 rounded hover:bg-[#F20C8F] transition-colors duration-200"
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
            ref={(el) => { sectionRefs.current[section.id] = el as HTMLDivElement | null; }}
            className="mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-3">{section.title}</h2>
            <p className="text-gray-700 font-normal whitespace-pre-wrap">{section.content}</p>
          </section>
        ))}
      </main>
    </div>
  );
};

export default PrivacyPage;
