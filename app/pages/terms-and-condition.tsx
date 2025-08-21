'use client';

import React, { useState, useRef, useEffect } from 'react';

const sections = [
  {
  id: 'eligibility',
    title: '1. Eligibility and Acceptance of Terms',
    content: `1.1 Minimum Age Requiremen You must be at least 18 years of age, or the legal age of majority in your jurisdiction, to use Jambolush. By signing up, you confirm that you meet this requirement.

1.2 Authority to Bind an Entity If you access Jambolush on behalf of a company, organization, or other entity, you represent that you have the legal authority to bind that entity to this Agreement.

1.3 Acceptance of Terms By creating an account or using our Services, you agree to these Terms and our Privacy Policy. Continued use after updates will mean you accept the revised version.`
  },

  {
    id: 'use',
    title: '2. Use of Services',
    content: `2.1 Lawful Use
You agree to use Jambolush only for lawful purposes and in compliance with all applicable local, national, and international laws.'

2.2 Prohibited Activities
   You may not:
    • Provide false, misleading, or fraudulent information.
    • Attempt to hack, disrupt, reverse-engineer, or gain unauthorized access to the platform.
    • Post content that is defamatory, obscene, discriminatory, violent, or that violates third-party rights.
    • Use the platform for fraudulent bookings, scams, or illegal transactions.
    • Interfere with the security or proper functioning of the Services.

2.3 Enforcement Jambolush reserves the right to monitor, review, and remove any content or accounts that violate these Terms. We may suspend or permanently terminate access without liability.`
  },

  {
    id: 'accounts',
    title: '3. User Accounts',
    content: `3.1 Registration To access certain features, you must create an account. You agree to provide accurate, current, and complete information during registration and to keep it updated.

        3.2 Security of Account You are solely responsible for maintaining the confidentiality of your login credentials. You agree not to share your password or allow unauthorized access.

        3.3 Responsibility for Actions All activity that occurs under your account is your responsibility, whether or not authorized by you. If you suspect unauthorized use, you must notify Jambolush immediately.

        3.4 Limitation of Liability Jambolush is not responsible for losses due to unauthorized account access unless caused by our negligence.`
  },

  {
    id: 'bookings',
    title: '4. Bookings and Payments',
    content: `4.1 Accuracy of Bookings
Users must make honest and accurate bookings. Fraudulent or duplicate bookings may lead to suspension or legal action.

4.2 Payment Processing
All payments are securely processed by third-party payment providers. By making a payment, you agree to their terms. Jambolush does not store sensitive payment details (e.g., credit card numbers).

4.3 Fees and Taxes
Service fees, processing fees, and applicable taxes will be displayed at checkout. You are responsible for reviewing these charges before confirming a booking.

4.4 Refunds and Cancellations
Refunds and cancellations are subject to the specific policies stated at the time of booking. Jambolush may facilitate but is not liable for disputes unless otherwise required by law.

4.5 Changes to Pricing
We may adjust pricing, fees, or taxes with prior notice. Continued use after notice constitutes acceptance.`
  },

  {
    id: 'content',
    title: '5. Content Ownership and Intellectual Property',
    content: `5.1 User Content
You retain ownership of any content you upload (e.g., property descriptions, photos, reviews).

5.2 License to Jambolush
By posting on Jambolush, you grant us a worldwide, royalty-free, perpetual, non-exclusive license to use, reproduce, display, distribute, and promote your content in connection with the Services.

5.3 Prohibited Content
You may not upload content that is unlawful, harmful, offensive, violent, or that infringes copyright, trademarks, or intellectual property rights of others.

5.4 Content Moderation
Jambolush may review, edit, or remove content at our discretion.

5.5 Platform IP
All rights, title, and interest in Jambolush's Services, software, design, and trademarks remain the property of Jambolush. You may not copy, modify, or distribute without permission.`
  },

  {
    id: 'responsibilities',
    title: '6. Responsibilities of Hosts and Guests',
    content: `6.1 Host Responsibilities
      • Provide accurate, updated, and truthful descriptions of listed properties.
      • Ensure spaces comply with local laws, health, and safety regulations.
      • Honor bookings unless prevented by legitimate reasons.

6.2 Guest Responsibilities
    • Use spaces responsibly and in compliance with host rules.
    • Avoid damage, misuse, or disruptive behavior.
    • Respect hosts and their property.

6.3 Mutual Responsibilities
Both hosts and guests agree to:
    • Communicate honestly and respectfully.
    • Avoid fraudulent or harmful activities.
    • Resolve disputes in good faith.

6.4 Dispute Mediation
Jambolush may attempt to mediate disputes but does not guarantee resolution.`
  },

  {
    id: 'termination',
    title: '7. Termination and Suspension',
    content: `7.1 Termination by Jambolush
We may suspend or terminate accounts for:
    • Breach of these Terms.
    • Fraudulent or illegal activity.
    • Non-payment or misuse of Services.

7.2 Termination by User
You may close your account at any time, but obligations (e.g., pending bookings or payments) will remain enforceable.

7.3 Data Retention
Jambolush may retain necessary information for compliance, fraud prevention, and legal purposes even after account closure.`
  },

  {
    id: 'liability',
    title: '8. Limitation of Liability',
    content: `8.1 Disclaimer of Warranties
Jambolush Services are provided "as is" and "as available." We make no guarantee of uninterrupted access, error-free operation, or specific results.

8.2 Limitation of Liability
To the fullest extent permitted by law, Jambolush will not be liable for:
    • Indirect, incidental, or consequential damages.
    • Loss of profits, data, goodwill, or opportunities.

8.3 Cap on Liability Our total liability shall not exceed the amount you paid to us in the 12 months prior to the claim.`
  },

  {
    id: 'privacy',
    title: '9. Privacy and Data Protection',
    content: `9.1 Privacy Policy
Your use of Jambolush is subject to our Privacy Policy, which explains how we collect, use, and protect your personal information.

9.2 Consent to Data Use By using our Services, you consent to our collection and processing of your personal data.

9.3 Data Security We employ industry-standard security practices but cannot guarantee complete protection against cyber threats.`
  },

  {
    id: 'changes',
    title: '10. Changes to Terms',
    content: `10.1 Right to Update
We may update these Terms at any time, with changes effective upon posting.

10.2 User Notification If material changes occur, we will notify users via email or platform notice.

10.3 Continued Use Continued use after updates means you agree to the revised Terms.`
  },
  
  {
    id: 'law',
    title: '11. Governing Law and Dispute Resolution',
    content: `11.1 Governing Law
These Terms shall be governed by the laws of Rwanda.

11.2 Dispute Resolution
      • Parties will first attempt to resolve disputes through good faith negotiation.
      • If unresolved, disputes will proceed to binding arbitration or a competent court in [Insert Location].`
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
      <div className="sm:hidden flex justify-between items-center bg-[#0C2D62] text-white p-4 relative top-16 left-0 right-0 z-10">
        <h2 className="text-lg font-semibold">Sections</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white text-2xl font-bold">
          ☰
        </button>
      </div>


      {/* Sidebar */}
      <aside
        className={`bg-[#0C2D62] text-white w-full sm:w-64 p-4 flex-shrink-0 sm:block mt-16 ${sidebarOpen ? 'block' : 'hidden'} sm:block`}
      >
        <ul className="space-y-2 text-sm sm:text-base font-sans">
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
        className="flex-1 overflow-auto p-6 sm:p-8 bg-white rounded-xl shadow-lg mt-24 sm:mt-8 font-sans text-sm sm:text-base leading-relaxed"
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        {sections.map((section) => (
          
            <section key={section.id}ref={(el) => { sectionRefs.current[section.id] = el as HTMLDivElement | null }}className="mb-8">
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
