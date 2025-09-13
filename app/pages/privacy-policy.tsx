'use client';

import React, { useState, useRef } from 'react';
import { useTranslations } from '../lib/LanguageContext';

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

const PrivacyPage: React.FC = () => {
  const t = useTranslations();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Create sections array with translations
  const sections: Section[] = [
    {
      id: 'scope',
      title: t('privacy.sections.scope.title'),
      content: t('privacy.sections.scope.content'),
    },
    {
      id: 'lawful-basis',
      title: t('privacy.sections.lawfulBasis.title'),
      content: t('privacy.sections.lawfulBasis.content'),
    },
    {
      id: 'data-collected',
      title: t('privacy.sections.dataCollected.title'),
      content: t('privacy.sections.dataCollected.content'),
    },
    {
      id: 'data-subject-rights',
      title: t('privacy.sections.dataSubjectRights.title'),
      content: t('privacy.sections.dataSubjectRights.content'),
    },
    {
      id: 'data-sharing',
      title: t('privacy.sections.dataSharing.title'),
      content: t('privacy.sections.dataSharing.content'),
    },
    {
      id: 'data-security',
      title: t('privacy.sections.dataSecurity.title'),
      content: t('privacy.sections.dataSecurity.content'),
    },
    {
      id: 'data-retention',
      title: t('privacy.sections.dataRetention.title'),
      content: t('privacy.sections.dataRetention.content'),
    },
    {
      id: 'childrens-data',
      title: t('privacy.sections.childrensData.title'),
      content: t('privacy.sections.childrensData.content'),
    },
    {
      id: 'breach-notification',
      title: t('privacy.sections.breachNotification.title'),
      content: t('privacy.sections.breachNotification.content'),
    },
    {
      id: 'regulatory-registration',
      title: t('privacy.sections.regulatoryRegistration.title'),
      content: t('privacy.sections.regulatoryRegistration.content'),
    },
    {
      id: 'contact-information',
      title: t('privacy.sections.contactInformation.title'),
      isContact: true,
      content: undefined as never,
    },
  ];

  const contactInfo = [
    { icon: 'bi bi-person-fill', text: t('privacy.contact.dpo') },
    { icon: 'bi bi-envelope-fill', text: 'info@jambolush.com', link: 'mailto:info@jambolush.com' },
    { icon: 'bi bi-geo-alt-fill', text: t('privacy.contact.location') },
    { icon: 'bi bi-telephone-fill', text: '+250788 437 347', link: 'tel:+250788437347' },
  ];

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
        <h2 className="text-lg font-semibold">{t('privacy.navigation.sections')}</h2>
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
          <h2 className="text-lg font-semibold">{t('privacy.navigation.sections')}</h2>
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
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#0C2D62] mb-2">
            {t('privacy.header.title')}
          </h1>
          <p className="text-xl text-[#083A85] font-bold underline">
            {t('privacy.header.lastUpdated')}
          </p>
          <p className="text-[#0C2D62] mt-4">
            {t('privacy.header.description')}
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
                  {t('privacy.contact.intro')}
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