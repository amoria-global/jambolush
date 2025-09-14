'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from '../lib/LanguageContext'

export default function HowItWorksPage() {
  const t = useTranslations()
  const [activeStep, setActiveStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const steps = [
    {
      number: '01',
      title: t('howItWorks.steps.search.title'),
      description: t('howItWorks.steps.search.description'),
      mockupImage: '/search.png'
    },
    {
      number: '02',
      title: t('howItWorks.steps.login.title'),
      description: t('howItWorks.steps.login.description'),
      mockupImage: '/login.png'
    },
    {
      number: '03',
      title: t('howItWorks.steps.book.title'),
      description: t('howItWorks.steps.book.description'),
      mockupImage: '/booking.png'
    },
    {
      number: '04',
      title: t('howItWorks.steps.checkin.title'),
      description: t('howItWorks.steps.checkin.description'),
      mockupImage: '/check.png'
    }
  ]

  const phonePositions = [
    { rotate: -20, translateX: -150, translateY: 30, scale: 0.85 },
    { rotate: -10, translateX: -75, translateY: 15, scale: 0.9 },
    { rotate: 10, translateX: 75, translateY: 15, scale: 0.9 },
    { rotate: 20, translateX: 150, translateY: 30, scale: 0.85 }
  ]

  return (
    <div className="min-h-screen bg-white mt-16 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Header Section */}
      <div className={`max-w-7xl mx-auto text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-5xl md:text-6xl font-bold text-[#083A85] mb-6">
          {t('howItWorks.title')}
        </h1>
        <p className="text-xl text-black max-w-3xl mx-auto">
          {t('howItWorks.subtitle')}
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Steps Section */}
          <div className="space-y-8 order-2 lg:order-1">
            {steps.map((step, index) => (
              <div
                key={index}
                onClick={() => setActiveStep(index)}
                className={`cursor-pointer transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div
                  className={`p-8 rounded-2xl transition-all duration-300 border ${
                    activeStep === index
                      ? 'bg-blue-50 shadow-lg scale-105 border-2 border-blue-200'
                      : 'bg-gray-50 hover:bg-gray-100 hover:shadow-md border-gray-200'
                  }`}
                  onMouseEnter={() => setActiveStep(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-300 ${
                        activeStep === index
                          ? 'bg-[#083A85] text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-[#083A85] mb-3">
                        {step.title}
                      </h3>
                      <p className={`text-black text-lg leading-relaxed transition-all duration-300 ${
                        activeStep === index ? 'opacity-100' : 'opacity-70'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Phone Mockup Section */}
          <div className={`relative flex items-center justify-center h-[600px] order-1 lg:order-2 transition-all duration-1000 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}>
            {/* Background Decoration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            </div>
            
            {/* Phone Container with Fan Layout */}
            <div className="relative w-full h-full flex items-center justify-center">
              {steps.map((step, index) => {
                const isActive = activeStep === index
                const position = phonePositions[index]
                
                return (
                  <div
                    key={index}
                    className={`absolute transition-all duration-700 ease-out`}
                    style={{
                      transform: `
                        translateX(${isActive ? 0 : position.translateX}px) 
                        translateY(${isActive ? 0 : position.translateY}px) 
                        rotate(${isActive ? 0 : position.rotate}deg) 
                        scale(${isActive ? 1 : position.scale})
                      `,
                      zIndex: isActive ? 10 : 5 - Math.abs(index - 2),
                    }}
                  >
                    {/* Phone Frame */}
                    <div className={`relative mx-auto transition-all duration-700 ${
                      isActive ? 'w-[280px] h-[580px]' : 'w-[240px] h-[500px]'
                    }`}>
                      {/* Phone Shadow */}
                      <div className={`absolute inset-0 bg-black/20 rounded-[2.5rem] blur-2xl transform translate-y-4 transition-all duration-700 ${
                        isActive ? 'scale-110 opacity-30' : 'scale-100 opacity-20'
                      }`}></div>
                      
                      {/* Outer Phone Frame */}
                      <div className={`absolute inset-0 bg-gradient-to-br from-gray-800 to-black rounded-[2.5rem] shadow-2xl transition-all duration-700 ${
                        isActive ? 'shadow-2xl' : 'shadow-xl'
                      }`}>
                        {/* Glow Effect for Active */}
                        {isActive && (
                          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-blue-400/20 to-purple-400/20 animate-pulse"></div>
                        )}
                      </div>
                      
                      {/* Screen Area */}
                      <div className="absolute inset-[6px] bg-white rounded-[2.2rem] overflow-hidden">
                        {/* Content Area with Background Image */}
                        <div className="relative w-full h-full">
                          {/* Image Container - clips bottom to hide built-in home indicator */}
                          <div className="absolute inset-0 overflow-hidden">
                            <img 
                              src={step.mockupImage}
                              alt={step.title}
                              className="absolute inset-0 w-full h-full object-contain bg-white"
                            />
                          </div>
                          
                          {/* Status Bar */}
                          <div className="absolute top-0 left-0 right-0 h-10 bg-white/80 backdrop-blur-md flex items-center justify-between px-5 text-[11px] font-semibold text-black z-20">
                            <span>9:41</span>
                            <div className="flex items-center gap-1">
                              {/* Cellular Signal */}
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                              </svg>
                              {/* WiFi */}
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                              </svg>
                              {/* Battery */}
                              <svg className="w-6 h-4" fill="currentColor" viewBox="0 0 24 12">
                                <rect x="1" y="2" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                                <rect x="2" y="3" width="18" height="6" rx="1" fill="currentColor"/>
                                <rect x="22" y="4.5" width="1.5" height="3" rx="0.5" fill="currentColor"/>
                              </svg>
                            </div>
                          </div>
                          
                          {/* Notch (Dynamic Island / Camera) */}
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-black rounded-b-2xl z-30"></div>
                          
                          {/* Our Home Indicator (Bottom Bar) */}
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black rounded-full z-20"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              
              {/* Step Indicators */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex justify-center space-x-2">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveStep(index)}
                    className={`transition-all duration-300 ${
                      activeStep === index
                        ? 'w-8 h-2 bg-[#083A85] rounded-full shadow-lg'
                        : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className={`max-w-4xl mx-auto text-center mt-20 transition-all duration-1000 delay-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="bg-gradient-to-r from-[#083A85]/30 to-[#083A85]/30 rounded-3xl p-12 border border-[#083A85]/20">
          <h2 className="text-3xl font-bold text-[#083A85] mb-4">
            {t('howItWorks.cta.title')}
          </h2>
          <p className="text-lg text-black mb-8">
            {t('howItWorks.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-[#083A85] text-white font-semibold rounded-xl hover:bg-[#06295e] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
              {t('howItWorks.cta.startButton')}
            </button>
            <button className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-gray-200 cursor-pointer">
              {t('howItWorks.cta.learnButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}