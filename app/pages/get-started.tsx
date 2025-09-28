"use client";
import React, { useState } from 'react';
import { useLanguage } from '../lib/LanguageContext'; 

const JambolushGetStarted = () => {
  const { t } = useLanguage(); 
  const [currentStep, setCurrentStep] = useState('role-selection');
  const [selectedRoleKey, setSelectedRoleKey] = useState<string | null>(null);

  // DATA: Moved inside the component to access the `t` function.
  // The content is now pulled from your translation files.
  const rolesData = [
    {
      key: 'guest',
      icon: 'bi bi-person',
      title: t('getStarted.roles.guest.title'),
      description: t('getStarted.roles.guest.description'),
      steps: [
        { text: t('getStarted.roles.guest.steps.0'), image: '/guest/pic1.png' },
        { text: t('getStarted.roles.guest.steps.1'), image: '' },
        { text: t('getStarted.roles.guest.steps.2'), image: '/guest/pic2.png' },
        { text: t('getStarted.roles.guest.steps.3'), image: '/guest/pic3.png' },
        { text: t('getStarted.roles.guest.steps.4'), image: '/guest/pic4.png' },
        { text: t('getStarted.roles.guest.steps.5'), image: '/guest/pic5.png' },
        { text: t('getStarted.roles.guest.steps.6'), image: '/guest/pic6.png' },
        { text: t('getStarted.roles.guest.steps.7'), image: '/guest/pic7.png' },
        { text: t('getStarted.roles.guest.steps.8'), image: '/guest/pic8.png' },
        { text: t('getStarted.roles.guest.steps.9'), image: '/guest/pic9.png' },
        { text: t('getStarted.roles.guest.steps.10'), image: '/guest/pic10.png' },
      ],
      tip: t('getStarted.roles.guest.tip'),
    },
    {
      key: 'propertyOwner',
      icon: 'bi bi-briefcase',
      title: t('getStarted.roles.propertyOwner.title'),
      description: t('getStarted.roles.propertyOwner.description'),
      steps: [
        { text: t('getStarted.roles.propertyOwner.steps.0'), image: '/host/pic1.png' },
        { text: t('getStarted.roles.propertyOwner.steps.1') },
        { text: t('getStarted.roles.propertyOwner.steps.2') },
        { text: t('getStarted.roles.propertyOwner.steps.3') },
        { text: t('getStarted.roles.propertyOwner.steps.4'), image: '/host/pic2.png' },
        { text: t('getStarted.roles.propertyOwner.steps.5'), image: '/host/pic3.png' },
        { text: t('getStarted.roles.propertyOwner.steps.6'), image: '/host/pic4.png' },
        { text: t('getStarted.roles.propertyOwner.steps.7'), image: '/host/pic5.png' },
        { text: t('getStarted.roles.propertyOwner.steps.8'), image: '/host/pic6.png' },
      ],
      tip: t('getStarted.roles.propertyOwner.tip'),
    },
    {
      key: 'tourGuide',
      icon: 'bi bi-compass',
      title: t('getStarted.roles.tourGuide.title'),
      description: t('getStarted.roles.tourGuide.description'),
      steps: [
        { text: t('getStarted.roles.tourGuide.steps.0'), image: '/tour-guide/pic1.png' },
        { text: t('getStarted.roles.tourGuide.steps.1') },
        { text: t('getStarted.roles.tourGuide.steps.2') },
        { text: t('getStarted.roles.tourGuide.steps.3'), image: '/tour-guide/pic2.png' },
        { text: t('getStarted.roles.tourGuide.steps.4'), image: '/tour-guide/pic3.png' },
        { text: t('getStarted.roles.tourGuide.steps.5'), image: '/tour-guide/pic4.png' },
        { text: t('getStarted.roles.tourGuide.steps.6'), image: '/tour-guide/pic5.png' },
        { text: t('getStarted.roles.tourGuide.steps.7'), image: '/tour-guide/pic6.png' },
      ],
      tip: t('getStarted.roles.tourGuide.tip'),
    },
    {
      key: 'fieldAgent',
      icon: 'bi bi-geo-alt',
      title: t('getStarted.roles.fieldAgent.title'),
      description: t('getStarted.roles.fieldAgent.description'),
      steps: [
        { text: t('getStarted.roles.fieldAgent.steps.0'), image: '/agent/pic1.png' },
        { text: t('getStarted.roles.fieldAgent.steps.1') },
        { text: t('getStarted.roles.fieldAgent.steps.2') },
        { text: t('getStarted.roles.fieldAgent.steps.3') },
        { text: t('getStarted.roles.fieldAgent.steps.4') },
        { text: t('getStarted.roles.fieldAgent.steps.5'), image: '/agent/pic2.png' },
        { text: t('getStarted.roles.fieldAgent.steps.6'), image: '/agent/pic3.png' },
        { text: t('getStarted.roles.fieldAgent.steps.7'), image: '/agent/pic4.png' },
        { text: t('getStarted.roles.fieldAgent.steps.8'), image: '/agent/pic5.png' },
        { text: t('getStarted.roles.fieldAgent.steps.9'), image: '/agent/pic6.png' },
        { text: t('getStarted.roles.fieldAgent.steps.10'), image: '/agent/pic7.png' },
      ],
      tip: t('getStarted.roles.fieldAgent.tip'),
    },
  ];

  const handleRoleSelection = (roleKey: string) => {
    setSelectedRoleKey(roleKey);
    setCurrentStep('details-view');
  };

  const handleGoBack = () => {
    setCurrentStep('role-selection');
    setSelectedRoleKey(null);
  };

  const selectedRoleData = rolesData.find(role => role.key === selectedRoleKey);

  return (
    <div className="font-sans bg-gray-50 min-h-screen py-12 mt-20">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet" />
      
      {currentStep === 'role-selection' && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-10">
            <h1 className="mt-8 sm:mt-0 text-xl sm:text-3xl font-bold text-[#083A85]">
              {t('getStarted.title')}
            </h1>
            <p className="text-lg font-semibold text-gray-800 max-w-xl mx-auto">
              {t('getStarted.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rolesData.map((role) => (
              <RoleCard
                key={role.key}
                icon={role.icon}
                title={role.title}
                description={role.description}
                onClick={() => handleRoleSelection(role.key)}
              />
            ))}
          </div>
        </div>
      )}

      {currentStep === 'details-view' && selectedRoleData && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-200">
              <button
                onClick={handleGoBack}
                className="p-2 text-[#083A85] hover:bg-gray-100 rounded-md transition-colors duration-200 flex-shrink-0 cursor-pointer"
              >
                <i className="bi bi-chevron-left text-lg"></i>
              </button>
              <h2 className="text-lg sm:text-2xl font-bold text-[#083A85]">
                {t('getStarted.gettingStartedAs', { title: selectedRoleData.title })}
              </h2>
            </div>

            <div className="space-y-8">
                <div className="space-y-8">
                  {selectedRoleData.steps.map((step, index) => (
                    <div key={index}>
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 bg-[#083A85] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-base mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-lg text-gray-900 leading-relaxed flex-1">
                          {step.text}
                        </p>
                      </div>
                      {step.image && (
                        <div className="mt-4 pl-12">
                          <img
                            src={step.image}
                            alt={`Visual guide for step ${index + 1}`}
                            className="w-full h-auto object-cover rounded-lg border border-gray-200 shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mt-8">
                <h4 className="font-semibold text-blue-800 text-base">{t('getStarted.proTip')}</h4>
                <p className="text-blue-700 text-base">{selectedRoleData.tip}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// This sub-component does not need changes as it receives translated props.
interface RoleCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ icon, title, description, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-lg border border-gray-200 hover:border-[#F20C8F] cursor-pointer transition-all duration-300 p-6 hover:shadow-md group text-center"
  >
    <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-14 h-14 bg-[#083A85] rounded-lg flex items-center justify-center group-hover:bg-[#F20C8F] transition-colors duration-200">
            <i className={`${icon} text-white text-xl`}></i>
        </div>
        <div className="space-y-2">
            <h3 className="text-xl font-semibold text-[#083A85] group-hover:text-[#F20C8F] transition-colors duration-200">{title}</h3>
            <p className="text-base text-gray-900 leading-relaxed">{description}</p>
        </div>
    </div>
  </div>
);

export default JambolushGetStarted;