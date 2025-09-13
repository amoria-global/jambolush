'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from '../lib/LanguageContext';

const TermsAndConditionsPage: React.FC = () => {
  const t = useTranslations();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Create sections array with translations
  const sections = [
    {
      id: 'welcome',
      title: t('terms.sections.welcome.title'),
      content: t('terms.sections.welcome.content')
    },
    {
      id: 'definitions',
      title: t('terms.sections.definitions.title'),
      content: t('terms.sections.definitions.content')
    },
    {
      id: 'scope',
      title: t('terms.sections.scope.title'),
      content: t('terms.sections.scope.content')
    },
    {
      id: 'accounts',
      title: t('terms.sections.accounts.title'),
      content: t('terms.sections.accounts.content')
    },
    {
      id: 'hosts',
      title: t('terms.sections.hosts.title'),
      content: t('terms.sections.hosts.content')
    },
    {
      id: 'guests',
      title: t('terms.sections.guests.title'),
      content: t('terms.sections.guests.content')
    },
    {
      id: 'payments',
      title: t('terms.sections.payments.title'),
      content: t('terms.sections.payments.content')
    },
    {
      id: 'cancellations',
      title: t('terms.sections.cancellations.title'),
      content: t('terms.sections.cancellations.content')
    },
    {
      id: 'policies',
      title: t('terms.sections.policies.title'),
      content: t('terms.sections.policies.content')
    },
    {
      id: 'intellectual',
      title: t('terms.sections.intellectual.title'),
      content: t('terms.sections.intellectual.content')
    },
    {
      id: 'indemnity',
      title: t('terms.sections.indemnity.title'),
      content: t('terms.sections.indemnity.content')
    },
    {
      id: 'accessibility',
      title: t('terms.sections.accessibility.title'),
      content: t('terms.sections.accessibility.content')
    },
    {
      id: 'force-majeure',
      title: t('terms.sections.forceMajeure.title'),
      content: t('terms.sections.forceMajeure.content')
    },
    {
      id: 'third-party',
      title: t('terms.sections.thirdParty.title'),
      content: t('terms.sections.thirdParty.content')
    },
    {
      id: 'changes',
      title: t('terms.sections.changes.title'),
      content: t('terms.sections.changes.content')
    },
    {
      id: 'liability',
      title: t('terms.sections.liability.title'),
      content: t('terms.sections.liability.content')
    },
    {
      id: 'dispute',
      title: t('terms.sections.dispute.title'),
      content: t('terms.sections.dispute.content')
    },
    {
      id: 'law',
      title: t('terms.sections.law.title'),
      content: t('terms.sections.law.content')
    },
    {
      id: 'language',
      title: t('terms.sections.language.title'),
      content: t('terms.sections.language.content')
    },
    {
      id: 'compliance',
      title: t('terms.sections.compliance.title'),
      content: t('terms.sections.compliance.content')
    },
    {
      id: 'acceptance',
      title: t('terms.sections.acceptance.title'),
      content: t('terms.sections.acceptance.content')
    },
    {
      id: 'entire',
      title: t('terms.sections.entire.title'),
      content: t('terms.sections.entire.content')
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
        <h2 className="text-lg font-semibold">{t('terms.navigation.sections')}</h2>
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
          <h2 className="text-lg font-semibold">{t('terms.navigation.sections')}</h2>
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
            onClick={() => alert(t('terms.agreementAlert'))}
            className={`px-4 py-2 bg-[#F20C8F] text-white text-lg sm:text-lg font-medium rounded-lg transition-colors duration-300 cursor-pointer ${
              buttonEnabled ? 'hover:bg-[#F20C8F]/90' : 'opacity-50'
            }`}
          >
            {t('terms.agreeButton')}
          </button>
        </div>
      </main>
    </div>
  );
};

export default TermsAndConditionsPage;