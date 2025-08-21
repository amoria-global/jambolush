'use client';

import React, { useState, useRef, useEffect } from 'react';

const sections = [
  {
    id: 'eligibility',
    title: '1. Eligibility and Acceptance of Terms',
    content: `1.1 Minimum Age Requirement
You must be at least 18 years old (or the legal age of majority in your jurisdiction) to use Jambolush. By registering for an account, you represent and warrant that you meet this requirement. If you do not, you are prohibited from creating an account or using our Services.

1.2 Use on Behalf of an Entity
If you are using Jambolush on behalf of a business, company, or organization, you represent that you are duly authorized to bind that entity to this Agreement. In such cases, the term “you” will also refer to that entity.

1.3 Acceptance of Terms
By accessing or using the Services, you acknowledge that you have read, understood, and agreed to be bound by this Agreement. Continued use of Jambolush after updates to these Terms constitutes acceptance of the revised version.`
  },
  {
    id: 'use',
    title: '2. Use of Services',
    content: `2.1 Lawful Use Only
You agree to use Jambolush strictly for lawful purposes and in compliance with all applicable laws, regulations, and policies.

2.2 Prohibited Conduct
Prohibited uses of the Services include but are not limited to:

Uploading, posting, or transmitting false, misleading, or harmful information.

Attempting to hack, disrupt, or gain unauthorized access to our systems or networks.

Engaging in activities that exploit, harm, or threaten others.

Posting or transmitting content that is defamatory, obscene, discriminatory, or otherwise offensive.

Using Jambolush for fraudulent transactions, illegal activities, or unauthorized advertising.

2.3 Enforcement
Jambolush reserves the right to monitor activity, remove content, suspend, or terminate accounts that violate these Terms or otherwise misuse the Services.`
  },
  {
    id: 'accounts',
    title: '3. User Accounts',
    content: `3.1 Account Creation
To access certain features, you must create an account and provide accurate, complete, and up-to-date information. Providing false information may result in suspension or termination.

3.2 Account Security
You are solely responsible for maintaining the confidentiality of your login credentials (username, password, etc.) and for restricting access to your account.

3.3 Responsibility for Use
Any activity performed under your account, whether by you or someone else, will be considered your responsibility. If you suspect unauthorized use, you must notify Jambolush immediately.

3.4 Limitation of Liability
Jambolush shall not be liable for losses or damages caused by unauthorized account use unless such access is due to our negligence.`
  },
  {
    id: 'bookings',
    title: '4. Bookings and Payments',
    content: `4.1 Booking Accuracy
All bookings made through Jambolush must be accurate and truthful. Any misuse such as duplicate bookings, false reservations, or fraudulent activity may result in account suspension.

4.2 Payment Processing
Payments are handled through trusted third-party payment providers. By making a payment, you agree to their terms and conditions in addition to ours.

4.3 Fees and Taxes
Service fees, applicable taxes, and charges will be displayed at checkout. Users are responsible for reviewing and understanding these charges before confirming a booking.

4.4 Refunds and Cancellations
Refunds and cancellations are governed by the cancellation policies presented at the time of booking. Jambolush may mediate disputes but is not responsible for final outcomes unless required by law.

4.5 Price Adjustments
We reserve the right to update or change fees and pricing structures at any time. Users will be notified of such changes in advance where applicable.`
  },
  {
    id: 'content',
    title: '5. Content Ownership and License',
    content: `5.1 User-Generated Content
Users retain ownership of the content they upload, such as photos, descriptions, and reviews.

5.2 License Granted to Jambolush
By submitting content, you grant Jambolush a worldwide, royalty-free, non-exclusive, transferable license to use, reproduce, modify, distribute, and display your content in connection with the Services.

5.3 Prohibited Content
You may not post or share content that is unlawful, harmful, offensive, infringes on intellectual property rights, or violates community standards.

5.4 Moderation Rights
Jambolush reserves the right to monitor, remove, or restrict access to content at its sole discretion.`
  },
  {
    id: 'responsibilities',
    title: '6. Responsibilities of Hosts and Guests',
    content: `6.1 Host Responsibilities
Hosts must ensure that spaces listed are safe, accurate, and compliant with local laws, building codes, and health and safety regulations.

6.2 Guest Responsibilities
Guests agree to use spaces responsibly, follow the host's rules, and respect property and community standards.

6.3 Good Faith Conduct
Both hosts and guests agree to communicate honestly, avoid fraudulent activities, and work to resolve disputes in good faith.

6.4 Dispute Mediation
While Jambolush may assist in dispute resolution, we do not guarantee final outcomes or responsibility for conflicts between users.`
  },
  {
    id: 'termination',
    title: '7. Termination and Suspension',
    content: `7.1 Grounds for Suspension
Jambolush may suspend or terminate accounts if users:

Violate this Agreement.

Engage in fraudulent, abusive, or harmful behavior.

Fail to comply with payment or booking obligations.

7.2 User-Initiated Termination
Users may close their accounts at any time, but obligations related to pending bookings or payments will remain in effect.

7.3 Data Retention
Jambolush may retain user data as required by law or for legitimate business purposes even after account termination.`
  },
  {
    id: 'liability',
    title: '8. Limitation of Liability',
    content: `8.1 Disclaimer of Warranties
Jambolush provides Services “as is” and “as available,” without warranties of any kind.

8.2 Exclusion of Damages
To the fullest extent permitted by law, Jambolush is not liable for indirect, incidental, special, or consequential damages, including loss of data, profits, or opportunities.

8.3 Liability Cap
Our maximum liability shall not exceed the total amount paid by you to Jambolush in the 12 months preceding the claim.`
  },
  {
    id: 'privacy',
    title: '9. Privacy and Data Protection',
    content: `9.1 Privacy Policy
Your use of Jambolush is subject to our Privacy Policy, which explains how we collect, use, and safeguard your information.

9.2 Consent to Data Use
By using Jambolush, you consent to the processing and use of your personal data as described in our Privacy Policy.

9.3 Security Measures
Jambolush uses industry-standard security practices to protect user data but cannot guarantee complete protection against cyber threats.`
  },
  {
    id: 'changes',
    title: '10. Changes to Agreement',
    content: `10.1 Updates
We may revise this Agreement periodically. Updates will be posted on the platform with a new “Last Updated” date.

10.2 Notification of Changes
Significant changes will be communicated via email or in-platform notification.

10.3 Continued Use
By continuing to use the Services after updates, you agree to the revised terms.`
  },
  {
    id: 'law',
    title: '11. Governing Law and Dispute Resolution',
    content: `11.1 Governing Law
This Agreement will be governed by the laws of RWANDA.

11.2 Dispute Resolution
Users agree to attempt to resolve disputes amicably. If unresolved, disputes may be referred to arbitration or a competent court in Nyarugenge.`
  }
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
