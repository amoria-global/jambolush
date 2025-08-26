'use client';

import React, { useState, useRef, useEffect } from 'react';

const sections = [
  {
    id: 'welcome',
    title: 'Welcome',
    content: `Last Updated: 01 September, 2025

These Terms and Conditions establish the legal agreement that governs your access to and use of the Jambolush platform, which includes our website, mobile application, and all related tools and services made available to you. By creating an account, listing a property or tourism service, booking accommodations, purchasing an experience, or engaging with any feature of Jambolush in any other way, you acknowledge and agree that you are bound by these Terms in full. If you do not agree with any part of these Terms, you are not authorized to use the platform, and you must refrain from accessing or utilizing any of the services we provide.`
  },
  {
    id: 'definitions',
    title: '1. Definitions',
    content: `1. Platform: refers to the Jambolush website, mobile application, and any related tools, technologies, or systems that facilitate the connection between travelers and service providers.
2. Host: is any individual or business that lists a property or accommodation for rent through the Platform.
3. Tour Operator: is a provider of tourism-related services such as guided tours, cultural activities, or travel experiences made available to Guests.
4. Guest/Traveler: refers to any individual who books, reserves, or purchases services via the Platform.
5. Field Agent: is an authorized representative of Jambolush who is responsible for verifying property listings, ensuring accuracy, and providing support to service providers.
6. User: encompasses any person or entity, including Hosts, Guests, Tour Operators, and Field Agents, who accesses or interacts with the Platform in any capacity.
7. Content: refers to any material uploaded, posted, or otherwise provided by a User, including but not limited to text, photos, videos, reviews, or other forms of data shared through the Platform.`
  },
  {
    id: 'scope',
    title: '2. Scope of Services',
    content: `Jambolush serves solely as a digital marketplace that connects travelers with independent property owners and tourism service providers. We do not own, operate, or manage any of the properties, tours, or related services listed on our platform. Each host or service provider is entirely responsible for the accuracy of their listings, the quality and safety of the services they offer, and for complying with all applicable laws and regulations. While Jambolush may provide tools that facilitate communication, booking, and payment processing between travelers and hosts, we are not a party to the contractual agreement between them. Accordingly, Jambolush does not guarantee, endorse, or assume responsibility for the condition, legality, or suitability of any service offered through the platform, nor for the conduct of hosts, agents, or guests. Any disputes, cancellations, accidents, losses, or damages arising from the use of services are the sole responsibility of the host and the guest.`
  },
  {
    id: 'accounts',
    title: '3. Account Registration',
    content: `Users are required to create an account in order to list, book, or manage any services through the Jambolush platform, and during registration they must provide accurate, truthful, and up-to-date personal and contact information. Each user is solely responsible for maintaining the confidentiality and security of their login credentials, including usernames, passwords, or any other access keys associated with their account. Any activity that takes place under a user’s account will be considered their responsibility, whether or not it was authorized by them, and Jambolush will not be held liable for any losses, damages, or disputes arising from unauthorized use caused by negligence in safeguarding account information. Users must promptly update their account details when changes occur and immediately notify Jambolush if they suspect any unauthorized access or security breach related to their account.`
  },
  {
    id: 'hosts',
    title: '4. Host & Tour Operator Obligations',
    content: `Hosts and Tour Operators are responsible for maintaining accurate and up-to-date listings, ensuring that all information about their properties or services is correct and reflects the current state. They must operate their services in a lawful and safe manner, following all local regulations and safety standards. They are also required to comply with any necessary permits, tax obligations, and fulfill all booking commitments made to travelers. Additionally, they must pay any applicable service fees charged by Jambolush for using the platform.`
  },
  {
    id: 'guests',
    title: '5. Guest & Traveler Obligations',
    content: `Guests and Travelers are required to provide accurate and complete booking information when making reservations. They must respect the rules of the properties they visit, follow the guidelines of tours or activities, and comply with all applicable laws. Additionally, they are expected to take care of the property and services they use, avoiding any damage or behavior that could disrupt the experience for others.`
  },
  {
    id: 'payments',
    title: '6. Payments & Fees',
    content: `All payments for bookings must be made through Jambolush’s approved payment gateways to ensure security and proper tracking. Users are not allowed to make direct payments to each other to bypass platform fees. Payments may be temporarily held in the payment gateway until the service has been fully delivered to protect both parties. Any taxes arising from earnings are the responsibility of the party receiving the funds, not Jambolush.`
  },
  {
    id: 'cancellations',
    title: '7. Cancellations & Refunds',
    content: `Hosts and Tour Operators are required to clearly display their cancellation and refund policies so that travelers understand the terms before booking. Platform fees are generally non-refundable unless explicitly stated otherwise. Jambolush reserves the right to cancel bookings in cases of suspected fraud, safety concerns, or service failures, and may provide refunds in such situations as deemed appropriate.`
  },
  {
    id: 'policies',
    title: '8. Policies',
    content: `Jambolush has additional policy documents that are considered part of this agreement and provide further rules and guidance for users. These include the Privacy & Data Protection Policy, which governs how personal information is collected, stored, and used; the Anti-Discrimination & Inclusion Policy, which ensures all users are treated fairly and respectfully; the Field Agent Policy, which outlines the responsibilities of authorized representatives who verify listings and support service providers; the Content & Listing Policy, which sets standards for the information and media shared on the platform; the Security Policy, which details measures to protect users and platform data; and the Prohibited Activities Policy, which identifies actions that are not allowed on the platform. Together, these policies support safe, fair, and reliable use of Jambolush.`
  },
  {
    id: 'intellectual',
    title: '9. Intellectual Property',
    content: `All intellectual property on the Jambolush platform, including designs, logos, content, and software, is either owned by Jambolush or properly licensed to it. Users are not allowed to use, copy, modify, or distribute any of this intellectual property without explicit permission, ensuring that Jambolush retains full control over its creations and protected materials.`
  },
  {
    id: 'indemnity',
    title: '10. Indemnity',
    content: `By using the Jambolush platform, you agree to take responsibility for any legal claims, damages, or expenses that result from your actions or violations of the Terms. This means you will protect and compensate Jambolush, its affiliates, and staff if any issues arise due to your use of the platform, ensuring they are not held liable for your conduct.`
  },
  {
    id: 'accessibility',
    title: '11. Accessibility Commitment',
    content: `Jambolush strives to make its platform accessible to all users, including those with disabilities, by following recognized accessibility standards. The platform is continuously improved to ensure that users with different needs can navigate, interact with, and use its features effectively and comfortably.`
  },
  {
    id: 'force-majeure',
    title: '12. Force Majeure',
    content: `Jambolush is not liable for any delays, disruptions, or failures in service that result from circumstances beyond its control, such as natural disasters, pandemics, or actions taken by governments. These events are considered unavoidable, and users acknowledge that Jambolush cannot guarantee service continuity under such conditions.`
  },
  {
    id: 'third party',
    title: '13. Third Party Services',
    content: `Jambolush may work with third-party services, such as payment processors, to facilitate platform functions. However, the platform is not responsible for how these third-party tools perform, nor for their terms, policies, or any issues that may arise while using them. Users acknowledge that interactions with these services are subject to the third parties’ own rules and reliability.`
  },
  {
    id: 'changes',
    title: '14. Changes to the Platform',
    content: `Jambolush may modify, update, or remove platform features to comply with legal requirements or to improve functionality. While routine adjustments may occur without notice, any major changes that significantly affect users will be communicated through email or app notifications to keep users informed.`
  },
  {
    id: 'liability',
    title: '15. Limitation of Liability',
    content: `As far as the law allows, Jambolush’s total financial liability to any user is limited to the amount of service fees the user has paid to the platform over the past 12 months. This means that, in the event of any claims or damages, Jambolush will not be responsible for losses exceeding this capped amount.`
  },
  {
    id: 'dispute',
    title: '16. Dispute Resolution',
    content: `1. Negotiation: Both parties will make a genuine effort to resolve disputes through good faith negotiations within 30 days of the issue arising.
2. Mediation: If negotiations do not resolve the dispute, the matter will proceed to mediation, which will take place in Kigali, Rwanda.
3. Arbitration: If mediation is unsuccessful, disputes will be resolved through binding arbitration held in Kigali, Rwanda, conducted in the English language.
4. Costs: Unless otherwise agreed between the parties, each party is responsible for covering its own costs associated with the dispute resolution process.`
  },
  {
    id: 'law',
    title: '17. Governing Law',
    content: `These Terms are governed by the laws of the Republic of Rwanda, which means that any disputes, interpretations, or legal matters related to the use of the platform will be resolved according to Rwandan law.`
  },
  {
    id: 'language',
    title: '18. Governing Language',
    content: `These Terms are written in English, and any translations provided are for convenience only. In the event of any conflict or discrepancy between versions, the English version will take precedence and govern the interpretation and enforcement of the Terms.`
  },
  {
    id: 'compliance',
    title: '19. Global Compliance Statement',
    content: `Jambolush strives to follow international legal standards for data protection and privacy, including the GDPR, CCPA, and relevant African regulations. This means the platform takes measures to safeguard user data, handle personal information responsibly, and comply with applicable laws across different regions.`
  },
  {
    id: 'acceptance',
    title: '20. Digital Acceptance',
    content: `By creating an account, clicking “I Agree,” or using the platform in any way, you confirm that you have read, understood, and accepted these Terms, agreeing to be bound by all rules, responsibilities, and policies outlined within them.`
  },
  {
    id: 'entire',
    title: '21. Entire Agreement',
    content: `These Terms replace and take precedence over any prior agreements or understandings between you and Jambolush, meaning that the current Terms are the official rules governing your use of the platform.`
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
          sm:static sm:translate-x-0 sm:opacity-100 sm:scale-100 sm:pointer-events-auto sm:w-64 sm:mt-23 sm:rounded-xl sm:shadow-none sm:ml-12`}
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
        className="flex-1 overflow-auto p-6 sm:p-8 bg-white rounded-xl shadow-lg mt-24 sm:mt-23 text-lg sm:text-lg leading-relaxed"
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
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

        {/* Agreement button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => alert('You have agreed to the terms!')}
            className={`px-4 py-2 bg-[#F20C8F] text-white text-lg sm:text-lg font-medium rounded-lg transition-colors duration-300 cursor-pointer ${
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