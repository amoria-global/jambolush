'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from '../lib/LanguageContext';

const AgreementPage: React.FC = () => {
  const t = useTranslations();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Create sections array with translations
  const sections = [
    {
      id: 'our-agreement',
      title: t('agreement.sections.ourAgreement.title'),
      content: t('agreement.sections.ourAgreement.content')
    },
    {
      id: 'introduction',
      title: t('agreement.sections.introduction.title'),
      content: t('agreement.sections.introduction.content')
    },
    {
      id: 'definitions',
      title: t('agreement.sections.definitions.title'),
      content: t('agreement.sections.definitions.content')
    },
    {
      id: 'scope',
      title: t('agreement.sections.scope.title'),
      content: t('agreement.sections.scope.content')
    },
    {
      id: 'registration',
      title: t('agreement.sections.registration.title'),
      content: t('agreement.sections.registration.content')
    },
    {
      id: 'listings',
      title: t('agreement.sections.listings.title'),
      content: t('agreement.sections.listings.content')
    },
    {
      id: 'payments',
      title: t('agreement.sections.payments.title'),
      content: t('agreement.sections.payments.content')
    },
    {
      id: 'cancellations',
      title: t('agreement.sections.cancellations.title'),
      content: t('agreement.sections.cancellations.content')
    },
    {
      id: 'fieldagents',
      title: t('agreement.sections.fieldAgents.title'),
      content: t('agreement.sections.fieldAgents.content')
    },
    {
      id: 'conduct',
      title: t('agreement.sections.conduct.title'),
      content: t('agreement.sections.conduct.content')
    },
    {
      id: 'privacy',
      title: t('agreement.sections.privacy.title'),
      content: t('agreement.sections.privacy.content')
    },
    {
      id: 'liability',
      title: t('agreement.sections.liability.title'),
      content: t('agreement.sections.liability.content')
    },
    {
      id: 'force',
      title: t('agreement.sections.forceMajeure.title'),
      content: t('agreement.sections.forceMajeure.content')
    },
    {
      id: 'disputes',
      title: t('agreement.sections.disputes.title'),
      content: t('agreement.sections.disputes.content')
    },
    {
      id: 'law',
      title: t('agreement.sections.law.title'),
      content: t('agreement.sections.law.content')
    },
    {
      id: 'intellectual',
      title: t('agreement.sections.intellectual.title'),
      content: t('agreement.sections.intellectual.content')
    },
    {
      id: 'modifications',
      title: t('agreement.sections.modifications.title'),
      content: t('agreement.sections.modifications.content')
    },
    {
      id: 'antidiscrimination',
      title: t('agreement.sections.antiDiscrimination.title'),
      content: t('agreement.sections.antiDiscrimination.content')
    },
    {
      id: 'termination',
      title: t('agreement.sections.termination.title'),
      content: t('agreement.sections.termination.content')
    },
    {
      id: 'security',
      title: t('agreement.sections.security.title'),
      content: t('agreement.sections.security.content')
    }
  ];

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
        <h2 className="text-lg font-semibold">{t('agreement.navigation.sections')}</h2>
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
          <h2 className="text-lg font-semibold">{t('agreement.navigation.sections')}</h2>
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
            onClick={() => alert(t('agreement.agreementAlert'))}
            disabled={!buttonEnabled}
            className={`px-4 py-2 bg-[#F20C8F] cursor-pointer text-white text-lg sm:text-lg font-medium rounded-lg transition-colors duration-300 ${
              buttonEnabled ? 'hover:bg-[#F20C8F]/90' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            {t('agreement.agreeButton')}
          </button>
        </div>
      </main>
    </div>
  );
};

export default AgreementPage;